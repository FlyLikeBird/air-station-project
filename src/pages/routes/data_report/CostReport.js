import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Table, message } from 'antd';
import { FileExcelOutlined } from '@ant-design/icons';
import CustomDatePicker from '@/pages/components/CustomDatePicker';
import Loading from '@/pages/components/Loading';
import style from '@/pages/IndexPage.css';
import XLSX from 'xlsx';
import { downloadExcel } from '@/pages/utils/array';

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
function CostReport({ dispatch, type, data, columns, currentPage, total, timeType, startDate, endDate, theme }){
    useEffect(()=>{
        if ( type === 'running') {
            dispatch({ type:'user/toggleTimeType', payload:'1' });
        }
        dispatch({ type:'dataReport/initCostReport', payload:{ type }});
    },[type]);
    let category = categoryMaps[type];
    
    return (
        <div style={{ height:'100%'}}>
            <div style={{ height:'40px', display:'flex', justifyContent:'space-between' }}>
                <CustomDatePicker noToggle={type === 'running' ? true : false } onDispatch={()=>{
                    dispatch({ type:'dataReport/fetchCostReport', payload:{ type } });
                }} />
                <div className={style['custom-button']} onClick={()=>{
                    if ( !data.length ){
                        message.info('数据源为空');
                        return ;
                    } else {
                        let fileTitle = 
                            timeType === '1' 
                            ?
                            `${startDate.format('YYYY-MM-DD')}日${ type === 'cost' ? '成本' : type === 'ele' ? '电力' : type === 'gas' ? '气效' : '运行' }报表`
                            :
                            `${startDate.format('YYYY-MM-DD')}至${endDate.format('YYYY-MM-DD')}${timeType === '2' ? '月' : '年'}${ type === 'cost' ? '成本' : type === 'ele' ? '电力' : type === 'gas' ? '气效' : '运行' }报表`
                        var aoa = [], thead1 = [], thead2 = [];
                        columns.forEach((col,index)=>{
                            if ( col.children && col.children.length ){
                                thead1.push(col.title);
                                category.forEach((type,index)=>{
                                    thead2.push(type.title);
                                    if ( index === 0 ) return;                                     
                                    thead1.push(null);
                                })  
                            } else {
                                thead1.push(col.title);
                                thead2.push(null);
                            }
                        });
                        aoa.push(thead1);
                        aoa.push(thead2);
                    
                        data.forEach((attr,index)=>{
                            let temp = [];
                            temp.push(index + 1);
                            temp.push(attr.device_name);
                            Object.keys(attr.view).sort((a,b)=>{
                                let timeA = new Date(a).getTime();
                                let timeB = new Date(b).getTime();
                                return timeA - timeB;
                            }).forEach(key=>{
                                category.forEach(item=>{
                                    temp.push(attr.view[key][item.type]);
                                })
                            });
                            aoa.push(temp);
                        })
                        var sheet = XLSX.utils.aoa_to_sheet(aoa);
                        // 合并表格表头的格式
                        let merges = [];
                        thead1.forEach((item,index)=>{
                            if ( item && item.includes('-')) {
                                merges.push({
                                    s:{ r:0, c:index},
                                    e:{ r:0, c:index + category.length - 1}
                                })
                            }
                        });
                        merges.push({
                            s:{ r:0, c:0 },
                            e:{ r:1, c:0 }
                        });
                        merges.push({
                            s:{ r:0, c:1 },
                            e:{ r:1, c:1 }
                        });
                        sheet['!cols'] = thead2.map(i=>({ wch:16 }));
                        sheet['!merges'] = merges;
                        downloadExcel(sheet, fileTitle + '.xlsx');
                    }
                }}><FileExcelOutlined style={{ fontSize:'1.2rem' }} /></div>
            </div>
            <div style={{ height:'calc( 100% - 40px)', position:'relative', overflow:'scroll auto', backgroundColor: theme === 'dark' ? '#191a2f' : '#fff', color:'#b0b0b0', borderRadius:'4px' }}>
                
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey='device_name'
                    className={style['self-table-container'] + ' ' + ( theme === 'dark' ? style['dark'] : '') }
                    onChange={(pagination)=>{
                        setCurrentPage(pagination.current);
                    }}
                    pagination={{ total, current:currentPage, pageSize:12, showSizeChanger:false }}
                />
            </div>
        </div>
    )
}

function areEqual(prevProps, nextProps){
    if ( prevProps.data !== nextProps.data || prevProps.type !== nextProps.type ) {
        return false;
    } else {
        return true;
    }
}
export default React.memo(CostReport, areEqual);