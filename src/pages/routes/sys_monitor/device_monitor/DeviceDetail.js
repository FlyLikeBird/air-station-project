import React, { useState, useEffect, useRef } from 'react';
import { Modal, Spin, Switch, DatePicker } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import style from './DeviceMonitor.css';
import MachLineChart from './MachLineChart';
import CustomDatePicker from '@/pages/components/CustomDatePicker';
import zhCN from 'antd/es/date-picker/locale/zh_CN';
import PieChart from './PieChart';

const wrapperStyle = {
    width:'33.3%',
    height:'50%',
}
const contentStyle = {
    backgroundColor:'#3b5b85'
}

function DeviceDetail({ dispatch, info, data, isLoading  }){
    const inputRef = useRef();
    useEffect(()=>{
        dispatch({ type:'device/fetchDeviceDetail', payload:{ device_id:info.machInfo.device_id }});
    },[info]);
    return (
        <div style={{ height:'100%'}}>
            <div className={style['inline-container'] + ' ' + style['dark']}>
                <div className={style['inline-item-wrapper']} style={{ width:'33.3%', height:'50%'}}>
                    <div className={style['inline-item']} style={{ position:'relative' }}>
                        <div style={{ position:'absolute', right:'0', top:'0'}}>
                            <CustomDatePicker noToggle={true} size='small' onDispatch={()=>{
                                dispatch({ type:'device/fetchDeviceDetail', payload:{ device_id:info.machInfo.device_id }});
                            }} />
                        </div>
                        <div style={{ height:'100%', display:'flex', alignItems:'center' }}>
                            <div style={{ width:'50%' }}><img src={info.machInfo.img} style={{ width:'100%' }} /></div>
                            {
                                info.machInfo.device_type === 1
                                ?
                                <div>
                                    <div className={style['text-container']}>
                                        <span className={style['text']}>设备编号:</span>
                                        <span className={style['data']}>{ info.machInfo.device_no || '-- --' }</span>
                                    </div>
                                    <div className={style['text-container']}>
                                        <span className={style['text']}>系统压力:</span>
                                        <span className={style['data']}>{ info.machInfo.pressure + ' ' + 'bar'  }</span>
                                    </div>
                                    <div className={style['text-container']}>
                                        <span className={style['text']}>瞬时流量:</span>
                                        <span className={style['data']}>{ info.machInfo.speed + ' ' + 'm³/min'  }</span>
                                    </div>
                                </div>
                                :
                                info.machInfo.device_type === 2
                                ?
                                <div>
                                    <div className={style['text-container']}>
                                        <span className={style['text']}>运行状态:</span>
                                        <span className={style['data']}>{ info.machInfo.is_running ? '运行' :'停机' }</span>
                                    </div>
                                    <div className={style['text-container']}>
                                        <span className={style['text']}>加载状态:</span>
                                        <span className={style['data']}>{ info.machInfo.is_loading ? '加载' :'卸载' }</span>
                                    </div>
                                    <div className={style['text-container']}>
                                        <span className={style['text']}>控制模式:</span>
                                        <span className={style['data']}>{ info.machInfo.is_auto ? '自动' :'手动' }</span>
                                    </div>
                                    <div className={style['text-container']}>
                                        <span className={style['text']}>加载压力:</span>
                                        <span className={style['data']}>{ info.machInfo.loading + ' ' + 'bar' }</span>
                                    </div>
                                    <div className={style['text-container']}>
                                        <span className={style['text']}>机组排气压力:</span>
                                        <span className={style['data']}>{ info.machInfo.grp_air_out + ' ' + 'bar' }</span>
                                    </div>
                                    <div className={style['text-container']}>
                                        <span className={style['text']}>机组排气温度:</span>
                                        <span className={style['data']}>{ info.machInfo.main_tmp_out + ' ' + '℃' }</span>
                                    </div>
                                </div>
                                :
                                null
                            }
                            
                        </div>
                    </div>
                </div>
                <div className={style['inline-item-wrapper']} style={{ width:'66.6%' , height:'50%'}}>
                    <div className={style['inline-item']}>
                        <div className={style['inline-item-title']}>{ info.machInfo.device_type === 1 ? '总管压力(bar)' : '机组排气压力(bar)' }</div>
                        <div className={style['inline-item-content']}>
                            {
                                isLoading 
                                ?
                                <Spin className={style['spin']} />
                                :
                                <MachLineChart 
                                    xData={data.view.date} 
                                    yData={ info.machInfo.device_type === 1 ? data.view.pressure : data.view.outPress } 
                                    name={ info.machInfo.device_type === 1 ? '总管压力' : '机组排气压力'} 
                                    theme='dark'
                                />
                            }
                        </div>
                    </div>
                </div>
               
                <div className={style['inline-item-wrapper']} style={{ width:'33.3%' , height:'50%'}}>
                    <div className={style['inline-item']}>
                        <div className={style['inline-item-title']}>终端状态</div>
                        <div className={style['inline-item-content']}>
                            {
                                isLoading
                                ?
                                <Spin className={style['spin']} />
                                :
                                <PieChart data={data.warningInfo} />
                            }
                        </div>
                        
                    </div>
                </div>
                <div className={style['inline-item-wrapper']} style={{ width:'66.6%' , height:'50%'}}>
                    <div className={style['inline-item']}>
                        <div className={style['inline-item-title']}>{ info.machInfo.device_type === 1 ? '瞬时流量(m³/min)' : '主机排气温度(℃)' }</div>
                        <div className={style['inline-item-content']}>
                            {
                                isLoading 
                                ?
                                <Spin className={style['spin']} />
                                :
                                <MachLineChart 
                                    xData={data.view.date} 
                                    yData={ info.machInfo.device_type === 1 ? data.view.speed : data.view.outTemp } 
                                    name={ info.machInfo.device_type === 1 ? '瞬时流量' : '主机排气温度'} 
                                    theme='dark'
                                />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    )
}

export default DeviceDetail;