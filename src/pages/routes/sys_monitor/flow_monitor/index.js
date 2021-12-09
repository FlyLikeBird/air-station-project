import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import style from '@/pages/IndexPage.css';
import FlowChart from './FlowChart';
import onImg from '../../../../../public/status_on.png';
import offImg from '../../../../../public/status_off.png';

function FlowMonitor({ dispatch, flow }){
    useEffect(()=>{
        dispatch({ type:'flow/initFlowChart'});
    },[]);
    let { isLoading, sumInfo, statusMaps } = flow;
    return (
        <div style={{ height:'100%'}}>
            <div style={{ height:'16%', paddingBottom:'1rem' }}>
                <div className={style['card-container']}>
                    {
                        isLoading
                        ?
                        <Spin className={style['spin']} />
                        :
                        <div className={style['flex-container']} style={{ color:'#fff'}}>
                            <div className={style['flex-item']} style={{ height:'auto', display:'flex', flexDirection:'column', alignItems:'center' }}>
                                <div><img src={onImg} /></div>
                                <div style={{ color:'rgba(255, 255, 255, 0.8)'}}>运行正常</div>
                            </div>
                            <div className={style['flex-item']} style={{ height:'auto', display:'flex', flexDirection:'column', alignItems:'center' }}>
                                <div><img src={offImg} /></div>
                                <div style={{ color:'rgba(255, 255, 255, 0.8)'}}>停机</div>
                            </div>
                            <div className={style['flex-item']} style={{ height:'auto', display:'flex', flexDirection:'column', alignItems:'center' }}>
                                <div><span style={{ fontSize:'2rem', fontWeight:'bold', margin:'0 6px' }}>{ sumInfo.pressure }</span><span>(bar)</span></div>
                                <div style={{ color:'rgba(255, 255, 255, 0.8)'}}>系统压力</div>
                            </div>
                            <div className={style['flex-item']} style={{ height:'auto', display:'flex', flexDirection:'column', alignItems:'center' }}>
                                <div><span style={{ fontSize:'2rem', fontWeight:'bold', margin:'0 6px' }}>{ sumInfo.speed }</span><span>(m³/min)</span></div>
                                <div style={{ color:'rgba(255, 255, 255, 0.8)'}}>系统流量</div>
                            </div>
                            <div className={style['flex-item']} style={{ height:'auto', display:'flex', flexDirection:'column', alignItems:'center' }}>
                                <div><span style={{ fontSize:'2rem', fontWeight:'bold', margin:'0 6px' }}>{ sumInfo.monthEnergy ? Math.round(sumInfo.monthEnergy) : 0 }</span><span>(kwh)</span></div>
                                <div style={{ color:'rgba(255, 255, 255, 0.8)'}}>系统电量</div>
                            </div>
                            <div className={style['flex-item']} style={{ height:'auto', display:'flex', flexDirection:'column', alignItems:'center' }}>
                                <div><span style={{ fontSize:'2rem', fontWeight:'bold', margin:'0 6px' }}>{ sumInfo.monthGasEleRatio }</span><span>(m³/kwh)</span></div>
                                <div style={{ color:'rgba(255, 255, 255, 0.8)'}}>气电比</div>
                            </div>
                        </div>
                    }
                </div>
            </div>
            <div style={{ height:'84%', position:'relative' }}>
                {
                    isLoading 
                    ?
                    <Spin className={style['spin']} size='large' />
                    :
                    <FlowChart dispatch={dispatch} sumInfo={sumInfo} statusMaps={statusMaps} />
                }
            </div>
        </div>
    )
}

export default connect(({ flow })=>({ flow }))(FlowMonitor);