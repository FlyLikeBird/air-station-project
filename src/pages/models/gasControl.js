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
    namespace:'gasControl',
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
        
        
    },
    reducers:{
        
        toggleLoading(state){
            return { ...state, isLoading:true };
        },
        toggleDetailLoading(state){
            return { ...state, detailLoading:true };
        },
        
        reset(state){
            return initialState;
        } 
    }
}


