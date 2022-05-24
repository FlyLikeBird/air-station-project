import { 
    getFlowChartData
} from '../services/flowChartService';
import { getAirMachData } from '../services/stationService';
import moment from 'moment';
import { apiToken, encryptBy } from '@/pages/utils/encryption';
const date = new Date();
const initialState = {
    isLoading:true,
    sumInfo:{},
    statusMaps:{}
};
let airMachMaps = {
    '01#英格索兰200HP':'ACSUB0752XWS01',
    '02#阿特拉斯50HP':'ACSUB0752XWS02',
    '03#阿特拉斯50HP':'ACSUB0752XWS03',
    '04#巨风100HP':'ACSUB0752XWS04',
    '05#英格索兰变频100HP':'ACSUB0752XWS05'
};

export default {
    namespace:'flow',
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
        *fetchAirMachData(action, { put, select, call}){          
            try {
                let { user:{ company_id }} = yield select();
                let { resolve, reject, register_code } = action.payload;
                let { data } = yield call(getAirMachData, { company_id, mach_type:'gas', register_code });
                if ( data && data.code === '0'){
                    if ( resolve && typeof resolve === 'function') resolve(data.data);
                } else {
                    if ( reject && typeof reject === 'function' ) reject(data.msg);
                }
            } catch(err){
                console.log(err);
            }
        },
        *initFlowChart(action, { all, put, call, select }){
            let { user:{ company_id }} = yield select();
            let [mach1, mach2, mach3, mach4, mach5] = yield all([
                call(getAirMachData, { company_id, mach_type:'gas', register_code:airMachMaps['01#英格索兰200HP'] }),
                call(getAirMachData, { company_id, mach_type:'gas', register_code:airMachMaps['02#阿特拉斯50HP'] }),
                call(getAirMachData, { company_id, mach_type:'gas', register_code:airMachMaps['03#阿特拉斯50HP'] }),
                call(getAirMachData, { company_id, mach_type:'gas', register_code:airMachMaps['04#巨风100HP'] }),
                call(getAirMachData, { company_id, mach_type:'gas', register_code:airMachMaps['05#英格索兰变频100HP'] }),
            ]);
            let { data } = yield call(getFlowChartData, { company_id });
            let temp = {
                '01#英格索兰200HP':mach1.data.data,
                '02#阿特拉斯50HP':mach2.data.data,
                '03#阿特拉斯50HP':mach3.data.data,
                '04#巨风100HP':mach4.data.data,
                '05#英格索兰变频100HP':mach5.data.data
            };
            if ( data && data.code === '0') {
                yield put({ type:'getResult', payload:{ data:data.data, statusMaps:temp }});
            }
        }     
    },
    reducers:{    
        toggleLoading(state){
            return { ...state, isLoading:true };
        },
        getResult(state, { payload:{ data, statusMaps }}){
            return { ...state, sumInfo:data, statusMaps, isLoading:false };
        },
        getMachs(state, { payload:{ data }}){
            return { ...state, ruleMachs:data };
        },
        reset(state){
            return initialState;
        } 
    }
}


