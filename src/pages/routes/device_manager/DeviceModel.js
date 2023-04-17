import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Table, Modal, Popconfirm, Drawer, message } from 'antd';
import { PlusCircleOutlined, EditOutlined, DeleteOutlined, FileAddOutlined } from '@ant-design/icons';
import Loading from '@/pages/components/Loading';
import IndexStyle from '@/pages/IndexPage.css';
import AddDeviceModel from './components/AddDeviceModel';

let deviceTypes = [
    { title:'空压站', key:1},
    { title:'空压机', key:2},
    { title:'变压站', key:3},
    { title:'变压器', key:4},
    { title:'其他', key:0 }
];

function DeviceModel({ dispatch, user, deviceModel }){
    useEffect(()=>{
        if ( user.authorized ){
            dispatch({ type:'deviceModel/initModels' });
        }
    },[user.authorized]);
    let [info, setInfo] = useState({ visible:false, forEdit:false, modelInfo:null });
    let { modelList, currentPage, total, brandList, isLoading } = deviceModel;
    
    let columns = [
        {
            title:'序号',
            width:'60px',
            render:(text,record,index)=>{
                return `${ ( currentPage - 1) * 12 + index + 1}`;
            }
        },
        { title:'模型名称', dataIndex:'model_name' },
        { title:'型号', dataIndex:'model_code' },
        { title:'品牌', dataIndex:'brand_name' },
        { title:'额定功率(kw)', dataIndex:'rated_power', render:value=>(<span>{ value || '-- -- '}</span>) },
        { title:'比功率 Kw/(m³/min)', dataIndex:'specific_power', render:value=>(<span>{ value || '-- -- '}</span>) },
        { title:'频率(HZ)', dataIndex:'frequency', render:value=>(<span>{ value || '-- -- '}</span>) },
        { title:'外形尺寸(米)', dataIndex:'size', render:value=>(<span>{ value || '-- -- '}</span>) },
        { title:'重量(Kg)', dataIndex:'weight', render:value=>(<span>{ value || '-- -- '}</span>) },
        { title:'质保年限(年)', dataIndex:'warranty', render:value=>(<span>{ value || '-- -- '}</span>) },
        {
            title:'操作',
            render:(row)=>{
                return (
                    <div>
                        <span className={IndexStyle['btn'] + ' ' + IndexStyle['small']} onClick={()=>setInfo({ visible:true, forEdit:true, modelInfo:row })}><EditOutlined />编辑</span>
                        <Popconfirm title='确定删除此设备模型吗' okText='确定' cancelText='取消' onConfirm={()=>{
                            new Promise((resolve, reject)=>{
                                dispatch({ type:'deviceModel/delModelAsync', payload:{ resolve, reject, model_id:row.id }})
                            })
                            .then(()=>{
                                message.success('删除设备模型成功');
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
                    <span className={IndexStyle['btn']} onClick={()=>setInfo({ visible:true, forEdit:false })}><FileAddOutlined />新增设备模型</span>
                </div>
                <div style={{ height:'calc( 100% - 60px)'}}>         
                    <Table 
                        rowKey='id'
                        columns={columns}
                        dataSource={modelList}
                        className={IndexStyle['self-table-container'] + ' ' + ( user.theme === 'dark' ? IndexStyle['dark'] : '' ) + ' ' + IndexStyle['noSpace']}
                        pagination={{
                            current:currentPage,
                            total,
                            pageSize:12,
                            showSizeChanger:false
                        }}
                        locale={{
                            emptyText:<div style={{ height:'140px', lineHeight:'140px' }}>暂无设备模型信息</div>
                        }}
                        onChange={(pagination)=>{
                            dispatch({ type:'device/fetchModelList', payload:{ currentPage:pagination.current }});
                        }}
                    />
                </div>
                <Drawer 
                    visible={info.visible}
                    width='50%'
                    className={IndexStyle['custom-drawer']}
                    title={`${info.forEdit ? '更新' : '新建'}设备模型`}
                    placement="right" 
                    bodyStyle={{ padding:'24px 40px' }}
                    onClose={()=>setInfo({ visible:false, forEdit:false })} 
                >
                    <AddDeviceModel 
                        info={info}
                        brandList={brandList}
                        dispatch={dispatch}
                        onClose={()=>setInfo({visible:false, forEdit:false })}
                    />
                </Drawer>
            </div>
    )
}

export default connect(({ user, deviceModel })=>({ user, deviceModel }))(DeviceModel);