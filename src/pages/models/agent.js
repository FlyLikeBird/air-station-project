import { 
    getAgentIndex,
    getCompanyTree,
    getDeviceModel, getGasCompanys, getGateways, addGateway, updateGateway, deleteGateway, 
    getDevices, addDevice, updateDevice, delDevice,
    getDeviceRecord
} from '../services/agentService';
const initialState = {
    treeLoading:true,
    treeData:[],
    sourceTreeData:{},
    // 企业树状结构的当前节点，值为 省|市|区|企业终端
    currentNode:{},
    companyList:[],
    currentCompany:{},
    gasCompanys:[],
    activeKey:'gateway',
    sceneType:0,
    gatewayModelList:[],
    deviceModelList:[],
    networkModelList:[],
    gatewayList:[],
    currentGateway:{},
    isLoading:true,
    currentPage:1,
    total:0,
    deviceList:[],
    recordList:[],
    monitorInfo:{}
}

export default {
    namespace:'agent',
    state:initialState,
    effects:{
        *cancelable({ task, payload, action }, { call, race, take}) {
            yield race({
                task:call(task, payload),
                cancel:take(action)
            })
        },
        // 统一取消所有action
        *cancelAll(action, { put }){
            yield put({ type:'reset'});
        },
        *fetchIndex(action, { call, put }){
            // yield put.resolve({ type:'fetchCompanyTree', payload:{ keepNode:{ key:'zh' }} });
            yield put({ type:'toggleTreeLoading' });
            let { data } = yield call(getAgentIndex);
            if ( data && data.code === '0'){
                yield put({ type:'getIndexResult', payload:{ data:data.data }});
            } 
        },
        
        *fetchCompanyTree(action, { put, call, select }){
            let { gateway:{ treeData, sourceTreeData }} = yield select();
            let { single, keepNode, forceUpdate } = action.payload || {};
            if ( !treeData.length || forceUpdate ){
                yield put({ type:'toggleTreeLoading'});
                let { data } = yield call(getCompanyTree);
                if ( data && data.code === '0'){
                    yield put({ type:'getCompanyTreeResult', payload:{ data:data.data, single, keepNode }});
                }
            } else {
                // 更新缓存里的树状图结构
                yield put({ type:'getCompanyTreeResult', payload:{ data:sourceTreeData, single, keepNode } });
            }
        }
    },
    reducers:{
        toggleLoading(state){
            return { ...state, isLoading:true };
        },
        toggleTreeLoading(state){
            return { ...state, treeLoading:true };
        },
        getIndexResult(state, { payload:{ data, single, keepNode }}){
            let infoList = [], result = [], companyList = [] ;
            infoList.push({ title:'运行', value:data.runInfo.runCnt || 0, unit:'台' });
            infoList.push({ title:'停机', value:data.runInfo.stopCnt || 0, unit:'台' });
            infoList.push({ title:'未保养', value:data.runInfo.unMaintainCnt || 0, unit:'台', color:'#feb72c' });
            infoList.push({ title:'故障', value:data.runInfo.faultCnt || 0, unit:'台', color:'#fe2c2d' });
            data.infoList = infoList;
            formatTreeData(data.companyAddress, result, companyList, false);

            return { ...state, monitorInfo:data, sourceTreeData:data.companyAddress, treeData:result, currentNode:keepNode && keepNode.key ? keepNode : single ? companyList.length ? companyList[0] : {} : {}, treeLoading:false  };
        },
        // 筛选树结构
        setTree(state, { payload:{ keyword, single }}){
            let prevTreeData = [], result = [], prevCompanyList = [], companyList = [];
            formatTreeData(state.sourceTreeData, prevTreeData, prevCompanyList, single);
            if ( keyword ){
                getNewTree(prevTreeData, result, keyword );
                getNodeCompanys(result, companyList);
            } else {
                result = prevTreeData;
                companyList = prevCompanyList; 
            }
            return { ...state, treeData:result, currentNode: single ? companyList && companyList.length ? companyList[0] : {} : result && result.length ? result[0] : {} }
        },
    
        setActiveKey(state, { payload }){
            return { ...state, activeKey:payload };
        },
        toggleCurrentNode(state, { payload }){
            return { ...state, currentNode:payload };
        },
       
        reset(state){
            return initialState;
        }
    }
}
// "data": {
//     "广东省": {
//         "惠州市": {
//             "仲恺高新区": [
//                 {
//                     "title": "测试燃气监测企业",
//                     "key": 44
//                 }
//             ]
//         }
//     }
// },
function formatTreeData(data, result, companyList, single){
    if ( !data ) return;
    Object.keys(data).forEach(province=>{
        let provinceData = {};
        provinceData.title = province;
        
        provinceData.key = province;
        provinceData.type = 'province';
        provinceData.children = [];
        provinceData.disabled = single ? true : false;
        Object.keys(data[province]).forEach(city=>{
            let cityData = {};
            cityData.title = city;
            cityData.key = city;
            cityData.type = 'city';
            cityData.disabled = single ? true : false;
            cityData.children = [];
            // 考虑直辖市两个层级的情况，此时data[province][city]为数组
            if ( data[province][city].length ) {
                cityData.children = data[province][city].map(item=>{
                    // 汇总所有企业终端用户
                    companyList.push(item);
                    return { ...item, type:'company' };
                });
            } else {
                Object.keys(data[province][city]).forEach(area=>{
                    let areaData = {};
                    areaData.title = area;
                    areaData.key = area;
                    areaData.type = 'area';
                    areaData.disabled = single ? true : false;
                    areaData.children = data[province][city][area].map(item=>{
                        // 汇总所有企业终端用户
                        companyList.push(item);
                        return { ...item, type:'company' };
                    });
                    cityData.children.push(areaData);
                });
            }
            provinceData.children.push(cityData);
        });
        result.push(provinceData);
    });
}


function getNewTree(data, result, keyword ) {
    data.forEach(item=>{
        if ( keyword && item.title.includes(keyword)) {
            result.push(item);
            return ;
        } else {
            if ( item.children && item.children.length ){
                getNewTree(item.children, result, keyword );
            }
        }
    })
}

function getNodeCompanys(data, companyList){
    data.forEach(item=>{
        if ( item.type === 'company') {
            companyList.push(item);
        }
        if ( item.children && item.children.length ) {
            getNodeCompanys(item.children, companyList);
        }
    })
}

function filterUserType(data, result, userType){
    data.forEach(item=>{
        if ( item.combust_type === userType ) {
            result.push(item);
        }
        if ( item.children && item.children.length ){
            filterUserType(item.children, result, userType);
        }
    })
}
