import { getCostInfo, getCostChart } from '../services/costService';

const initialState = {
    // 1=成本 2=能耗
    dataType:'1',
    sumInfo:{},
    chartLoading:true,
    chartInfo:{}
};

export default {
    namespace:'cost',
    state:initialState,
    effects:{
        *init(action, { select, call, put, all }){
            // yield put.resolve({ type:'fields/init'});
            yield put({ type:'fetchEleBilling'});
            yield put({ type:'fetchBillingTpl'});
        },
        *init(action, { put }){
            yield put.resolve({ type:'gasMach/init'});
            yield put({ type:'fetchCostInfo'});
            yield put({ type:'fetchCostChart'});
        },
        *fetchCostInfo(action, { call, put, select }){
            let { user:{ company_id }, gasMach:{ currentNode }, cost:{ dataType }} = yield select();
            let { data } = yield call(getCostInfo, { company_id, device_id:currentNode.key, type:dataType });
            if ( data && data.code === '0'){
                yield put({ type:'getCostInfo', payload:{ data:data.data }});
            }
        },
        *fetchCostChart(action, { call, put, select }){
            let { user:{ company_id, timeType, startDate, endDate }, gasMach:{ currentNode }} = yield select();
            yield put({ type:'toggleChartLoading'});
            let { data } = yield call(getCostChart, { company_id, device_id:currentNode.key, begin_date:startDate.format('YYYY-MM-DD'), end_date:endDate.format('YYYY-MM-DD'), time_type:timeType })
            if ( data && data.code === '0'){
                yield put({ type:'getCostChart', payload:{ data:data.data }});
            }
        }
        
    },
    reducers:{
        toggleChartLoading(state){
            return { ...state, chartLoading:true };
        },
        getCostInfo(state, { payload:{ data }}){
            let costInfo = [];
            let { dayCost, lastDayRatio, lastMonthRatio, lastYearRatio, monthCost, sameDayRatio, sameMonthRatio, sameYearRatio, yearCost } = data;
            costInfo.push({ key:'day', value:dayCost, same:sameDayRatio, last:lastDayRatio });
            costInfo.push({ key:'month', value:monthCost, same:sameMonthRatio, last:lastMonthRatio });
            costInfo.push({ key:'year', value:yearCost, same:sameYearRatio, last:lastYearRatio });
            data.costInfo = costInfo;
            return { ...state, sumInfo:data };
        },
        getCostChart(state, { payload:{ data }}){
            return { ...state, chartInfo:data, chartLoading:false };
        },
        toggleDataType(state, { payload }){
            return { ...state, dataType:payload };
        },
        reset(){
            return initialState;
        }
    }
}
