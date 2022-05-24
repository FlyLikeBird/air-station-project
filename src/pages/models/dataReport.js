import React from 'react';
import { 
    getCostReport,
    getEleReport,
    getGasReport,
    getRunningReport,
    getBasicRatioReport,
    getSaveReport
} from '../services/dataReportService';
import moment from 'moment';
const date = new Date();
const initialState = {
    isLoading:true,
    layout:'vertical',
    columns:[],
    // sourceData保存初始数据，可复原
    sourceData:[],
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
    'basic':[
        { title:'用电成本(元)', type:'cost' },
        { title:'用电量(kwh)', type:'ele' },
        { title:'产气量(m³)', type:'gas' },
        { title:'气电比(kwh/m³)', type:'ratio'}
    ],
    'save':[
        { title:'用电成本(元)', type:'cost' },
        { title:'用电量(kwh)', type:'ele' },
        { title:'产气量(m³)', type:'gas' },
        { title:'气电比(kwh/m³)', type:'ratio'}
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
        { title:'气电比(kwh/m³)', type:'flow_ele_ratio' },
        { title:'气成本比(元/m³)', type:'flow_cost_ratio' }
    ],
    'running':[
        { title:'瞬时流量(m³/min)', type:'speed'},
        { title:'露点温度(℃)', type:'dew_tmp'},
        { title:'排气压力(bar)', type:'grp_air_out' },
        { title:'排气温度(℃)', type:'main_tmp_out' }
    ]
};
let diffMaps = [
    { title:'智控前(基准)', fields:['collect_cost', 'collect_ele', 'collect_gas', 'collect_ratio'] },
    { title:'智控后', fields:['cost','ele', 'gas', 'ratio'] },
    { title:'效果验证', fields:['diff_cost', 'diff_ele', 'diff_gas', 'diff_ratio'] }
];
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
        *initCostReport(action, { put, select }){
            let { type } = action.payload || {};      
            yield put.resolve({ type:'gasMach/init' });       
            yield put({ type:'fetchCostReport', payload:{ type }});
        },
        *fetchCostReport(action, { put, select, call }){
            let { user:{ company_id, timeType, startDate, endDate }, gasMach:{ currentNode }} = yield select();
            let { currentPage, type } = action.payload || {};
            currentPage = currentPage || 1;
            yield put({ type:'toggleLoading'});
            let { data } = yield call( (
                type === 'cost' ? getCostReport : 
                type === 'ele' ? getEleReport : 
                type === 'gas' ? getGasReport : 
                type === 'running' ? getRunningReport : getBasicRatioReport
                ), { company_id, device_id:currentNode.key, page:currentPage, pagesize:12, time_type:timeType, begin_date:startDate.format('YYYY-MM-DD'), end_date:endDate.format('YYYY-MM-DD') });
            if ( data && data.code === '0'){
                yield put({ type:'getResult', payload:{ data:data.data, currentPage, total:data.count }});
                yield put({ type:'setLayout', payload:{ layout:'vertical', type }});
            }
        },
        *fetchBasicReport(action, { put, select, call }){
            let { user:{ company_id }} = yield select();
            yield put({ type:'toggleLoading'});
            let { data } = yield call(getBasicRatioReport, { company_id });
            if ( data && data.code === '0'){
                yield put({ type:'getResult', payload:{ data:data.data, currentPage:1, total:0 }});
                yield put({ type:'setLayout2', payload:{ layout:'vertical', type:'basic' }});
            }
        },
        *fetchSaveReport(action, { put, select, call }){
            let { user:{ company_id, timeType, startDate, endDate }} = yield select();
            yield put({ type:'toggleLoading'});
            let { data } = yield call(getSaveReport, { company_id, time_type:timeType, begin_date:startDate.format('YYYY-MM-DD'), end_date:endDate.format('YYYY-MM-DD')})
            if ( data && data.code === '0'){
                yield put({ type:'getResult', payload:{ data:data.data, currentPage:1, total:0 }});
                yield put({ type:'setLayout3', payload:{ layout:'vertical', type:'save' }});
            }
        }
    },
    reducers:{
        toggleLoading(state){
            return { ...state, isLoading:true };
        },
        getResult(state, { payload:{ data, currentPage, total }}){
            return { ...state, list:data, sourceData:data, currentPage, total, isLoading:false };
        },
        setLayout(state, { payload:{ layout, type }}){
            let columns;
            let category = categoryMaps[type];    
            let dateList = [];
            if ( state.sourceData[0].view ){
                Object.keys(state.sourceData[0].view).forEach(time=>{
                    dateList.push(time);
                })
            }
            if ( layout === 'horizon') {
                let dateColumns = [];
                dateList.forEach((key,index)=>{
                    dateColumns.push({
                        title:key,
                        children:category.map(item=>{
                            let obj = {};
                            obj['title'] = item.title;
                            obj['width'] = '120px';
                            obj.dataIndex = 'view';
                            obj.render = (arr)=>{
                                return React.createElement('div', null, arr[index][item.type] || '-- --')
                            }
                            return obj;
                        })
                    })
                });
                columns = [
                    {
                        title:'序号',
                        width:'60px',
                        fixed:true,
                        render:(text,record,index)=>{
                            return `${ ( state.currentPage - 1) * 12 + index + 1}`;
                        },
                        // className:'fixed fixed-0'
                    },
                    {
                        title:'属性',
                        width:'160px',
                        ellipsis:true,
                        fixed:true,
                        dataIndex:'device_name',
                        // className:'fixed fixed-60'
                    },
                    ...dateColumns
                ];
               
                let newListData = state.sourceData.map(item=>{
                    let obj = {};
                    obj.device_name = item.device_name;
                    obj.view = dateList.map(time=>{
                        return category.reduce((sum,cur)=>{
                            sum[cur.type] = item.view[time][cur.type];
                            return sum;
                        },{})
                    })
                    return obj;
                });
                return { ...state, columns, list:newListData, layout };
            } else {
                let machList = [];                
                state.sourceData.forEach((item, index)=>{
                    machList.push({ 
                        title:item.device_name,  
                        dataIndex:'view',
                        className:'multi-table-cell',
                        render:(arr)=>{
                            let child = category.map(i=>{
                                return React.createElement('div', null, arr[index][i.type] || '-- --')
                            })
                            return React.createElement('div',null, ...child);
                        }
                    });
                })             
                columns = [
                    {
                        title:'日期',
                        width:140,
                        fixed:true,
                        dataIndex:'time'
                    },
                    {
                        title:'对比项',
                        fixed:true,
                        dataIndex:'category',
                        className:'multi-table-cell',
                        render:(arr)=>{
                            let child = arr.map(item=>React.createElement('div', null, item.title ));
                            return React.createElement('div',null, ...child);
                        }
                    },
                    ...machList
                ];
                
                let newListData = dateList.map(time=>{
                    let obj = {};
                    obj['time'] = time;
                    obj['category'] = category;
                    obj['view'] = state.sourceData.map(item=>({ ...item.view[time]}))
                    return obj
                });
                return { ...state, columns, list:newListData, layout };
            }
        },
        setLayout2(state, { payload:{ layout, type }}){
            let category = categoryMaps[type];    
            let dateList = state.sourceData.date || [];
            let machList = [];
            if ( state.sourceData.info && state.sourceData.info.length ) {
                state.sourceData.info.forEach((item, index)=>{
                    machList.push({ 
                        title:item.device_name,  
                        dataIndex:'view',
                        className:'multi-table-cell',
                        render:(arr)=>{
                            let child = category.map(i=>{
                                return React.createElement('div', null, arr[index][i.type] || '-- --')
                            })
                            return React.createElement('div',null, ...child);
                        }
                    });
                })
            };
            let columns = [
                {
                    title:'日期',
                    width:140,
                    fixed:true,
                    dataIndex:'time'
                },
                {
                    title:'对比项',
                    dataIndex:'category',
                    fixed:true,
                    className:'multi-table-cell',
                    render:(arr)=>{
                        let child = arr.map(item=>React.createElement('div', null, item.title ));
                        return React.createElement('div',null, ...child);
                    }
                },
                ...machList
            ];
            dateList.unshift('数据汇总');
            let newListData = dateList.map((time,index)=>{
                let obj = {};
                obj['time'] = time;
                obj['category'] = category;
                obj['view'] = state.sourceData.info.map(item=>{
                    let obj = {};
                    if ( index === 0 ) {
                        obj.ele = item.total_ele;
                        obj.cost = item.total_cost;
                        obj.gas = item.total_gas;
                        obj.ratio = item.ele_gas_ratio;
                    } else {
                        category.forEach(sub=>{
                            obj[sub.type] = item.view[sub.type][index] 
                        });
                    }
                    return obj;
                });
                return obj
            });
            return { ...state, columns, list:newListData, type, layout };
        },
        setLayout3(state, { payload:{ layout, type }}){
            let category = categoryMaps[type];    
            let dateList = state.sourceData.date || [];
            let machList = [];
            if ( state.sourceData.info && state.sourceData.info.length ) {
                state.sourceData.info.forEach((item, index)=>{
                    machList.push({ 
                        title:item.device_name,  
                        children:diffMaps.map(diff=>{
                            return {
                                title:diff.title,
                                dataIndex:'view',
                                className:'multi-table-cell',
                                render:(arr)=>{
                                    let temp = arr[index];
                                    let child = diff.fields.map(sub=>React.createElement('div', { style:{ color:diff.title === '效果验证' ? temp[sub] < 0 ? 'red' : '#1890ff' : '#fff'  }}, temp[sub]))
                                    return  React.createElement('div', null, child);
                                }
                            }
                        })
                    });
                })
            };
            
            let columns = [
                {
                    title:'日期',
                    width:140,
                    fixed:true,
                    dataIndex:'time'
                },
                {
                    title:'对比项',
                    dataIndex:'category',
                    className:'multi-table-cell',
                    fixed:true,
                    render:(arr)=>{
                        let child = arr.map(item=>React.createElement('div', null, item.title ));
                        return React.createElement('div',null, ...child);
                    }
                },
                ...machList
            ];
            dateList.unshift('数据汇总')
            let newListData = dateList.map((time,index)=>{
                let obj = {};
                obj['time'] = time;
                obj['category'] = category;
                obj['diffMaps'] = diffMaps;
                obj['view'] = state.sourceData.info.map((item,j)=>{
                    let temp = {};
                    if ( index === 0 ){
                        temp.collect_cost = item.collect_cost;
                        temp.collect_ele = item.collect_ele;
                        temp.collect_gas = item.collect_gas;
                        temp.collect_ratio = item.collect_ratio;
                        temp.cost = item.total_cost;
                        temp.ele = item.total_ele;
                        temp.gas = item.total_gas;
                        temp.ratio = item.ele_gas_ratio;
                        temp.diff_cost = item.diff_cost;
                        temp.diff_ele = item.diff_ele;
                        temp.diff_gas = item.diff_gas;
                        temp.diff_ratio = item.diff_ratio;
                    } else {
                        Object.keys(item.view).forEach((sub,k)=>{
                            temp[sub] = item.view[sub][index-1];
                        });
                    }
                    return temp;
                });
                return obj;
            });
            return { ...state, columns, list:newListData, type, layout };
        },
        reset(state){
            return initialState;
        } 
    }
}


