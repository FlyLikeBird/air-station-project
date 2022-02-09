import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Radio, Tree, Spin, Menu, Skeleton, message } from 'antd';
import style from '@/pages/IndexPage.css';
import CustomDatePicker from '@/pages/components/CustomDatePicker';
import InfoItem from '../components/InfoItem';
import StackBarChart from '../components/StackBarChart';
import Loading from '@/pages/components/Loading';

function CostManager({ dispatch, user, cost }){
    useEffect(()=>{
        if ( user.authorized ){
            dispatch({ type:'cost/init'});
        }
    },[user.authorized])
    let { dataType, sumInfo, chartLoading, chartInfo } = cost;
    return (
        <div style={{ position:'relative' }}>
            {
                chartLoading 
                ?
                <Loading />
                :
                null
            }
            <div style={{ height:'50px', display:'flex', alignItems:'center' }}>
                <Radio.Group style={{ marginRight:'1rem' }} className={style['custom-radio']} value={dataType} onChange={e=>{
                    
                    dispatch({ type:'cost/toggleDataType', payload:e.target.value });
                    dispatch({ type:'cost/fetchCostInfo'});
                }}>
                    <Radio.Button value='1' key='1'>成本</Radio.Button>
                    <Radio.Button value='2' key='2'>能耗</Radio.Button>
                </Radio.Group>
                <CustomDatePicker onDispatch={()=>{
                    dispatch({ type:'cost/fetchCostChart' });
                }} />
            </div>
            <div style={{ height:'calc( 100% - 50px)'}}>
                <div style={{ height:'16%', paddingBottom:'1rem' }}>
                    {
                        sumInfo.costInfo && sumInfo.costInfo.length 
                        ?
                        sumInfo.costInfo.map((item,index)=>(
                            <div key={index} className={style['card-container-wrapper']} style={{ width:'33.3%', paddingBottom:'0', paddingRight:index === sumInfo.costInfo.length - 1 ? '0' : '1rem'}}>
                                <div className={style['card-container']}>
                                    <InfoItem data={item} dataType={dataType} theme={user.theme} />
                                </div>
                            </div>
                        ))
                        :
                        <div className={style['card-container']} style={{ overflow:'hidden' }}><Skeleton active className={style['skeleton']} /></div>
                    }
                </div>
                <div className={style['card-container']} style={{ height:'84%' }}>
                    {
                        Object.keys(chartInfo).length 
                        ?
                        <StackBarChart data={chartInfo} timeType={user.timeType} dataType={dataType} theme={user.theme} />
                        :
                        <Skeleton active className={style['skeleton']} />
                    }
                </div>
            </div>
        </div>
    )
}

export default connect(({ user, cost })=>({ user, cost }))(CostManager);