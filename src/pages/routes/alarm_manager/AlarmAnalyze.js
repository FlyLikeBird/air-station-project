import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import style from '@/pages/IndexPage.css';
import CustomDatePicker from '@/pages/components/CustomDatePicker';
import PieChart from './PieChart';
import BarChart from './BarChart';
import Loading from '@/pages/components/Loading';

function AlarmAnalyze({ dispatch, user, alarm }){
    useEffect(()=>{
        dispatch({ type:'alarm/fetchAlarmAnalyze'});
    },[]);
    let { chartLoading, chartInfo } = alarm;
    let loaded = Object.keys(chartInfo).length ? true : false;
    return (
        <div style={{ height:'100%', position:'relative' }}>
            {
                chartLoading
                ?
                <Loading />
                :
                null
            }
            <div style={{ height:'40px' }}>
                <CustomDatePicker onDispatch={()=>{
                    dispatch({ type:'alarm/fetchAlarmAnalyze' });
                }} />
            </div>
            <div style={{ height:'calc( 100% - 40px)'}}>
                <div style={{ height:'33.3%', paddingBottom:'1rem' }}>
                    <div className={style['card-container-wrapper']} style={{ width:'50%', paddingBottom:'0' }}>
                        <div className={style['card-container']} style={{ overflow:'hidden' }}>
                            {
                                loaded 
                                ?
                                <PieChart data={chartInfo['typeRecords'] || {}} title='告警分析' theme={user.theme} />
                                :
                                <Spin className={style['spin']} />
                            }
                        </div>
                    </div>
                    <div className={style['card-container-wrapper']} style={{ width:'50%', paddingBottom:'0', paddingRight:'0' }}>
                        <div className={style['card-container']} style={{ overflow:'hidden' }}>
                            {
                                loaded 
                                ?
                                <PieChart data={chartInfo['statusInfo'] || {}} title='处理进度' theme={user.theme} />
                                :
                                <Spin className={style['spin']} />
                            }
                        </div>
                    </div>
                </div>
                <div style={{ height:'66.6%' }}>
                    <div className={style['card-container']} style={{ overflow:'hidden' }}>
                        {
                            loaded 
                            ?
                            <BarChart data={chartInfo['valueArr']} title='告警趋势' theme={user.theme} timeType={user.timeType} />
                            :
                            <Spin className={style['spin']} />
                        }
                    </div>
                </div>
            </div>   
        </div>
    )
}

export default connect(({ user, alarm })=>({ user, alarm }))(AlarmAnalyze);