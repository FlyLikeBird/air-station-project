import { 
    getDeviceList,
    addDevice,
    updateDevice,
    delDevice,
    getBindMeter,
    getDeviceTypes,
    getDeviceInfoList,
    getDeviceDetail
} from '../services/deviceService';
import moment from 'moment';
import { apiToken, encryptBy } from '@/pages/utils/encryption';
const date = new Date();
const initialState = {
    isLoading:true,
    list:[],
    currentPage:1,
    total:0,
    // 绑定的采集器设备列表
    meterList:[],
    deviceTypes:[],
    currentType:{},
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
        },
        *fetchDeviceTypes(action, { put, select, call}){
            let { user:{ company_id }} = yield select();
            let { data } = yield call(getDeviceTypes, { company_id });
            if ( data && data.code === '0'){
                yield put({ type:'getDeviceTypes', payload:{ data:data.data }});
            }
        },
        *fetchInfoList(action, { put, select, call}){
            let { user:{ company_id, containerWidth }, device:{ currentType }} = yield select();
            let { currentPage } = action.payload || {};
            currentPage = currentPage || 1;
            yield put({ type:'toggleLoading'});
            let { data } = yield call(getDeviceInfoList, { company_id, device_type:currentType.device_type, page:currentPage, pagesize: containerWidth <= 1440 ? 9 : 12 });
            if ( data && data.code === '0'){
                yield put({ type:'getInfoList', payload:{ data:data.data, currentPage, total:data.count }});
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
            let currentType = data && data.length ? data[0] : {};
            return { ...state, deviceTypes:data, currentType };
        },
        getInfoList(state, { payload:{ data, currentPage, total }}){
            return { ...state, deviceInfoList:data, currentPage, total, isLoading:false };
        },
        toggleDeviceType(state, { payload }){
            return { ...state, currentType:payload };
        },
        getDeviceDetail(state, { payload:{ data }}){
            return { ...state, detailInfo:data, detailLoading:false };
        },
        resetDetail(state){
            return { ...state, detailInfo:{}, detailLoading:true };
        },
        reset(state){
            return initialState;
        } 
    }
}


