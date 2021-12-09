import { 
    getCostReport,
    getEleReport,
    getGasReport,
    getRunningReport
} from '../services/dataReportService';
import moment from 'moment';
const date = new Date();
const initialState = {
    isLoading:true,
    columns:[],
    list:[],
    currentPage:1,
    total:0,
};
let categoryMaps = {
    'cost':[
        { title:'用电成本(元)', type:'cost' },
        { title:'用电量(kwh)', type:'energy' },
        { title:'产气量(m³)', type:'flow' },
    ],
    'ele':[
        { title:'电压(V)', type:'Uavg'},
        { title:'电流(A)', type:'Iavb'},
        { title:'功率(kw)', type:'P'},
        { title:'无功功率(KVar)', type:'Q'},
        { title:'需量(kw)', type:'demand'}
    ],
    'gas':[
        { title:'运行时间(h)', type:'run_time'},
        { title:'加载时间(h)', type:'load_time'},
        { title:'空载时间(h)', type:'empty_load'},
        { title:'空载率(%)', type:'empty_load_ratio'},
        { title:'气电比(m³/kwh)', type:'flow_ele_ratio' },
        { title:'气成本比(m³/元)', type:'flow_cost_ratio' }
    ],
    'running':[
        { title:'瞬时流量(m³/min)', type:'speed'},
        { title:'露点温度(℃)', type:'dew_tmp'},
        { title:'排气压力(bar)', type:'grp_air_out' },
        { title:'排气温度(℃)', type:'main_tmp_out' }
    ]
}
export default {
    namespace:'dataReport',
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
        *initCostReport(action, { put }){
            let { type } = action.payload || {};
            yield put.resolve({ type:'gasMach/init' });
            yield put({ type:'fetchCostReport', payload:{ type }});
        },
        *fetchCostReport(action, { put, select, call }){
            let { user:{ company_id, timeType, startDate, endDate }, gasMach:{ currentNode }} = yield select();
            let { currentPage, type } = action.payload || {};
            currentPage = currentPage || 1;
            yield put({ type:'toggleLoading'});
            let { data } = yield call( (type === 'cost' ? getCostReport : type === 'ele' ? getEleReport : type === 'gas' ? getGasReport : getRunningReport), { company_id, device_id:currentNode.key, page:currentPage, pagesize:12, time_type:timeType, begin_date:startDate.format('YYYY-MM-DD'), end_date:endDate.format('YYYY-MM-DD') });
            console.log('end');
            if ( data && data.code === '0'){
                console.log(data.data);
                yield put({ type:'getResult', payload:{ data:data.data, currentPage, total:data.count, type  }});
            }
        }
    },
    reducers:{
        toggleLoading(state){
            return { ...state, isLoading:true };
        },
        getResult(state, { payload:{ data, currentPage, total, type }}){
            let dateColumns = [];
            let category = categoryMaps[type];
            
            if ( data[0].view ){
                let dateArr = Object.keys(data[0].view);
                dateArr.forEach((key,index)=>{
                        dateColumns.push({
                            title:key,
                            children:category.map(item=>{
                                let obj = {};
                                obj['title'] = item.title;
                                obj['dataIndex'] = ['view',key,item.type];
                                obj['width'] = '120px';
                                return obj;
                            })
                        })
                });
                // 重新排序
                // dateColumns.sort((a,b)=>{
                //     let timeA = new Date(a.title).getTime();
                //     let timeB = new Date(b.title).getTime();
                //     return timeA - timeB;
                // });
            };
            let columns = [
                {
                    title:'序号',
                    width:'60px',
                    render:(text,record,index)=>{
                        return `${ ( currentPage - 1) * 12 + index + 1}`;
                    },
                    className:'fixed fixed-0'
                },
                {
                    title:'属性',
                    width:'160px',
                    ellipsis:true,
                    dataIndex:'device_name',
                    className:'fixed fixed-60'
                },
                ...dateColumns
            ];
            // console.log(data);
            // console.log(columns);
            return { ...state, list:data, columns, currentPage, total, isLoading:false };
        },
        reset(state){
            return initialState;
        } 
    }
}


