import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Tabs, Skeleton, Spin } from 'antd';
import LineChart from '../gas_monitor/LineChart';
import CustomDatePicker from '@/pages/components/CustomDatePicker';
import style from '@/pages/IndexPage.css';
const { TabPane } = Tabs;

let tabList = [
    { tab:'需量', key:'1', unit:'kw' },
    { tab:'电压', key:'2', unit:'V' },
    { tab:'视在功率', key:'3', unit:'kw'},
    { tab:'有功功率', key:'4', unit:'kw'},
    { tab:'无功功率', key:'5', unit:'kvar'},
    { tab:'电流', key:'6', unit:'A'}
];
function EleMonitor({ dispatch, user, gasMonitor }){
    useEffect(()=>{
        if ( user.authorized ){
            dispatch({ type:'gasMonitor/initEleMonitor'});
        }
    },[user.authorized]);
    useEffect(()=>{
        return ()=>{
            dispatch({ type:'gasMonitor/reset'});
        }
    },[])
    let { gasInfo, chartInfo, chartLoading, dataType } = gasMonitor;
    return (
        <div style={{ height:'100%'}}>
            {
                Object.keys(gasInfo).length 
                ?
                <div className={style['flex-container'] + ' ' + ( user.theme === 'dark' ? style['dark'] : '' )} style={{ height:'24%', paddingBottom:'1rem' }}>
                {
                    gasInfo.infoList && gasInfo.infoList.length
                    ?
                    gasInfo.infoList.map((item,index)=>(
                        <div key={item.title} className={style['flex-item-wrapper']} style={{ width:'24%'}}>
                            <div className={style['flex-item']}>
                                <div className={style['flex-item-title']}>
                                    { item.title }
                                </div>
                                <div className={style['flex-item-content']}>
                                    {
                                        item.child && item.child.length 
                                        ?
                                        item.child.map((sub)=>(
                                            <div key={sub.title} style={{ height:'25%', display:'flex', alignItems:'center', }}>
                                                <div className={style['flex-item-symbol']} style={{ backgroundColor:sub.type === 'A' ? '#eff400' : sub.type === 'B' ? '#00ff00' : sub.type === 'C' ? '#ff0000' : '#01f1e3' }}></div>
                                                <div>{ sub.title }</div>
                                                <div style={{ flex:'1', height:'1px', backgroundColor: user.theme === 'dark' ? '#34557e' : '#e4e4e4', margin:'0 6px'}}></div>
                                                <div style={{ fontSize:'1.2rem' }}>{ sub.value ? ( sub.unit === 'cosΦ' ? (+sub.value).toFixed(2) : (+sub.value).toFixed(0))  + ' ' + sub.unit : '-- --' }</div>
                                            </div>
                                        ))
                                        :
                                        null
                                    }
                                </div>
                            </div>
                        </div>
                    ))
                    :
                    null                        
                } 
                </div>
                :
                <div style={{ height:'24%', paddingBottom:'1rem' }}>
                    <div className={style['card-container']} style={{ overflow:'hidden' }}>
                        <Skeleton active className={style['skeleton']} />                         
                    </div>
                </div>
            }
            
            <div className={style['card-container']} style={{ height:'76%' }}>
                <Tabs
                    className={style['custom-tabs'] + ' ' + style['flex-tabs']}
                    activeKey={dataType}
                    onChange={activeKey=>{
                        dispatch({ type:'gasMonitor/setDataType', payload:activeKey });
                        dispatch({ type:'gasMonitor/fetchEleChart'});
                    }}
                    tabBarExtraContent={
                        (
                        <div style={{ paddingRight:'1rem' }}>
                            <CustomDatePicker size='small' onDispatch={()=>{
                                dispatch({ type:'gasMonitor/fetchEleChart'});
                            }}/>
                        </div>
                        )
                    }
                >
                    {
                        tabList.map((item, index)=>(
                           
                            <TabPane tab={item.tab} key={item.key}>
                                {
                                    chartLoading 
                                    ?
                                    null
                                    :
                                    <LineChart info={item} data={chartInfo} theme={user.theme} />
                                }
                                   
                            </TabPane>
                           
                        ))
                    }                    
                </Tabs>
            </div>
        </div>
    )
}

export default connect(({ user, gasMonitor })=>({ user, gasMonitor }))(EleMonitor);