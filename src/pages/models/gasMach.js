import { 
    getDeviceTree,
    getStationStatus,
    getPlanList, getPlanDetail, getPlanMachs, addPlan, updatePlan, delPlan, pushPlan
} from '../services/gasMachService';
import { getAirMachData } from '../services/stationService';
const date = new Date();
const initialState = {
    machTree:[],
    currentNode:{},
    currentMach:{},
    treeLoading:true,
    stationMachList:[],
    //空压机列表的气压数据
    airMachStatus:[],
    // 系统控制-控制方案/记录相关状态
    isLoading:true,
    currentPage:1,
    total:0,
    planList:[],
    planMachs:[],
    planDetail:{}
};

export default {
    namespace:'gasMach',
    state:initialState,
    effects:{
        *cancelable({ task, payload, action }, { call, race, take}) {
            yield race({
                task:call(task, payload),
                cancel:take(action)
            })
        },
        *cancelAll(action, { put }){
            yield put({ type:'reset'});
        },
        *init(action, { put }){
            let { mode } = action.payload || {};
            yield put.resolve({ type:'fetchGasStation', payload:{ mode }});
        },
        *fetchStationStatus(action, { put, call, select }){
            try {
                let { user:{ company_id }} = yield select();
                yield put({ type:'toggleLoading'});
                let { data } = yield call(getStationStatus, { company_id });
                if ( data && data.code === '0'){
                    yield put({ type:'getStationResult', payload:{ data:data.data }});
                }
            } catch(err){
                
            }
        },
        *fetchGasStation(action, { put, select, call }){
            let { user:{ company_id }, gasMach:{ machTree }} = yield select();
            let { forceUpdate, mode } = action.payload || {};
            if ( !machTree.length || forceUpdate ) {
                yield put({ type:'toggleTreeLoading'} );
                let { data } = yield call(getDeviceTree, { company_id });
                if ( data && data.code === '0'){
                    yield put({ type:'getGasStation', payload:{ data:data.data, mode }});
                }
            } else {
                yield put({ type:'updateGasStation', payload:{ mode }});
            }
        },
        *initAirMachControl(action, { select, put }){
            yield put.resolve({ type:'init' });
            yield put({ type:'fetchAirMachStatus'});            
            
        },
        *fetchAirMachStatus(action, { all, call, select, put }){
            let { user:{ company_id }, gasMach:{ currentNode }} = yield select();
            let machList = currentNode.child || [];
            let data = yield all(
                machList.map((item,index)=>{
                    return call(getAirMachData, { company_id, mach_type:'gas', register_code:item.air_register_code })
                })
            );
            let temp = data.map(i=>i.data.data );
            if ( data && data.length ){
                yield put({ type:'getAirMachStatus', payload:{ airMachStatus:temp }})
            }
        },
        *fetchPlanList(action, { call, select, put }){
            let { user:{ company_id }} = yield select();
            let { currentPage } = action.payload || {};
            currentPage = currentPage || 1;
            yield put({ type:'toggleLoading'});
            let { data } = yield call(getPlanList, { company_id, page:currentPage, page_size:14 });
            if ( data && data.code === '0'){
                yield put({ type:'getPlanListResult', payload:{ data:data.data, currentPage, total:data.count }});
            }
        },
        *fetchPlanMachs(action, { call, select, put }){
            let { user:{ company_id }} = yield select();
            let { data } = yield call(getPlanMachs, { company_id });
            if ( data && data.code === '0'){
                yield put({ type:'getPlanMachsResult', payload:{ data:data.data }});
            }
        },
        *fetchPlanDetail(action, { call, select, put }){
            let { plan_id } = action.payload || {};
            let { data } = yield call(getPlanDetail, { plan_id });
            if ( data && data.code === '0'){
                yield put({ type:'getPlanDetailResult', payload:{ data:data.data }});
            }
        },
        *addPlanAsync(action, { call, select, put}){
            let { user:{ company_id }} = yield select();
            let { values, resolve, reject, forEdit } = action.payload || {};
            values.company_id = company_id;
            let { data } = yield call(forEdit ? updatePlan : addPlan, values);
            if ( data && data.code === '0'){
                yield put({ type:'fetchPlanList'});
                if ( resolve ) resolve();
            } else {
                if ( reject ) reject(data.msg);
            }
        },
        *pushPlanAsync(action, { call, select, put }){
            let { plan_id, resolve, reject } = action.payload || {};
            let { data } = yield call(pushPlan, { plan_id });
            if ( data && data.code === '0' ){
                yield put({ type:'fetchPlanList'});
                if ( resolve ) resolve();
            } else {
                if ( reject ) reject(data.msg);
            }
        },
        *delPlanAsync(action, { call, select, put }){
            let { plan_id, resolve, reject } = action.payload || {};
            let { data } = yield call(delPlan, { plan_id });
            if ( data && data.code === '0' ){
                yield put({ type:'fetchPlanList'});
                if ( resolve ) resolve();
            } else {
                if ( reject ) reject(data.msg);
            }
        }
    },
    reducers:{
        toggleLoading(state){
            return { ...state, isLoading:true };
        },
        toggleTreeLoading(state, { payload }){
            return { ...state, treeLoading:true };
        },
        getStationResult(state, { payload:{ data }}){
            return { ...state, stationMachList:data, isLoading:false };
        },
        getGasStation(state, { payload:{ data, mode  }}){
            let currentNode = data && data.length ? data[0] : {};
            let currentMach = currentNode.child && currentNode.child.length ? currentNode.child[0] : {};
            data.forEach(item=>{
                if( item.device_id ){
                    if ( mode === 'single') {
                        item.disabled = true;
                    } else {
                        item.disabled = false;
                    }
                    item.title = item.device_name;
                    item.key = item.device_id;
                }
                if ( item.child && item.child.length ){
                    item.child.forEach(sub=>{
                        sub.title = sub.device_name;
                        sub.key = sub.device_id;
                    })
                }
                item.children = item.child;
            });
            return { ...state, machTree:data, currentNode, currentMach, treeLoading:false };
        },
        updateGasStation(state, { payload:{ mode }}){
            let currentNode = state.machTree && state.machTree.length ? state.machTree[0] : {};
            let temp = state.machTree.map(item=>{
                if( item.device_id ){
                    if ( mode === 'single') {
                        item.disabled = true;
                    } else {
                        item.disabled = false;
                    }
                    item.title = item.device_name;
                    item.key = item.device_id;
                }
                if ( item.child && item.child.length ){
                    item.child.forEach(sub=>{
                        sub.title = sub.device_name;
                        sub.key = sub.device_id;
                    })
                }
                item.children = item.child;
                return item;
            });
            return { ...state, machTree:temp, currentNode };
        },
        toggleNode(state, { payload }){
            return { ...state, currentNode:payload };
        },
        toggleMach(state, { payload }){
            return { ...state, currentMach:payload };
        },
        getAirMachStatus(state, { payload:{ airMachStatus }}){
            return { ...state, airMachStatus }
        },
        getPlanListResult(state, { payload:{ data, currentPage, total }}){
            return { ...state, planList:data, currentPage, total, isLoading:false };
        },
        getPlanMachsResult(state, { payload:{ data }}){
            return { ...state, planMachs:data };
        },
        getPlanDetailResult(state, { payload:{ data }}){
            return { ...state, planDetail:data };
        },
        reset(state){
            return initialState;
        } 
    }
}


