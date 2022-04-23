import React, { useEffect } from 'react';
import { Table } from 'antd';
import { connect } from 'dva';
import style from '@/pages/IndexPage.css';
import Loading from '@/pages/components/Loading';

function StationTableContainer({ dispatch, gasMach }){
    let { stationMachList, isLoading, currentPage, total } = gasMach;
    useEffect(()=>{
        dispatch({ type:'gasMach/fetchStationStatus'})
    },[]);
    let columns = [
        { title:'对象', dataIndex:'device_name' },
        { title:'注册码', dataIndex:'register_code' },
        { 
            title:'是否联控',
            dataIndex:'auto_control',
            render:value=>(<span>{ value === 1 ? '联控' : value === 0 ? '非联控' : '-- --'}</span>)
        },
        {
            title:'压力上限',
            dataIndex:'pressure_upper_limit',
            render:value=>(<span>{ value !== undefined ? value : '-- --' }</span>)
        },
        {
            title:'压力下限',
            dataIndex:'pressure_lower_limit',
            render:value=>(<span>{ value !== undefined ? value : '-- --' }</span>)
        },
        {
            title:'压力过高报警值',
            dataIndex:'pressure_upper_alert',
            render:value=>(<span>{ value !== undefined ? value : '-- --' }</span>)
        },
        {
            title:'压力过低报警值',
            dataIndex:'pressure_lower_alert',
            render:value=>(<span>{ value !== undefined ? value : '-- --' }</span>)
        },
        { title:'运行状态', dataIndex:'is_running', render:value=>(<span className={value === 1 ? style['tag-on'] : value === 0 ? style['tag-off'] : ''}>{ value !== undefined ? value === 1 ? '运行': '停止' : '-- --' }</span>)},
        { title:'加载状态', dataIndex:'is_loading', render:value=>(<span>{ value !== undefined ? value === 1 ? '加载': '卸载' : '-- --' }</span>)},
        { title:'运行模式', dataIndex:'is_auto', render:value=>(<span>{ value !== undefined ? value === 1 ? '自动': '手动' : '-- --' }</span>)},
    ]
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
                rowKey='device_id'
                columns={columns}
                dataSource={stationMachList}
                className={style['self-table-container'] + ' ' + style['dark'] + ' ' + style['noSpace']}
                pagination={{
                    current:currentPage,
                    total,
                    pageSize:12,
                    showSizeChanger:false
                }}
                locale={{
                    emptyText:<div style={{ height:'140px', lineHeight:'140px' }}>暂无空压站信息</div>
                }}
                onChange={(pagination)=>{
                    dispatch({ type:'gasMach/fetchStationStatus'})
                }}
            />
        </div>
    )
}

export default connect(({ gasMach })=>({ gasMach }))(StationTableContainer);