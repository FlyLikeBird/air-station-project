import { 
    getGasEffInfo,
    getGasEffChart,
    setMinPressure,
    getEleInfo,
    getEleChart
} from '../services/gasMonitorService';
import moment from 'moment';
import { apiToken, encryptBy } from '@/pages/utils/encryption';
const date = new Date();
const initialState = {
    gasInfo:{},
    chartLoading:true,
    dataType:'1',
    chartInfo:{}
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
            yield put({ type:'fetchGasInfo', payload:{ type:'gas'} });
            yield put({ type:'fetchGasChart'});
        },
        *initEleMonitor(action, { put }){
            yield put.resolve({ type:'gasMach/init', payload:{ mode:'single' }});
            yield put({ type:'fetchEleInfo', payload:{ type:'ele' }});
            yield put({ type:'fetchEleChart'});
        },
        *fetchGasInfo(action, { put, select, call }){
            let { user:{ company_id }, gasMach:{ currentNode }} = yield select();
            let { type } = action.payload || {};
            let { data } = yield call(getGasEffInfo, { company_id, device_id:currentNode.device_id });
            if ( data && data.code === '0'){
                yield put({ type:'getGasEffInfo', payload:{ data:data.data, type }});
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
            let { user:{ company_id, timeType, startDate, endDate }, gasMach:{ currentNode }, gasMonitor:{ dataType }} = yield select();
            yield put({ type:'toggleChartLoading'});
            let { data } = yield call(getGasEffChart, { company_id, device_id:currentNode.device_id, begin_date:startDate.format('YYYY-MM-DD'), end_date:endDate.format('YYYY-MM-DD'), time_type:timeType, type:dataType === '4' ? '3' : dataType });
            if ( data && data.code === '0'){
                yield put({ type:'getGasChart', payload:{ data:data.data, dataType, type:'gas' }});
            }
        },
        *fetchEleInfo(action, { put, select, call }){
            let { user:{ company_id }, gasMach:{ currentMach }} = yield select();
            let { type } = action.payload || {};
            let { data } = yield call(getEleInfo, { company_id, device_id:currentMach.device_id });
            if ( data && data.code === '0'){
                yield put({ type:'getGasEffInfo', payload:{ data:data.data, type }});
            }
        },
        *fetchEleChart(action, { put, select, call }){
            let { user:{ company_id, timeType, startDate, endDate }, gasMach:{ currentMach }, gasMonitor:{ dataType }} = yield select();
            yield put({ type:'toggleChartLoading'});
            let { data } = yield call(getEleChart, { company_id, device_id:currentMach.device_id, begin_date:startDate.format('YYYY-MM-DD'), end_date:endDate.format('YYYY-MM-DD'), time_type:timeType, type:dataType });
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
        setDataType(state, { payload }){
            return { ...state, dataType:payload };
        },
        getGasChart(state, { payload:{ data, dataType, type }}){
            if ( dataType === '4' && type === 'gas') {
                data.value = data.value.map((item,index)=>{
                    return item === null ? null : item ? (1/item).toFixed(2) : 0 ;
                })
            }
            return { ...state, chartInfo:data, chartLoading:false };
        },
        reset(state){
            return initialState;
        } 
    }
}


