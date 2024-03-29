import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Tree, Spin, Menu, message } from 'antd';
import style from '@/pages/IndexPage.css';
import ColumnCollapse from '@/pages/components/ColumnCollapse';
import GasTrend from './gas_trend';
import GasMonitor from './gas_monitor';
import PressureMonitor from './pressure_monitor';
import EleMonitor from './ele_monitor';
import DeviceMonitor from './device_monitor';
import FlowMonitor from './flow_monitor';

let subMenuMaps = {
    'gas_trend':GasTrend,
    'gas_eff':GasMonitor,
    'gas_pressure':PressureMonitor,
    'gas_ele':EleMonitor,
    'gas_flow':FlowMonitor,
    'gas_mach_list':DeviceMonitor
};

function SmartManager({ dispatch, user, gasMach, device }){
    let { currentMenu, userMenu } = user;
    let { machTree, treeLoading, currentNode } = gasMach;
    let { stationList, currentStation } = device;
    const [subMenu, toggleSubMenu] = useState('');
    useEffect(()=>{
        if ( currentMenu.child && currentMenu.child.length ){
            toggleSubMenu(currentMenu.child[0]);
        }
    },[currentMenu]);
    let sidebar = (
        <div>
            <div className={style['card-container'] + ' ' + style['topRadius'] + ' ' + style['float-menu-container']} style={{ padding:'0', height:'auto', paddingBottom:'10px', boxShadow:'none' }}>
                <div className={style['card-title']}>导航功能</div>
                <div className={style['card-content']} style={{ padding:'0' }}>
                    <Menu mode='inline' selectedKeys={[subMenu.menu_code]} onClick={e=>{
                        let temp = currentMenu.child.filter(i=>i.menu_code === e.key)[0];
                        toggleSubMenu(temp);
                    }}>
                        {
                            currentMenu.child && currentMenu.child.length 
                            ?
                            currentMenu.child.map((item,index)=>(
                                <Menu.Item key={item.menu_code}>{ item.menu_name }</Menu.Item>
                            ))
                            :
                            null
                        }
                    </Menu>
                </div>
            </div>
            {
                subMenu.menu_code === 'gas_eff' || subMenu.menu_code === 'gas_trend'
                ?
                <div className={style['card-container'] + ' ' + style['bottomRadius']} style={{ padding:'0', height:'auto', boxShadow:'none' }}>
                    <div className={style['card-title']}>统计对象</div>
                    <div className={style['card-content']}>
                        <div className={style['list-container']}>
                        {
                            treeLoading
                            ?
                            <Spin className={style['spin']} />
                            :
                            machTree && machTree.length 
                            ?
                            machTree.map((item,index)=>(
                                <div className={item.device_id === currentNode.device_id ? style['list-item'] + ' ' + style['selected'] : style['list-item']} key={index} onClick={()=>{
                                    if ( currentNode.device_id !== item.device_id ){
                                        dispatch({ type:'gasMach/toggleNode', payload:item });
                                        if ( subMenu.menu_code === 'gas_eff') {
                                            dispatch({ type:'gasMonitor/fetchGasInfo', payload:{ type:'gas' }});
                                            dispatch({ type:'gasMonitor/fetchGasChart'});
                                            dispatch({ type:'gasMonitor/fetchTypeRule'});
                                        }
                                        if( subMenu.menu_code === 'gas_trend') {
                                            dispatch({ type:'gasMonitor/fetchGasChart'});
                                        }
                                    }                               
                                }}>
                                    { item.device_name }
                                </div>
                            ))
                            :
                            <div>没有配置空压站信息</div>
                        }
                        </div>
                    </div>
                </div>
                :
                null
            }
            {
                subMenu.menu_code === 'gas_ele' 
                ?
                <div className={style['card-container'] + ' ' + style['bottomRadius']} style={{ padding:'0', height:'auto', boxShadow:'none' }}>
                    <div className={style['card-title']}>统计对象</div>
                    <div className={style['card-content']}>
                        {
                            treeLoading
                            ?
                            <Spin className={style['spin']} />
                            :
                            <Tree
                                className={style['custom-tree']}
                                defaultExpandAll={true}                        
                                selectedKeys={[currentNode.device_id]}
                                treeData={machTree}
                                onSelect={(selectedKeys, {node})=>{  
                                    dispatch({ type:'gasMach/toggleNode', payload:node });
                                    dispatch({ type:'gasMonitor/fetchEleInfo', payload:{ type:'ele' }});
                                    dispatch({ type:'gasMonitor/fetchEleChart'});  
                                    dispatch({ type:'gasMonitor/fetchTypeRule'});                                              
                                }}
                            />
                        }
                    </div>
                </div>
                :
                null
            }
            {
                subMenu.menu_code === 'gas_pressure'
                ?
                <div className={style['card-container'] + ' ' + style['bottomRadius']} style={{ padding:'0', height:'auto', boxShadow:'none' }}>
                    <div className={style['card-title']}>统计对象</div>
                    <div className={style['card-content']}>
                        {
                            treeLoading
                            ?
                            <Spin className={style['spin']} />
                            :
                            <Tree
                                className={style['custom-tree']}
                                defaultExpandAll={true}                        
                                selectedKeys={[currentNode.key]}
                                treeData={machTree}
                                onSelect={(selectedKeys, {node})=>{  
                                    dispatch({ type:'gasMach/toggleNode', payload:node });                                
                                    dispatch({ type:'gasMonitor/fetchPressureDiff'});                                                                                
                                }}
                            />
                        }
                    </div>
                </div>
                :
                null
            }
            {
                subMenu.menu_code === 'gas_mach_list' 
                ?
                <div className={style['card-container'] + ' ' + style['bottomRadius']} style={{ padding:'0', height:'auto', boxShadow:'none' }}>
                    <div className={style['card-title']}>设备种类</div>
                    <div className={style['card-content']}>
                        <div className={style['list-container']}>
                        {
                            stationList && stationList.length 
                            ?
                            stationList.map((item,index)=>(
                                <div className={item.device_id === currentStation.device_id  ? style['list-item'] + ' ' + style['selected'] : style['list-item']} key={index} onClick={()=>{
                                    if ( currentStation.device_id !== item.device_id ){
                                        dispatch({ type:'device/toggleStation', payload:item });
                                        dispatch({ type:'device/fetchInfoList' });                                    
                                    }                               
                                }}>
                                    <div>{ item.device_name }</div>
                                    <div>{ item.count }</div>
                                </div>
                            ))
                            :
                            <div>没有配置设备档案</div>
                        }
                        </div>
                    </div>
                </div>
                :
                null
            }
        </div>
        
    );
    let Component = subMenuMaps[subMenu.menu_code] || (()=>null);
    let content = <Component menu={subMenu} />;
    return (
        <ColumnCollapse sidebar={sidebar} content={content} />
    )
   
}

export default connect(({ user, gasMach, device })=>({ user, gasMach, device }))(SmartManager);