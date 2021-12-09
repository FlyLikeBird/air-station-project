import { 
    getWarningList,
    getWarningAanlyze,
    getLogType,
    getHistoryLog,
    getProgressLog,
    confirmRecord,
    uploadImg,
    getMachs,
    getRuleList,
    getRuleType,
    addRule,
    updateRule,
    deleteRule
} from '../services/alarmService';
import moment from 'moment';
import { apiToken, encryptBy } from '@/pages/utils/encryption';
const date = new Date();
const initialState = {
    isLoading:true,
    list:[],
    currentPage:1,
    total:0,
    logTypes:[],
    progressLog:[],
    historyLog:[],
    chartInfo:{},
    chartLoading:true,
    // 告警规则设置
    ruleList:[],
    ruleType:[],
    ruleMachs:[]
};

export default {
    namespace:'alarm',
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
        *initAlarmList(action, { put }){
            yield put.resolve({ type:'gasMach/init' });
            yield put({ type:'fetchAlarmList'});
            yield put({ type:'fetchLogType'});
        },
        *fetchAlarmList(action, { put, select, call }){
            let { user:{ company_id }, gasMach:{ currentNode }} = yield select();
            let { currentPage } = action.payload || {};
            currentPage = currentPage || 1;
            yield put({ type:'toggleLoading'});
            let { data } = yield call(getWarningList, { company_id, device_id:currentNode.key, page:currentPage, pagesize:12 });
            if ( data && data.code === '0'){
                yield put({ type:'getWarningList', payload:{ data:data.data, currentPage, total:data.count  }});
            }
        },
        *fetchLogType(action, { put, call }){
            let { data } = yield call(getLogType);
            if ( data && data.code === '0'){
                yield put({ type:'getLogType', payload:{ data:data.data }});
            }
        },
        *fetchAlarmAnalyze(action, { put, select, call }){
            let { user:{ company_id, timeType, startDate, endDate }, gasMach:{ currentNode }} = yield select();
            yield put({ type:'toggleChartLoading'});
            let { data } = yield call(getWarningAanlyze, { company_id, device_id:currentNode.device_id, time_type:timeType, begin_date:startDate.format('YYYY-MM-DD'), end_date:endDate.format('YYYY-MM-DD')});
            if ( data && data.code === '0' ){
                yield put({ type:'getAnalyze', payload:{ data:data.data }});
            }
        },
        *fetchRecordHistory(action, { call, put}){
            try {
                let { data } = yield call(getHistoryLog, { mach_id: action.payload });
                if ( data && data.code === '0'){
                    yield put({type:'getRecordHistory', payload:{ data:data.data }});
                }
                console.log(data);
            } catch(err){
                console.log(err);
            }
        },
        *fetchProgressInfo(action, { call, put}){
            try {
                let { data } = yield call(getProgressLog, { record_id:action.payload });
                if ( data && data.code ){
                    yield put({type:'getProgress', payload:{ data:data.data }});
                }
            } catch(err){
                console.log(err);
            }
        },
        *confirmRecord(action, { select, call, put, all }){
            try {
                let { user:{ company_id }} = yield select();
                let { resolve, reject, values } = action.payload;
                // photos字段是上传到upload接口返回的路径
                let uploadPaths;
                if ( values.photos && values.photos.length ) {
                    let imagePaths = yield all([
                        ...values.photos.map(file=>call(uploadImg, { file }))
                    ]);
                    uploadPaths = imagePaths.map(i=>i.data.data.filePath);
                } 
                let { data } = yield call(confirmRecord, { company_id, record_id:values.record_id, photos:uploadPaths, log_desc:values.log_desc, oper_code:values.oper_code, type_id:values.type_id });                 
                if ( data && data.code === '0'){
                    resolve();
                    yield put({ type:'fetchAlarmList'});
                } else {
                    reject(data.msg);
                }
            } catch(err){
                console.log(err);
            }
        },
        // 告警规则
        *initAlarmSetting(action, { call, put }){
            yield put({ type:'fetchRule'});
            yield put({ type:'fetchMachs'});
            yield put({ type:'fetchRuleType'});
        },
        *fetchRule(action, { select, call, put }){
            try {
                let { user:{ company_id }} = yield select();
                let { data } = yield call(getRuleList, { company_id });
                if ( data && data.code === '0'){
                    yield put({type:'getRule', payload:{ data:data.data }});
                }
            } catch(err) {  
                console.log(err);
            }
        },
        *fetchMachs(action, { select, call, put}){
            try{
                let { user:{ company_id }} = yield select();
                let { data } = yield call(getMachs, { company_id });
                if ( data && data.code === '0'){
                    yield put({ type:'getMachs', payload:{ data:data.data }});
                }
            } catch(err){
                console.log(err);
            }
        },
        *fetchRuleType(action, { select, call, put}){
            try {
                let { user:{ company_id }} = yield select();
                let { data } = yield call(getRuleType, { company_id });
                if ( data && data.code === '0'){
                    yield put({type:'getRuleType', payload: { data:data.data }})
                }
            } catch(err){
                console.log(err);
            }
        },
        *addRule(action, { select, call, put}){
            try {
                let { user:{ company_id }} = yield select();
                let { values, resolve, reject } = action.payload;
                values.company_id = company_id;
                values.level = values.level == 1 ? 3 : values.level == 3 ? 1 : 2;
                let { data } = yield call(addRule, values);
                if ( data && data.code === '0'){
                    yield put({type:'fetchRule'});
                    if ( resolve && typeof resolve === 'function' ) resolve();
                } else {
                    if ( reject && typeof reject === 'function' ) reject(data.msg);
                }
            } catch(err){
                console.log(err);
            }
        },
        *updateRule(action, { call, put}){
            try {
                let { values, resolve, reject } = action.payload;
                let { data } = yield call(updateRule, values);
                if ( data && data.code === '0'){
                    yield put({type:'fetchRule'});
                    if ( resolve ) resolve();
                } else {
                    if ( reject ) reject(data.msg);
                }
            } catch(err){
                console.log(err);
            }
        },
        *deleteRule(action , { call, put}){
            try {
                let rule_id = action.payload;
                let { data } = yield call(deleteRule, { rule_id });
                if ( data && data.code === '0'){
                    yield put({type:'fetchRule'});
                } 
            } catch(err){
                console.log(err);
            }
        }
    },
    reducers:{    
        toggleLoading(state){
            return { ...state, isLoading:true };
        },
        toggleChartLoading(state){
            return { ...state, chartLoading:true };
        },
        getLogType(state, { payload:{ data }}){
            return { ...state, logTypes:data };
        },
        getProgress(state, { payload :{ data }}){
            return { ...state, progressLog:data };
        },
        getWarningList(state, { payload:{ data, currentPage, total }}){
            let { warningRecords } = data;
            return { ...state, list:warningRecords, currentPage, total, isLoading:false };
        },
        getAnalyze(state, { payload:{ data }}){
            return { ...state, chartInfo:data, chartLoading:false };
        },
        getRule(state, { payload : { data }}){
            return { ...state, ruleList:data };
        },
        getRuleType(state, { payload:{data}}){
            return { ...state, ruleType:data };
        },
        getMachs(state, { payload:{ data }}){
            return { ...state, ruleMachs:data };
        },
        reset(state){
            return initialState;
        } 
    }
}


