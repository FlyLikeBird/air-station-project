import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Table, message, Select } from 'antd';
import { FileExcelOutlined } from '@ant-design/icons';
import CustomDatePicker from '@/pages/components/CustomDatePicker';
import Loading from '@/pages/components/Loading';
import style from '@/pages/IndexPage.css';
import XLSX from 'xlsx';
import { downloadExcel } from '@/pages/utils/array';
const { Option } = Select;
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
function CostReport({ dispatch, type, data, columns, layout, currentPage, total, timeType, startDate, endDate, containerWidth }){
    useEffect(()=>{
        if ( type === 'running') {
            dispatch({ type:'user/toggleTimeType', payload:'1' });
        }
        if ( type === 'basic') {
            dispatch({ type:'dataReport/fetchBasicReport'});
        } else if ( type === 'save') {
            dispatch({ type:'dataReport/fetchSaveReport'});
        } else {
            dispatch({ type:'dataReport/initCostReport', payload:{ type }});
        }
    },[type]);
    let category = categoryMaps[type];

    return (
        <div style={{ height:'100%'}}>
            <div style={{ height:'40px', display:'flex', justifyContent:'space-between' }}>
                {
                    type === 'basic'
                    ?
                    <div></div>
                    :
                    <div style={{ display:'flex' }}>
                        <CustomDatePicker noToggle={type === 'running' ? true : false } onDispatch={()=>{
                            if ( type === 'save') {
                                dispatch({ type:'dataReport/fetchSaveReport'});
                            } else {
                                dispatch({ type:'dataReport/fetchCostReport', payload:{ type } });
                            }
                        }} />
                        {
                            type === 'save'
                            ?
                            null
                            :
                            <Select style={{ width:'160px', marginLeft:'6px' }} className={style['custom-select']} value={layout} onChange={value=>{
                                dispatch({ type:'dataReport/setLayout', payload:{ layout:value, type }})
                            }}>
                                <Option value='vertical' key='vertical'>按日期排列</Option>
                                <Option value='horizon' key='horizon'>按对象排列</Option>
                            </Select>
                        }
                    </div>
                }
                        
                
                <div className={style['custom-button']} onClick={()=>{
                    if ( !data.length ){
                        message.info('数据源为空');
                        return ;
                    } else {
                        let text = 
                            type === 'cost' ? '成本' :
                            type === 'basic' ? '基准' :
                            type === 'save' ? '节能' :
                            type === 'ele' ? '电气' : 
                            type === 'gas' ? '气效' :
                            type === 'running' ? '运行' : '';
                        let fileTitle = 
                            timeType === '1' 
                            ?
                            `${startDate.format('YYYY-MM-DD')}日${text}报表`
                            :
                            `${startDate.format('YYYY-MM-DD')}至${endDate.format('YYYY-MM-DD')}${timeType === '2' ? '月' : '年'}${text}报表`
                        var aoa = [], thead1 = [], thead2 = [];
                        // console.log(columns);
                        // console.log(data);
                        columns.forEach((col,index)=>{                         
                            if ( col.children && col.children.length ){                              
                                thead1.push(col.title);
                                col.children.forEach((item,index)=>{
                                    thead2.push(item.title);
                                    if ( index === 0 ) return;                                     
                                    thead1.push(null);
                                })  
                            } else {
                                thead1.push(col.title);
                                thead2.push(null);
                            }
                        });
                        let isMultiThead = thead2.filter(i=>i).length ? true : false;
                        aoa.push(thead1);
                        if ( isMultiThead ){
                            aoa.push(thead2);
                        }
                        if ( layout === 'horizon') {
                            data.forEach((attr,index)=>{
                                let temp = [];
                                if ( layout === 'horizon' ) {
                                    temp.push(index + 1);
                                }
                                temp.push(attr.device_name);
                                attr.view.forEach(item=>{
                                    category.forEach(obj=>{
                                        temp.push(item[obj.type] || '-- --');
                                    })
                                });
                                aoa.push(temp);
                            });
                        } else {
                            data.forEach((attr,index)=>{
                                if ( attr.category && attr.category.length ){           
                                    attr.category.forEach((obj, j)=>{
                                        let temp = [];
                                        if ( j === 0 ){
                                            temp.push(attr.time);
                                        } else {
                                            temp.push(null);
                                        }
                                        temp.push(obj.title);
                                        if ( attr.diffMaps ){
                                            // 兼容节能核算表的数据结构
                                            attr.view.forEach(sub=>{
                                                attr.diffMaps.forEach(diff=>{
                                                    temp.push(sub[diff.fields[j]] || '-- --')
                                                })
                                            })
                                        } else {
                                            attr.view.forEach(sub=>{
                                                temp.push(sub[obj.type] || '-- --');
                                            });
                                        }
                                        
                                        aoa.push(temp);                                        
                                    })
                                }
                            });
                        }                         
                        var sheet = XLSX.utils.aoa_to_sheet(aoa);
                        // 合并表格表头的格式
                        let merges = [];
                        if ( isMultiThead ) {
                            merges.push({
                                s:{ r:0, c:0 },
                                e:{ r:1, c:0 }
                            });
                            merges.push({
                                s:{ r:0, c:1 },
                                e:{ r:1, c:1 }
                            });
                            
                            thead1.forEach((item,index)=>{
                                if ( index > 1 ) {
                                    merges.push({
                                        s:{ r:0, c:( index - 2 ) * ( type === 'save' ? 3 : category.length ) + 2 },
                                        e:{ r:0, c: ( index - 2 ) * ( type === 'save' ? 3 : category.length ) + 2 + ( type === 'save' ? 2 : category.length - 1 )}
                                    })
                                }
                            });
                        }
                        if ( layout === 'vertical' ) {
                            data.forEach((item,index)=>{
                                merges.push({
                                    s:{ r:( index * category.length ) + ( isMultiThead ? 2 : 1  ), c:0 },
                                    e:{ r: ( index * category.length ) + ( isMultiThead ? 2 : 1 ) + category.length -1  , c:0 }
                                });
                            })
                        }
                        if ( layout === 'horizon' ){
                            sheet['!cols'] = thead2.map(i=>({ wch:16 }));
                        } else {
                            sheet['!cols'] = thead1.map(i=>({ wch:16 }));
                        }
                        sheet['!merges'] = merges;
                        downloadExcel(sheet, fileTitle + '.xlsx');
                    }
                }}><FileExcelOutlined style={{ fontSize:'1.2rem' }} /></div>
            </div>
            <div className={style['card-container']} style={{ height:'calc( 100% - 40px)', borderRadius:'4px', overflow:'hidden' }}>         
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey={ layout === 'horizon' ? 'device_name' : 'time' }
                    className={style['self-table-container'] + ' ' + style['dark'] + ' ' + style['no-space'] }
                    onChange={(pagination)=>{
                        setCurrentPage(pagination.current);
                    }}
                    pagination={ layout === 'horizon' ? { total, current:currentPage, pageSize:12, showSizeChanger:false } : false }
                    scroll={ layout === 'horizon' ? { x:1400 } :{ x:1400, y:containerWidth <= 1440 ? 550 : 680 }}
                />
            </div>
        </div>
    )
}

function areEqual(prevProps, nextProps){
    if ( prevProps.columns !== nextProps.columns || prevProps.type !== nextProps.type || prevProps.containerWidth !== nextProps.containerWidth ) {
        return false;
    } else {
        return true;
    }
}
export default React.memo(CostReport, areEqual);