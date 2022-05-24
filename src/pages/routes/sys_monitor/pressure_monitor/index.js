import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Tabs, Skeleton, Spin } from 'antd';
import LineChart from './LineChart';
import Loading from '@/pages/components/Loading';
import CustomDatePicker from '@/pages/components/CustomDatePicker';
import style from '@/pages/IndexPage.css';

function EleMonitor({ dispatch, user, gasMonitor }){
    useEffect(()=>{
        if ( user.authorized ){
            dispatch({ type:'gasMonitor/initPressure'});
        }
    },[user.authorized]);
    useEffect(()=>{
        return ()=>{
            dispatch({ type:'gasMonitor/reset'});
        }
    },[])
    let { chartInfo, chartLoading, dataType } = gasMonitor;
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
                    dispatch({ type:'gasMonitor/fetchPressureDiff' });
                }} />
            </div>
            <div className={style['card-container']} style={{ height:'calc(100% - 40px)' }}>
                <LineChart data={chartInfo} />
            </div>
        </div>
    )
}

export default connect(({ user, gasMonitor })=>({ user, gasMonitor }))(EleMonitor);