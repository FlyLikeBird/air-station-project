import React, { useEffect } from 'react';
import { Redirect } from 'umi';
import { connect } from 'dva';
import { Spin } from 'antd';
import style from './airStation.css';
import IndexStyle from '@/pages/IndexPage.css';
import LineChart from './components/LineChart';
import BarChart from './components/BarChart';
import GaugeChart from './components/GaugeChart';
import NumberFormat from './components/NumberFormat';
import SceneModel from './SceneModel';
import ScrollTable from '@/pages/components/ScrollTable';
import CustomTabs from './CustomTabs';
import FullscreenHeader from '@/pages/components/FullscreenHeader';
import monitorBg from '../../../../public/monitor_bg.jpg'

let timer;
function isFullscreen(){
    return document.fullscreenElement    ||
           document.msFullscreenElement  ||
           document.mozFullScreenElement ||
           document.webkitFullscreenElement || false;
}
function IndexPage({ dispatch, user, location, home }){
    let { userInfo, companyList, msg, userMenu, currentMenu, routePath, authorized } = user;
    let { data, sceneLoading } = home;
    let loaded = Object.keys(data).length ? true : false; 
    let isFulled = isFullscreen();
    useEffect(()=>{
        timer = setInterval(()=>{
            dispatch({ type:'home/fetchGasStationInfo'});
        }, 8 * 60 * 1000) 
        return ()=>{
            clearInterval(timer);
            dispatch({ type:'home/reset'});
            timer = null;
        }     
    },[]);
    useEffect(()=>{
        if ( authorized ){
            dispatch({ type:'home/fetchGasStationInfo'});
        }
    },[authorized]);
    return (
        // 当包含首页时才渲染首页模块，否则跳转到菜单列表默认的第一项
        authorized 
        ?
        routePath.includes('gas_home')
        ?
        <div className={style['container']} style={{ backgroundImage:`url(${monitorBg})`}}>
            {
                isFulled
                ?
                <FullscreenHeader title='智慧空压站' />
                :
                null
            }
            {
                sceneLoading 
                ?
                <Spin size='large' className={IndexStyle['spin']} />
                :
                <SceneModel dispatch={dispatch} isFulled={isFulled} />
            }
            <div className={style['float-container']} style={{ left:'20px', top:isFulled ? '60px' : '0', height : isFulled ? 'calc( 100% - 60px)' : '100%' }}>
                {/* 设备状态 */}
                <div className={IndexStyle['card-container']} style={{ height:'16%', backgroundColor:'transparent', overflow:'hidden' }}>
                    <div className={IndexStyle['card-title']} style={{ color:'#fff', fontWeight:'normal' }}>空压站规模</div>
                    <div className={IndexStyle['card-content']} style={{ padding:'1rem 0'}}>
                        {
                            data.infoList && data.infoList.length 
                            ?
                            <div className={IndexStyle['flex-container']} style={{ textAlign:'left', justifyContent:'space-between' }}>
                                {
                                    data.infoList.map((item,index)=>(
                                        <div className={IndexStyle['flex-item']} key={index}>
                                            <div className={IndexStyle['sub-text']} style={{ color:'rgba(255,255,255,0.6)'}}>{ item.title }</div>
                                            <div className={IndexStyle['data']} style={{ color:'#5cb9f8'}}>{ item.value }</div>
                                        </div>
                                    ))
                                }
                            </div>
                            :
                            <Spin className={IndexStyle['spin']} />
                        }
                    </div>
                </div>
                
                {/* 气电比 改为渐变面积图 */}
                <CustomTabs data={data.view ? data.view.ratio : {}} />
                {/* 本周耗电量 */}
                <div className={IndexStyle['card-container']} style={{ height:'21%', backgroundColor:'transparent', overflow:'hidden' }}>
                    <div className={IndexStyle['card-title']} style={{ color:'#fff', fontWeight:'normal' }}><div>近7日耗电量<span className={IndexStyle['sub-text']} style={{ color:'rgba(255, 255, 255, 0.6)'}}>(kwh)</span></div></div>
                    <div className={IndexStyle['card-content']} style={{ padding:'0' }}>
                        {
                            loaded 
                            ?
                            <BarChart data={data.view.ele} />
                            :
                            <Spin className={IndexStyle['spin']} />
                        }
                    </div>
                </div>
                {/* 近7日用气量 */}
                <div className={IndexStyle['card-container']} style={{ height:'21%', backgroundColor:'transparent', overflow:'hidden' }}>
                    <div className={IndexStyle['card-title']} style={{ color:'#fff', fontWeight:'normal' }}><div>近7日用气量<span className={IndexStyle['sub-text']} style={{ color:'rgba(255, 255, 255, 0.6)'}}>(m³)</span></div></div>
                    <div className={IndexStyle['card-content']} style={{ padding:'0' }}>
                        {
                            loaded
                            ?
                            <LineChart data={data.view.gas} title='用气量' />
                            :
                            <Spin className={IndexStyle['spin']} />
                        }
                    </div>
                </div>
                {/* 本月加载次数 */}
                <div className={IndexStyle['card-container']} style={{ height:'21%', backgroundColor:'transparent', overflow:'hidden' }}>
                    <div className={IndexStyle['card-title']} style={{ color:'#fff', fontWeight:'normal' }}><div>近7日告警次数<span className={IndexStyle['sub-text']} style={{ color:'rgba(255, 255, 255, 0.6)'}}>(次)</span></div></div>
                    <div className={IndexStyle['card-content']} style={{ padding:'0' }}>
                        {
                            loaded
                            ?
                            <LineChart data={data.view.reload} title='告警数' />
                            :
                            <Spin className={IndexStyle['spin']} />
                        }
                    </div>
                </div>
            </div>
            <div className={style['float-container']} style={{ right:'20px', top:isFulled ? '60px' : '0', height : isFulled ? 'calc( 100% - 60px)' : '100%' }}>
                {/* 本月累计节省电费 */}
                <div className={IndexStyle['card-container']} style={{ height:'16%', backgroundColor:'transparent', overflow:'visible' }}>
                    <div className={IndexStyle['card-title']} style={{ color:'#fff', fontWeight:'normal' }}>本月累计节省电费</div>
                    <div className={IndexStyle['card-content']}>
                        {
                            loaded 
                            ?
                            <NumberFormat data={data.saveCost  || 0 } containerWidth={user.containerWidth} />
                            :
                            <Spin className={IndexStyle['spin']} />
                        }
                    </div>
                </div>
                {/* 实时监控数据 */}
                <div className={IndexStyle['card-container']} style={{ height:'56%', backgroundColor:'transparent', overflow:'hidden' }}>
                    <div className={IndexStyle['card-title']} style={{ color:'#fff', fontWeight:'normal' }}>实时监控数据</div>
                    <div className={IndexStyle['card-content']}>
                        {
                            loaded 
                            ?
                            <div style={{ height:'100%' }}>
                                <div style={{ height:'50%' }}><GaugeChart name='母管压力' value={data.pressure} unit='bar' /></div>
                                <div style={{ height:'50%' }}><GaugeChart name='瞬时流量' value={data.speed} unit='m³/min' /></div>
                            </div>
                            :
                            <Spin className={IndexStyle['spin']} />
                        }
                    </div>
                </div>
                {/* 告警列表 */}
                <div className={IndexStyle['card-container']} style={{ height:'28%', backgroundColor:'transparent', overflow:'hidden' }}>
                    <div className={IndexStyle['card-title']} style={{ color:'#fff', fontWeight:'normal' }}>告警列表</div>
                    <div className={IndexStyle['card-content']} style={{ padding:'0' }}>
                        {
                            loaded 
                            ?
                            <ScrollTable 
                                thead={[{ title:'位置', dataIndex:'region_name', width:'22%', collapse:true }, { title:'设备', dataIndex:'mach_name', width:'32%', collapse:true }, { title:'分类', dataIndex:'type_name', width:'30%', border:true }, { title:'时间', dataIndex:'last_warning_time', type:'time', width:'16%' }]}
                                data={data.warning || []} 
                                scrollNum={4}
                            />
                            :
                            <Spin className={IndexStyle['spin']} />
                        }
                        
                    </div>
                </div>
            </div>
        </div>
        :
        <Redirect to={`/${routePath[0]}${location.search}`} />
        :
        null
    )
}

export default connect(({ user, home })=>({ user, home }))(IndexPage);