import { 
    getDeviceList, addDevice, updateDevice, delDevice, getBindMeter, getDeviceTypes,
    getUnctrlTime, setUnctrlTime
} from '../services/deviceService';
import { uploadImg } from '../services/deviceModelService';
import moment from 'moment';
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
    detailLoading:true,
    // 设置未开启智控的基准方案时间段,
    basicTimeInfo:{}
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
        *fetchTimeInfo(action, { put, select, call }){
            let { user:{ company_id }} = yield select();
            yield put({ type:'toggleLoading'});
            let { data } = yield call(getUnctrlTime, { company_id });
            if ( data && data.code === '0'){
                yield put({ type:'getTimeInfoResult', payload:{ data:data.data }});
            }
        },
        *setTimeInfo(action, { put, select, call }){
            let { user:{ company_id }} = yield select();
            let { begin_date, end_date, resolve, reject, file } = action.payload;
            let params = { company_id, begin_date, end_date };
            if ( file ) {
                let fileObj = yield call(uploadImg, { file })
                console.log(fileObj);
                params.file_path = fileObj.data.data.filePath;
                params.is_freeze = 1;
            }      
            let { data } = yield call(setUnctrlTime, params);
            if ( data && data.code === '0'){
                yield put({ type:'fetchTimeInfo'});
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
        toggleDetailLoading(state){
            return { ...state, detailLoading:true };
        },
        getTimeInfoResult(state, { payload:{ data }}){
            return { ...state, basicTimeInfo:data, isLoading:false }
        },
        reset(state){
            return initialState;
        } 
    }
}


