import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Modal, Table, Button, message } from 'antd';
import Loading from '@/pages/components/Loading';
import style from '@/pages/IndexPage.css';
import AlarmForm from './AlarmForm';

const statusMaps = {
    '1':{ text:'未处理', color:'red'},
    '2':{ text:'跟进中', color:'#04fde7'},
    '3':{ text:'已处理', color:'#0676cb'},
    '4':{ text:'挂起', color:'#aadbff'}
}
function AlarmList({ dispatch, user, alarm }){
    useEffect(()=>{
        if ( user.authorized ){
            dispatch({ type:'alarm/initAlarmList'});
        }
    },[user.authorized]);
    let [ info, setInfo] = useState({ visible:false, current:null, action_code:'' });
    let { list, currentPage, total, isLoading, progressLog, logTypes } = alarm;
    let columns = [
        {
            title:'序号',
            width:'60px',
            render:(text,record,index)=>{
                return `${ ( currentPage - 1) * 12 + index + 1}`;
            }
        },
        { title:'设备名称', dataIndex:'mach_name' },
        { title:'告警类型', dataIndex:'type_name' },
        { title:'告警时间', dataIndex:'last_warning_time' },
        {
            title:'告警描述',
            render:(row)=>(<span>{`${row.warning_info},${row.warning_value}`}</span>)
        },
        {
            title:'告警状态',
            dataIndex:'status',
            render:(value)=>(<span style={{ color:statusMaps[value].color }}>{ statusMaps[value].text }</span>)
        },
        {
            title:'操作',
            render:(row)=>(
                <div>
                    <span className={style['btn'] + ' ' + style['small'] + ' ' + ( row.status === 3 || row.status === 4 ? style['disabled'] : '') } size='small'  onClick={()=>{
                        if (  row.status === 3 || row.status === 4 ){
                            return; 
                        } 
                        setInfo({ visible:true, current:row, action_code:'2' });
                        dispatch({ type:'alarm/fetchProgressInfo', payload:row.record_id });
                    }}>添加进度</span>
                    <span className={style['btn'] + ' ' + style['small'] + ' ' + ( row.status === 3 || row.status === 4 ? style['disabled'] : '') } size='small'  onClick={()=>{
                        if (  row.status === 3 || row.status === 4 ){
                            return; 
                        }  
                        setInfo({ visible:true, current:row, action_code:'1' });
                    }}>挂起</span>
                    <span className={style['btn'] + ' ' + style['small'] + ' ' + ( row.status === 3 || row.status === 4 ? style['disabled'] : '') } size='small'  onClick={()=>{
                        if (  row.status === 3 || row.status === 4 ){
                            return; 
                        } 
                        setInfo({ visible:true, current:row, action_code:'3' });
                    }}>结单</span>
                </div>
            )
        }
    ];
    let sourceData = [];
    return (
        <div className={style['card-container']}>
            {
                isLoading
                ?
                <Loading />
                :
                null
            }
            <Table 
                rowKey='record_id'
                columns={columns}
                dataSource={list}
                className={style['self-table-container'] + ' ' + style['dark'] }
                pagination={{
                    current:currentPage,
                    total,
                    pageSize:12,
                    showSizeChanger:false
                }}
                locale={{
                    emptyText:<div style={{ height:'140px', lineHeight:'140px' }}>暂无历史告警信息</div>
                }}
                onChange={(pagination)=>{
                    dispatch({ type:'alarm/fetchAlarmList', payload:{ currentPage:pagination.current }});
                }}
            />
            <Modal 
                visible={info.visible} 
                footer={null} 
                width='50%'
                destroyOnClose={true} 
                bodyStyle={{ padding:'40px' }}
                onCancel={()=>setInfo({ visible:false })}
            >
                <AlarmForm 
                    info={info} 
                    logTypes={logTypes}
                    onClose={()=>setInfo({ visible:false })} 
                    onDispatch={(action)=>dispatch(action)}
                    // recordHistory={recordHistory}
                    progressLog={progressLog}
                />
            </Modal>
        </div>
    )
}

export default connect(({ user, alarm })=>({ user, alarm }))(AlarmList);