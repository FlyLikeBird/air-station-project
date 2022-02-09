import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Table, Modal, Popconfirm, message } from 'antd';
import { PlusCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Loading from '@/pages/components/Loading';
import AddForm from './AddForm';
import style from './AddForm.css';
import IndexStyle from '@/pages/IndexPage.css';

let deviceTypes = [
    { title:'空压站', key:1},
    { title:'空压机', key:2},
    { title:'变压站', key:3},
    { title:'变压器', key:4},
    { title:'其他', key:0 }
];

function DeviceManager({ dispatch, user, device }){
    useEffect(()=>{
        if ( user.authorized ){
            dispatch({ type:'device/fetchDeviceList'});
            dispatch({ type:'device/fetchMeter'})
        }
    },[user.authorized]);
    let [info, setInfo] = useState({ visible:false, forEdit:false, machInfo:null });
    let { list, currentPage, total, meterList, isLoading } = device;
    
    let columns = [
        {
            title:'序号',
            width:'60px',
            render:(text,record,index)=>{
                return `${ ( currentPage - 1) * 12 + index + 1}`;
            }
        },
        { title:'资产编号', dataIndex:'device_no' },
        { title:'产品名称', dataIndex:'device_name' },
        { title:'产品型号', dataIndex:'device_model'},
        { title:'产品序列码', dataIndex:'sequence_code'},
        { 
            title:'设备类型', 
            dataIndex:'device_type', 
            render:(value)=>{
                let temp = deviceTypes.filter(i=>i.key === value )[0];
                return (<span>{ temp ? temp.title : '-- --' }</span>)
            }
        },
        { title:'购买日期', dataIndex:'buy_date' },
        { title:'生产日期', dataIndex:'make_date' },
        { title:'保修截止日期', dataIndex:'guarantee_date'},
        { title:'购买金额', dataIndex:'buy_amount' },
        { title:'在保状态', dataIndex:'in_insurance', render:(value)=>(<span className={value === 1 ? IndexStyle['tag-on'] : IndexStyle['tag-off']}>{ value === 1 ? '保内' : '保外' }</span>) },  
        {
            title:'操作',
            render:(row)=>{
                return (
                    <div>
                        <span className={IndexStyle['btn'] + ' ' + IndexStyle['small']} onClick={()=>setInfo({ visible:true, forEdit:true, machInfo:row })}><EditOutlined />编辑</span>
                        <Popconfirm title='确定删除此条设备档案吗' okText='确定' cancelText='取消' onConfirm={()=>{
                            new Promise((resolve, reject)=>{
                                dispatch({ type:'device/del', payload:{ resolve, reject, device_id:row.device_id }})
                            })
                            .then(()=>{
                                message.success('删除设备档案成功');
                            })
                            .catch(msg=>message.error(msg))
                        }}><span className={IndexStyle['btn'] + ' ' + IndexStyle['small']}><DeleteOutlined />删除</span></Popconfirm>
                        
                    </div>
                )
            }
        }
    ];
    return (
            <div className={IndexStyle['card-container']}>
                {
                    isLoading
                    ?
                    <Loading />
                    :
                    null
                }
                <div style={{ height:'60px', display:'flex', alignItems:'center', padding:'0 1rem' }}>
                    <span className={IndexStyle['btn']} onClick={()=>setInfo({ visible:true, forEdit:false })}><PlusCircleOutlined />新增设备</span>
                </div>
                <div style={{ height:'calc( 100% - 60px)'}}>         
                    <Table 
                        rowKey='device_id'
                        columns={columns}
                        dataSource={list}
                        className={IndexStyle['self-table-container'] + ' ' + ( user.theme === 'dark' ? IndexStyle['dark'] : '' ) + ' ' + IndexStyle['noSpace']}
                        pagination={{
                            current:currentPage,
                            total,
                            pageSize:12,
                            showSizeChanger:false
                        }}
                        locale={{
                            emptyText:<div style={{ height:'140px', lineHeight:'140px' }}>暂无设备档案信息</div>
                        }}
                        onChange={(pagination)=>{
                            dispatch({ type:'device/fetchDeviceList', payload:{ currentPage:pagination.current }});
                        }}
                    />
                </div>
                <Modal
                    visible={info.visible}
                    footer={null}
                    width="40%"
                    title={`${info.forEdit ? '编辑':'新增'}设备档案`}
                    className={style['modal-container']}
                    bodyStyle={{ padding:'40px', backgroundColor:'#000' }}
                    closable={false}
                    onCancel={()=>setInfo({ visible:false, forEdit:false })}
                >
                    <AddForm 
                        info={info}
                        onDispatch={action=>dispatch(action)}
                        meterList={meterList}
                        deviceList={list}
                        onClose={()=>setInfo({ visible:false, forEdit:false })} 
                    />
                </Modal>
            </div>
    )
}

export default connect(({ user, device })=>({ user, device }))(DeviceManager);