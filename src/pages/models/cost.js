import { getCostInfo, getCostChart, getSaveCost } from '../services/costService';

const initialState = {
    // 1=成本 2=能耗
    dataType:'1',
    sumInfo:{},
    chartLoading:true,
    chartInfo:{},
    saveCost:{}
};

export default {
    namespace:'cost',
    state:initialState,
    effects:{
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
        },
        *initSaveCost(action, { put }){
            let { resolve, reject } = action.payload || {};
            yield put.resolve({ type:'device/fetchDeviceTypes'});
            yield put({ type:'fetchSaveCost', payload:{ resolve, reject }});
        },
        *fetchSaveCost(action, { call, put, select }){
            let { user:{ company_id, timeType, startDate, endDate }, device:{ currentStation }, report:{ currentDate }} = yield select();
            let { resolve, reject } = action.payload || {} ;
            yield put({ type:'toggleChartLoading'});
            let obj = { company_id, device_id:currentStation.device_id, time_type:timeType, begin_date:startDate.format('YYYY-MM-DD'), end_date:endDate.format('YYYY-MM-DD')};
            if ( resolve  ){
                obj.time_type = '2';
                obj.begin_date = currentDate.startOf('month').format('YYYY-MM-DD');
                obj.end_date = currentDate.endOf('month').format('YYYY-MM-DD');
            }
            let { data } = yield call(getSaveCost, obj)
            if ( data && data.code === '0'){
                yield put({ type:'getSaveCostResult', payload:{ data:data.data }});
                if ( resolve ) resolve();
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
        getSaveCostResult(state, { payload:{ data }}){
            let { info } = data;
            let infoList = [
                { color:'#af2bff', child:[{ title:'采集气电比', value: info ? (info.collect_ele_gas_ratio).toFixed(4) : 0, unit:'kwh/m³'}, { title:'采集电价', value:info ? info.collect_ele_price : 0, unit:'元/kwh' }]},
                { color:'#04a3fe', child:[{ title:'当前气电比', value:info ? (info.ele_gas_ratio).toFixed(4) : 0 , unit:'kwh/m³', hasTooltip:true, tooltipContent:info.ele_gas_ratio }, { title:'当前产气量', value:info ? info.total_gas : 0, unit:'m³' }]},
                { 
                    color:'#5fd942', 
                    child:[
                        { title:'基准成本', value:info ? info.old_cost : 0, unit:'元', hasTooltip:true, tooltipContent:'节省成本 = [未启用智控前气电比(kwh/m³) - 启用智控后气电比(kwh/m³)] X 用气量(m³) X 平均单价(元/kwh)'}, 
                        { title:'智控后成本', value:info ? info.total_cost : 0 , unit:'元'}, 
                        { title:'节省成本', value:info ? info.save_cost : 0, unit:'元' }
                    ]
                }
            ];
            data.infoList = infoList;
            return { ...state, saveCost:data, chartLoading:false };
        },
        reset(){
            return initialState;
        }
    }
}
