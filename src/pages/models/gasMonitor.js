import { 
    getGasEffInfo,
    getGasEffChart,
    setMinPressure,
    getEleInfo,
    getEleChart,
    getPressureDiff
} from '../services/gasMonitorService';
import { getTypeRule, setTypeRule } from '../services/userService';
import moment from 'moment';
const date = new Date();
let gasTabList = [
    { tab:'瞬时流量', key:'1', unit:'m³/min', type:'gas_flow' },
    { tab:'压力', key:'2', unit:'bar', type:'gas_pressure' },
    { tab:'气电比', key:'3', unit:'kwh/m³', type:'' },
    { tab:'比功率', key:'10', unit:'m³/kwh', type:'' },
    { tab:'电能', key:'6', unit:'kwh', type:'' }
];

let eleTabList = [
    { tab:'需量', key:'1', unit:'kw', type:'' },
    { tab:'电压', key:'2', unit:'V', type:'line_voltage' },
    { tab:'视在功率', key:'3', unit:'kw', type:'apparent_power' },
    { tab:'有功功率', key:'4', unit:'kw', type:'power'},
    { tab:'无功功率', key:'5', unit:'kvar', type:'reactive_power'},
    { tab:'电流', key:'6', unit:'A', type:'electric_current' }
];
const initialState = {
    gasInfo:{},
    gasTabList,
    eleTabList,
    currentTab:gasTabList[0],
    chartLoading:true,
    chartInfo:{},
    typeRule:{}
};

export default {
    namespace:'gasMonitor',
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
        *initGasMonitor(action, { put }){
            yield put.resolve({ type:'gasMach/init'});
            yield put({ type:'toggleTab', payload:gasTabList[0] });
            yield put({ type:'fetchGasInfo', payload:{ type:'gas'} });
            yield put({ type:'fetchGasChart'});
            yield put({ type:'fetchTypeRule'});
        },
        *initGasTrend(action, { put }){
            yield put.resolve({ type:'gasMach/init'});
            yield put({ type:'toggleTab', payload:{ tab:'累计流量', key:'4', unit:'m³', type:''}});
            yield put({ type:'fetchGasChart'});
        },
        *initEleMonitor(action, { put }){
            yield put.resolve({ type:'gasMach/init' });
            yield put({ type:'toggleTab', payload:eleTabList[0] });
            yield put({ type:'fetchEleInfo', payload:{ type:'ele' }});
            yield put({ type:'fetchEleChart'});
            yield put({ type:'fetchTypeRule'});
        },
        *fetchGasInfo(action, { put, select, call }){
            let { user:{ company_id }, gasMach:{ currentNode }} = yield select();
            let { type } = action.payload || {};
            let { data } = yield call(getGasEffInfo, { company_id, device_id:currentNode.device_id });
            if ( data && data.code === '0'){
                yield put({ type:'getGasEffInfo', payload:{ data:data.data, type }});
            }
        },
        *fetchTypeRule(action, { call, put, select }) {
            let { user:{ company_id }, gasMach:{ currentNode }, gasMonitor:{ currentTab }} = yield select();
            if ( currentTab.type ){
                let { data } = yield call(getTypeRule, { company_id, device_id:currentNode.device_id, type_code:currentTab.type });
                if ( data && data.code === '0'){
                    yield put({ type:'getTypeRuleResult', payload:{ data:data.data }});
                }
            } else {
                yield put({ type:'getTypeRuleResult', payload:{ data:null }});
            }
            
        },
        *setRule(action, { call, put, select }){
            let { user:{ company_id }, gasMach:{ currentNode }, gasMonitor:{ currentTab, typeRule }} = yield select();
            let { warning_min, warning_max, resolve, reject } = action.payload || {};
            let object = { company_id, device_id:currentNode.device_id, type_code:currentTab.type };
            if ( typeRule && typeRule.rule_id ) {
                object.rule_id = typeRule.rule_id;
            }
            if ( warning_min ) {
                object.warning_min = warning_min;
            }
            if ( warning_max ){
                object.warning_max = warning_max;
            }
            let { data } = yield call(setTypeRule, object);
            if ( data && data.code === '0'){
                if ( resolve ) resolve();
                yield put({ type:'fetchTypeRule'});
            } else {
                if ( reject ) reject(data.msg);
            }
        },
        *setPressure(action, { put, select, call }){
            let { gasMach:{ currentNode }} = yield select();
            let { warning_min, resolve, reject } = action.payload || {};
            warning_min = warning_min || 0;
            let { data } = yield call(setMinPressure, { device_id:currentNode.device_id, warning_min });
            if ( data && data.code === '0'){
                yield put({ type:'fetchGasChart'});
                if ( resolve && typeof resolve === 'function') resolve();
            } else {
                if ( reject && typeof reject === 'function' ) reject(data.msg);
            } 
        },
        *fetchGasChart(action, { put, select, call }){
            let { user:{ company_id, timeType, startDate, endDate }, gasMach:{ currentNode }, gasMonitor:{ currentTab }} = yield select();
            yield put({ type:'toggleChartLoading'});
            let { data } = yield call(getGasEffChart, { company_id, device_id:currentNode.device_id, begin_date:startDate.format('YYYY-MM-DD'), end_date:endDate.format('YYYY-MM-DD'), time_type:timeType, type:currentTab.key === '10' ? '3' : currentTab.key });
            if ( data && data.code === '0'){
                yield put({ type:'getGasChart', payload:{ data:data.data, dataType:currentTab.key, type:'gas' }});
            }
        },
        *fetchEleInfo(action, { put, select, call }){
            let { user:{ company_id }, gasMach:{ currentNode }} = yield select();
            let { type } = action.payload || {};
            let { data } = yield call(getEleInfo, { company_id, device_id:currentNode.device_id });
            if ( data && data.code === '0'){
                yield put({ type:'getGasEffInfo', payload:{ data:data.data, type }});
            }
        },
        *fetchEleChart(action, { put, select, call }){
            let { user:{ company_id, timeType, startDate, endDate }, gasMach:{ currentNode }, gasMonitor:{ currentTab }} = yield select();
            yield put({ type:'toggleChartLoading'});
            let { data } = yield call(getEleChart, { company_id, device_id:currentNode.device_id, begin_date:startDate.format('YYYY-MM-DD'), end_date:endDate.format('YYYY-MM-DD'), time_type:timeType, type:currentTab.key });
            if ( data && data.code === '0'){
                yield put({ type:'getGasChart', payload:{ data:data.data }});
            }
        },
        *initPressure(action, { put, select, call }){
            yield put.resolve({ type:'gasMach/init', payload:{ mode:'single' } });
            yield put({ type:'fetchPressureDiff'});
        },
        *fetchPressureDiff(action, { select, put, call }){
            let { user:{ company_id, timeType, startDate, endDate }, gasMach:{ currentNode }} = yield select();
            yield put({ type:'toggleChartLoading'});
            let { data } = yield call(getPressureDiff, { company_id, device_id:currentNode.key, begin_date:startDate.format('YYYY-MM-DD'), end_date:endDate.format('YYYY-MM-DD'), time_type:timeType })
            if ( data && data.code === '0'){
                yield put({ type:'getGasChart', payload:{ data:data.data }});
            }
        }
    },
    reducers:{
        toggleChartLoading(state){
            return { ...state, chartLoading:true };
        },
        getGasEffInfo(state, { payload:{ data, type }}){
            let infoList = [];
            if ( type === 'gas'){
                infoList.push({ title:'本月气电比', child:[{ title:'气电比', value:data.month_gas_ele_ratio , unit:'kwh/m³' }, { title:'比功率', value:data.month_gas_ele_ratio ? (1/data.month_gas_ele_ratio).toFixed(2) : 0, unit:'m³/kwh' }]});
                infoList.push({ title:'产气量', child:[{ title:'今日产气量', value:data.gas.day , unit:'m³'}, { title:'本月产气量', value:data.gas.month , unit:'m³'}]});
                infoList.push({ title:'用电量', child:[{ title:'今日用电量', value:data.energy.day , unit:'kwh'}, { title:'本月用电量', value:data.energy.month , unit:'kwh' }, { title:'本年用电量', value:data.energy.year , unit:'kwh' }]})
                infoList.push({ title:'稼动效率', child:[{ title:'设备稼动率', value:data.run_ratio, unit:'%' }]});
                infoList.push({ title:'瞬时流量', child:[{ title:'瞬时流量', value:data.speed, unit:'m³/min'}]});
            } else if ( type === 'ele'){
                infoList.push({ title:'电量', child:[{ title:'今日电量', value:data.dayEnergy , unit:'kwh'}, { title:'本月电量', value:data.monthEnergy , unit:'kwh'}, { title:'本年电量', value:data.yearEnergy , unit:'kwh' }]})
                infoList.push({ title:'电流', child:[{ title:'A相电流', value:data.I1 , unit:'A', type:'A' }, { title:'B相电流', value:data.I2 , unit:'A', type:'B'}, { title:'C相电流', value:data.I3 , unit:'A', type:'C' }]})
                infoList.push({ title:'负荷率', child:[{ title:'今日负荷率', value:data.dayLoad, unit:'%' }, { title:'本月负荷率', value:data.monthLoad, unit:'%'}, { title:'本年负荷率', value:data.yearLoad, unit:'%' }]})
                infoList.push({ title:'实时功率', child:[{ title:'有功功率', value:data.power, unit:'kw'}, { title:'无功功率', value:data.uselessPower, unit:'kvar'}]})
                infoList.push({ title:'功率因素', child:[{ title:'PF', value:data.factor, unit:'cosΦ'}]})
            }
            data.infoList = infoList;
            return { ...state, gasInfo:data };
        },
        getTypeRuleResult(state, { payload:{ data }}){
            return { ...state, typeRule:data };
        },
        toggleTab(state, { payload }){
            return { ...state, currentTab:payload };
        },
        getGasChart(state, { payload:{ data, dataType, type }}){
            if ( dataType === '3' && type === 'gas' ){
                data.value = data.value.map(item=>(+item).toFixed(4));
            }
            if ( dataType === '10' && type === 'gas') {
                data.value = data.value.map((item,index)=>{
                    return item === null ? null : item ? (1/item).toFixed(2) : 0 ;
                });
            }
            return { ...state, chartInfo:data, chartLoading:false };
        },
        reset(state){
            return initialState;
        } 
    }
}


