import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Tabs, Skeleton, Modal, Input, Spin, message } from 'antd';
import LineChart from '../gas_monitor/LineChart';
import Loading from '@/pages/components/Loading';
import CustomDatePicker from '@/pages/components/CustomDatePicker';
import style from '@/pages/IndexPage.css';
const { TabPane } = Tabs;


function GasTrend({ dispatch, user, gasMonitor }){
    useEffect(()=>{
        if ( user.authorized ){
            dispatch({ type:'user/toggleTimeType', payload:'2' });
            dispatch({ type:'gasMonitor/initGasTrend'});
        }
    },[user.authorized]);
   
    let { gasInfo, chartInfo, chartLoading, gasTabList, currentTab, typeRule } = gasMonitor;
   
    return (
        <div style={{ height:'100%'}}>
            {
                chartLoading 
                ?
                <Loading />
                :
                null
            }
            <div style={{ height:'40px' }}>
                <CustomDatePicker onDispatch={()=>{
                    dispatch({ type:'gasMonitor/fetchGasChart'});
                }} />
            </div>
            {
                Object.keys(chartInfo).length 
                ?
                <div className={style['card-container']} style={{ height:'calc( 100% - 40px )' }}>
                    <LineChart 
                        info={currentTab}
                        data={chartInfo} 
                        theme={user.theme} 
                        timeType={user.timeType} 
                        typeRule={typeRule}
                        dispatch={dispatch}
                        currentTab={currentTab}
                    />
                </div>
                :
                <Skeleton active />
            }
            
        </div>
    )
}

export default connect(({ user, gasMonitor })=>({ user, gasMonitor }))(GasTrend);