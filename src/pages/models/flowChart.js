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
    '1#空压机':'ACSUB0752XWS01',
    '2#空压机':'ACSUB0752XWS02',
    '3#空压机':'ACSUB0752XWS03',
    '4#空压机':'ACSUB0752XWS04',
    '5#空压机':'ACSUB0752XWS05'
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
                call(getAirMachData, { company_id, mach_type:'gas', register_code:airMachMaps['1#空压机'] }),
                call(getAirMachData, { company_id, mach_type:'gas', register_code:airMachMaps['2#空压机'] }),
                call(getAirMachData, { company_id, mach_type:'gas', register_code:airMachMaps['3#空压机'] }),
                call(getAirMachData, { company_id, mach_type:'gas', register_code:airMachMaps['4#空压机'] }),
                call(getAirMachData, { company_id, mach_type:'gas', register_code:airMachMaps['5#空压机'] }),
            ]);
            let { data } = yield call(getFlowChartData, { company_id })
            let temp = {
                '01#英格索兰200HP':mach1.data.data,
                '02#巨风100HP':mach2.data.data,
                '03#巨风50HP':mach3.data.data,
                '04#阿特拉斯50HP':mach4.data.data,
                '05#阿特拉斯50HP':mach5.data.data
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


