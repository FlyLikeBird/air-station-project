import { 
    getDeviceList,
    addDevice,
    updateDevice,
    delDevice,
    getBindMeter,
    getDeviceTypes,
    getDeviceInfoList,
    getDeviceDetail,
    getStationInfo
} from '../services/deviceService';
import { getGasEffChart } from '../services/gasMonitorService';
import moment from 'moment';
import { apiToken, encryptBy } from '@/pages/utils/encryption';
const date = new Date();
let typesMap = {
    'pressure':2,
    'speed':1,
    'flow':4,
    'temp':5
}
const initialState = {
    isLoading:true,
    list:[],
    currentPage:1,
    total:0,
    // 绑定的采集器设备列表
    meterList:[],
    stationList:[],
    currentStation:{},
    stationInfoList:[
        { title:'总管压力', key:'pressure', alue:0, unit:'bar' },
        { title:'瞬时流量', key:'speed', value:0, unit:'m³/min' },
        { title:'今日累计流量', key:'flow', value:0, unit:'m³'},
        { title:'露点温度', key:'temp', value:0, unit:'℃' }
    ],
    pressureChartInfo:{},
    speedChartInfo:{},
    flowChartInfo:{},
    tempChartInfo:{},
    deviceInfoList:[],
    detailInfo:{},
    detailLoading:true
};

export default {
    namespace:'device',
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
        *fetchMeter(action, { put, select, call }){
            let { user:{ company_id }} = yield select();
            let { keyword } = action.payload || {};
            let { data } = yield call(getBindMeter, { company_id, keyword });
            if ( data && data.code === '0'){
                yield put({ type:'getBindMeter', payload:{ data:data.data }});
            }
        },
        *fetchDeviceList(action, { put, select, call }){
            let { user:{ company_id }} = yield select();
            let { currentPage } = action.payload || {};
            currentPage = currentPage || 1;
            yield put({ type:'toggleLoading'});
            let { data } = yield call(getDeviceList, { company_id, page:currentPage, pagesize:12 });
            if ( data && data.code === '0'){
                yield put({ type:'getDeviceList', payload:{ data:data.data, currentPage, total:data.count  }});
            }
        },
        *add(action, { put, select, call }){
            let { user:{ company_id }} = yield select();
            let { values, resolve, reject, forEdit } = action.payload || {};
            values.company_id = company_id;
            let { data } = yield call( forEdit ? updateDevice : addDevice, values);
            if ( data && data.code === '0' ){
                yield put({ type:'fetchDeviceList'});
                if ( resolve && typeof resolve === 'function') resolve();
            } else {
                if ( reject && typeof reject === 'function') reject(data.msg);
            }
        },
        *del(action, { put, select, call }){
            let { resolve, reject, device_id } = action.payload || {};
            let { data } = yield call(delDevice, { device_id });
            if ( data && data.code === '0' ){
                yield put({ type:'fetchDeviceList'});
                if ( resolve && typeof resolve === 'function') resolve();
            } else {
                if ( reject && typeof reject === 'function') reject(data.msg);
            }
        },
        *initInfoList(action, { put }){
            yield put.resolve({ type:'fetchDeviceTypes'});
            yield put({ type:'fetchInfoList'});
            yield put({ type:'fetchStationInfo'});
            yield put({ type:'fetchStationChart', payload:{ type:'pressure'}});
            yield put({ type:'fetchStationChart', payload:{ type:'speed'}});
            yield put({ type:'fetchStationChart', payload:{ type:'flow'}});
            yield put({ type:'fetchStationChart', payload:{ type:'temp'}});
        },
        *fetchStationChart(action, { put, select, call }){
            let { type } = action.payload || {};
            let { user:{ company_id, timeType, startDate, endDate }, device:{ currentStation }} = yield select();
            let { data } = yield call(getGasEffChart, { company_id, device_id:currentStation.device_id, begin_date:startDate.format('YYYY-MM-DD'), end_date:endDate.format('YYYY-MM-DD'), time_type:timeType, type:typesMap[type] });
            if ( data && data.code === '0'){
                yield put({ type:'getStationChartResult', payload:{ data:data.data, type }});
            }
        },
        *fetchDeviceTypes(action, { put, select, call}){
            let { user:{ company_id }} = yield select();
            let { data } = yield call(getDeviceTypes, { company_id });
            if ( data && data.code === '0'){
                yield put({ type:'getDeviceTypes', payload:{ data:data.data }});
            }
        },
        *fetchInfoList(action, { put, select, call}){
            let { user:{ company_id, containerWidth }, device:{ currentStation }} = yield select();
            let { currentPage } = action.payload || {};
            currentPage = currentPage || 1;
            yield put({ type:'toggleLoading'});
            let { data } = yield call(getDeviceInfoList, { company_id, device_id:currentStation.device_id });
            if ( data && data.code === '0'){
                yield put({ type:'getInfoList', payload:{ data:data.data, currentPage, total:data.count }});
            }
        },
        *fetchStationInfo(action, { put, select, call }){
            let { user:{ company_id }, device:{ currentStation }} = yield select();
            let { data } = yield call(getStationInfo, { company_id, device_id:currentStation.device_id });
            if ( data && data.code === '0'){
                yield put({ type:'getStationResult', payload:{ data:data.data }});
            }
        },
        *fetchDeviceDetail(action, { put, select, call }){
            let { user:{ company_id, startDate }} = yield select();
            let { device_id, date_time } = action.payload || {};
            yield put({ type:'toggleDetailLoading'});
            let { data } = yield call(getDeviceDetail, { company_id, device_id, date_time:startDate.format('YYYY-MM-DD') });
            if ( data && data.code === '0'){
                yield put({ type:'getDeviceDetail', payload:{ data:data.data }});
            }
        }
        
    },
    reducers:{
        
        toggleLoading(state){
            return { ...state, isLoading:true };
        },
        toggleDetailLoading(state){
            return { ...state, detailLoading:true };
        },
        getDeviceList(state, { payload:{ data, currentPage, total }}){
            return { ...state, list:data, currentPage, total, isLoading:false };
        },
        getBindMeter(state, { payload:{ data }}){
            return { ...state, meterList:data };
        },
        getDeviceTypes(state, { payload:{ data }}){
            let currentStation = data && data.length ? data[0] : {};
            return { ...state, stationList:data, currentStation };
        },
        getInfoList(state, { payload:{ data, currentPage, total }}){
            return { ...state, deviceInfoList:data, currentPage, total, isLoading:false };
        },
        toggleStation(state, { payload }){
            return { ...state, currentStation:payload };
        },
        getDeviceDetail(state, { payload:{ data }}){
            return { ...state, detailInfo:data, detailLoading:false };
        },
        getStationResult(state, { payload:{ data }}){
            let result = state.stationInfoList.map(i=>{
                i.value = data[i.key];
                return i;
            });
            return { ...state, stationInfoList:result };
        },
        getStationChartResult(state, { payload:{ data, type }}){
            if ( type === 'speed') {
                return { ...state, speedChartInfo:data };
            } else if ( type === 'pressure'){
                return { ...state, pressureChartInfo:data };
            } else if ( type === 'flow') {
                return { ...state, flowChartInfo:data };
            } else if ( type === 'temp') {
                return { ...state, tempChartInfo:data };
            }
            return state;
        },
        resetDetail(state){
            return { ...state, detailInfo:{}, detailLoading:true };
        },
        reset(state){
            return initialState;
        } 
    }
}


