import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Modal, Pagination } from 'antd';
import style from './DeviceMonitor.css';
import IndexStyle from '@/pages/IndexPage.css';
import Loading from '@/pages/components/Loading';
import DeviceDetail from './DeviceDetail';

function DeviceMonitor({ dispatch, user, device }){
    useEffect(()=>{
        dispatch({ type:'user/toggleTimeType', payload:'1' });
        dispatch({ type:'device/initInfoList'});
    },[]);
    let [info, setInfo] = useState({ visible:false, machInfo:null });
    let { deviceInfoList, deviceTypes, currentType, isLoading, currentPage, total, detailInfo, detailLoading } = device;
    let pagesize = user.containerWidth <= 1440 ? 9 : 12;
    return (
        <div className={style['inline-container'] + ' ' + ( user.theme === 'dark' ? style['dark'] : '')}>
            {
                isLoading 
                ?
                <Loading />
                :
                null
            }
            <div className={style['inline-container-main']}>
                {
                    
                    deviceInfoList.length 
                    ?
                    deviceInfoList.map((item,index)=>(
                        <div className={style['inline-item-wrapper']} style={{ width:user.containerWidth <= 1440 ? '33.3%' : '25%'}} key={index}>
                            <div className={style['inline-item']} onClick={()=>{
                                setInfo({ visible:true, machInfo:item });
                            }}>
                                <div className={style['inline-item-title']}>
                                    <div>{ item.device_name }</div>
                                    <div className={style['tag']} style={{ backgroundColor:item.is_fault || item.is_warning ? '#ff2d2e' : '#01f1e3'}}>{ item.is_fault || item.is_warning ? '异常' :'正常' }</div>
                                </div>
                                <div className={style['inline-item-content']}>
                                    <div style={{ width:'46%' }}><img src={item.img} style={{ width:'100%' }} /></div>
                                    {
                                        currentType.device_type === 1
                                        ?
                                        <div>
                                            <div className={style['text-container']}>
                                                <span className={style['text']}>设备编号:</span>
                                                <span className={style['data']}>{ item.device_no || '-- --' }</span>
                                            </div>
                                            <div className={style['text-container']}>
                                                <span className={style['text']}>系统压力:</span>
                                                <span className={style['data']}>{ item.pressure + ' ' + 'bar'  }</span>
                                            </div>
                                            <div className={style['text-container']}>
                                                <span className={style['text']}>瞬时流量:</span>
                                                <span className={style['data']}>{ item.speed + ' ' + 'm³/min'  }</span>
                                            </div>
                                        </div>
                                        :
                                        currentType.device_type === 2
                                        ?
                                        <div>
                                            <div className={style['text-container']}>
                                                <span className={style['text']}>运行状态:</span>
                                                <span className={style['data']}>{ item.is_running ? '运行' :'停机' }</span>
                                            </div>
                                            <div className={style['text-container']}>
                                                <span className={style['text']}>加载状态:</span>
                                                <span className={style['data']}>{ item.is_loading ? '加载' :'卸载' }</span>
                                            </div>
                                            <div className={style['text-container']}>
                                                <span className={style['text']}>控制模式:</span>
                                                <span className={style['data']}>{ item.is_auto ? '自动' :'手动' }</span>
                                            </div>
                                            <div className={style['text-container']}>
                                                <span className={style['text']}>加载压力:</span>
                                                <span className={style['data']}>{ item.loading + ' ' + 'bar' }</span>
                                            </div>
                                            <div className={style['text-container']}>
                                                <span className={style['text']}>机组排气压力:</span>
                                                <span className={style['data']}>{ item.grp_air_out + ' ' + 'bar' }</span>
                                            </div>
                                            <div className={style['text-container']}>
                                                <span className={style['text']}>机组排气温度:</span>
                                                <span className={style['data']}>{ item.main_tmp_out + ' ' + '℃' }</span>
                                            </div>
                                        </div>
                                        :
                                        <div>
                                            <div className={style['text-container']}>
                                                <span className={style['text']}>编号:</span>
                                                <span className={style['data']}>{ item.register_code }</span>
                                            </div>
                                            <div className={style['text-container']}>
                                                <span className={style['text']}>支路:</span>
                                                <span className={style['data']}>{ item.branch_name }</span>
                                            </div>
                                            <div className={style['text-container']}>
                                                <span className={style['text']}>区域:</span>
                                                <span className={style['data']}>{ item.region_name }</span>
                                            </div>
                                            <div className={style['text-container']}>
                                                <span className={style['text']}>告警:</span>
                                                <span className={style['data']} style={{ color:'#ffa63f' }}>{ item.rule_name || '-- --' }</span>
                                            </div>
                                        </div>
                                    }
                                    
                                </div>
                            </div>
                        </div>
                    ))
                    :
                    <div className={style['empty-text']}>暂时没有这种设备</div>
                }
            </div>
            {/* 分页符 */}
            {
                total > pagesize
                ?                                
                <Pagination size={user.containerWidth <= 1440 ? 'small' : 'default'} pageSize={pagesize} current={currentPage} total={total} showSizeChanger={false} onChange={page=>{
                    dispatch({ type:'device/fetchInfoList', payload:{ currentPage:page }});
                }} />
                :
                null
            }
            {/* 设备详情modal */}
            <Modal 
                visible={info.visible}
                footer={null}
                className={IndexStyle['custom-modal'] + ' ' + ( user.theme === 'dark' ? IndexStyle['dark'] : '')}
                width='80vw'
                height='80vh'
                destroyOnClose={true}
                onCancel={()=>{
                    setInfo({ visible:false, machInfo:null });
                    dispatch({ type:'device/resetDetail'});
                }}
            >
                <DeviceDetail
                    dispatch={dispatch}
                    info={info}
                    data={detailInfo}
                    isLoading={detailLoading}
                    theme={user.theme}
                />
                
            </Modal>
        </div>
    )
}

export default connect(({ user, device })=>({ user, device }))(DeviceMonitor);