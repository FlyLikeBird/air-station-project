import { 
    getDeviceTree
} from '../services/gasMachService';
import { getAirMachData } from '../services/stationService';
import moment from 'moment';
import { apiToken, encryptBy } from '@/pages/utils/encryption';
const date = new Date();
const initialState = {
    machTree:[],
    currentNode:{},
    currentMach:{},
    treeLoading:true,
    //空压机列表的气压数据
    airMachStatus:[]
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
        }
    },
    reducers:{
        toggleTreeLoading(state, { payload }){
            return { ...state, treeLoading:true };
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
        reset(state){
            return initialState;
        } 
    }
}


