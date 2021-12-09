import { 
    getReportData
} from '../services/reportService';
import moment from 'moment';
import { apiToken, encryptBy } from '@/pages/utils/encryption';
const date = new Date();
const initialState = {
    currentDate:moment(date).subtract(1,'months'),
    isLoading:true,
    reportInfo:{}
};

export default {
    namespace:'report',
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
        *fetchReport(action, { put, select, call }){
            let { user:{ company_id }, report:{ currentDate }} = yield select();
            let { resolve, reject } = action.payload || {};
            let dateStr = currentDate.format('YYYY-MM-DD').split('-');
            yield put({ type:'toggleLoading'});
            let { data } = yield call(getReportData, { company_id, year:dateStr[0], month:dateStr[1] });
            if ( data && data.code === '0'){
                yield put({ type:'getReportResult', payload:{ data:data.data }});
                if ( resolve && typeof resolve === 'function') resolve();
            } else {
                if ( reject && typeof reject === 'function') reject(data.msg);
            }
        }
    },
    
    reducers:{    
        toggleLoading(state){
            return { ...state, isLoading:true };
        },
        getReportResult(state, { payload:{ data }}){
            return { ...state, reportInfo:data, isLoading:false };  
        },
        getMachs(state, { payload:{ data }}){
            return { ...state, ruleMachs:data };
        },
        setDate(state, { payload }){
            return { ...state, currentDate:payload };
        },
        reset(state){
            return initialState;
        } 
    }
}


