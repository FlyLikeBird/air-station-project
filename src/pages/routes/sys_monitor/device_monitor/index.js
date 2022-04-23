import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Modal, Pagination } from 'antd';
import { LineChartOutlined } from '@ant-design/icons';
import style from './DeviceMonitor.css';
import IndexStyle from '@/pages/IndexPage.css';
import Loading from '@/pages/components/Loading';
import DeviceDetail from './DeviceDetail';
import LimitLineChart from './LimitLineChart';
import MachImg from '../../../../../public/terminal-mach-chart.png';

let fieldList = [
    // { title:'设备注册码', key:'device_no' },
    // { title:'设备类型', key:'device_type' },
    { isBool:true, title:'运行状态', key:'is_running', 1:'运行', 0:'停机'},
    { isBool:true, title:'加载状态', key:'is_loading', 1:'加载', 0:'卸载'},
    { isBool:true, title:'故障状态', key:'is_fault', 1:'故障', 0:'正常' },
    { isBool:true, title:'运行模式', key:'is_auto', 1:'自动', 0:'手动' },
    { isBool:true, title:'待机状态', key:'is_standby', 1:'待机', 0:'非待机'},
    { title:'加载压力(bar)', key:'loading', },
    { title:'卸载压力(bar)', key:'unloading'},
    { title:'机组排气压力(bar)', key:'grp_air_out'},
    { title:'主机排气温度(℃)', key:'main_tmp_out'},
    { title:'运行时间(h)', key:'run_time'},
    { title:'加载时间(h)', key:'load_time'}
];
function DeviceMonitor({ dispatch, user, device }){
    useEffect(()=>{
        dispatch({ type:'user/toggleTimeType', payload:'1' });
        dispatch({ type:'device/initInfoList'});
    },[]);
    let [info, setInfo] = useState({});
    let { deviceInfoList, isLoading, stationInfoList, pressureChartInfo, speedChartInfo, flowChartInfo, tempChartInfo, currentPage, total, detailInfo, detailLoading } = device;
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
            {/* <div className={style['inline-container-main']}>
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
            </div> */}
            {/* 分页符 */}
            {/* {
                total > pagesize
                ?                                
                <Pagination size={user.containerWidth <= 1440 ? 'small' : 'default'} pageSize={pagesize} current={currentPage} total={total} showSizeChanger={false} onChange={page=>{
                    dispatch({ type:'device/fetchInfoList', payload:{ currentPage:page }});
                }} />
                :
                null
            } */}
            {/* 设备详情modal */}
            {/* <Modal 
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
                
            </Modal> */}
            <div style={{ height:'120px' }}>
                {
                    stationInfoList.map((item,i)=>(
                        <div className={style['inline-item-wrapper']} style={{ paddingLeft:i === 0 ? '0' : '1rem' }}>
                            <div className={style['inline-item']} style={{ backgroundColor:'#2e2e44', display:'flex', alignItems:'center', padding:'0 2rem' }}>
                                <div>
                                    <div>{ item.title }</div>
                                    <div>
                                        <span className={style['data']}>{ item.value }</span>
                                        <span className={style['unit']}>{ item.unit }</span>
                                    </div>
                                </div>
                                <div style={{ flex:'1' }}>                                   
                                    <LimitLineChart 
                                        data={
                                            item.key === 'pressure' ? pressureChartInfo : 
                                            item.key === 'speed' ? speedChartInfo : 
                                            item.key === 'flow' ? flowChartInfo : 
                                            item.key === 'temp' ? tempChartInfo : {}
                                        } 
                                        forShort={true} 
                                        info={item}
                                        onVisible={obj=>setInfo(item)}
                                        dispatch={dispatch}
                                        theme='dark'
                                    />                                 
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
            <div style={{ height:'calc( 100% - 120px)', whiteSpace:'nowrap', overflow:'auto hidden' }}>
                {
                    deviceInfoList.length 
                    ?
                    deviceInfoList.map((item,index)=>(
                        <div key={item.device_id} className={style['inline-item-wrapper']} style={{ paddingLeft:index === 0 ? '0' : '1rem', paddingBottom:'0' }}>
                            <div className={style['inline-item']}>
                                <div className={style['inline-item-title']}>{ item.device_name }</div>
                                <div className={style['inline-item-content']}>
                                    <div style={{ textAlign:'center' }}><img src={item.img} style={{ height:'140px' }} /></div>
                                    <div style={{ padding:'0 2rem', color:'#fff' }}> 
                                        {
                                            fieldList.map((field, j)=>(
                                                <div key={`${index}-${j}`} style={{ 
                                                    display:'flex', 
                                                    justifyContent:'space-between', 
                                                    borderBottom: j === fieldList.length - 1 ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                                                    padding:'0.5rem 0'
                                                }}>
                                                    <span style={{ color:'rgba(255, 255, 255, 0.8)'}}>{ field.title }</span>
                                                    <span>
                                                        { field.isBool ? field[item[field.key]] : item[field.key] }
                                                        {/* { item.hasIcon ? <LineChartOutlined style={{ color:'#05a0f9', fontSize:'1.2rem', marginLeft:'4px' }} onClick={()=>setInfo({ visible:true, machInfo:{}})} /> : null } */}
                                                    </span>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                    :
                    <div>空压机设备为空</div>
                }
            </div>
            <Modal
                visible={Object.keys(info).length ? true : false}
                footer={null}
                width="60%"
                height='540px'
                className={IndexStyle['custom-modal-2']}
                onCancel={()=>setInfo({})}
            >
                <LimitLineChart 
                    data={info.key === 'pressure' ? pressureChartInfo : info.key === 'speed' ? speedChartInfo : info.key === 'flow' ? flowChartInfo : info.key === 'temp' ? tempChartInfo : {}} 
                    info={info} 
                    onVisible={obj=>setInfo(obj)}
                    onDispatch={action=>dispatch(action)} 
                    dispatch={dispatch}
                    theme='dark' 
                />
            </Modal>
        </div>
    )
}

export default connect(({ user, device })=>({ user, device }))(DeviceMonitor);