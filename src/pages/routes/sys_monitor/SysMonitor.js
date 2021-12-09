import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Tree, Spin, Menu, message } from 'antd';
import style from '@/pages/IndexPage.css';
import ColumnCollapse from '@/pages/components/ColumnCollapse';
import GasMonitor from './gas_monitor';
import EleMonitor from './ele_monitor';
import DeviceMonitor from './device_monitor';
import FlowMonitor from './flow_monitor';

let subMenuMaps = {
    'gas_eff':GasMonitor,
    'gas_ele':EleMonitor,
    'gas_flow':FlowMonitor,
    'gas_mach_list':DeviceMonitor
};

function SmartManager({ dispatch, user, gasMach, device }){
    let { currentMenu, userMenu } = user;
    let { machTree, treeLoading, currentNode, currentMach } = gasMach;
    let { deviceTypes, currentType } = device;
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
                subMenu.menu_code === 'gas_eff' 
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
                                        dispatch({ type:'gasMonitor/fetchGasInfo', payload:{ type:'gas' }});
                                        dispatch({ type:'gasMonitor/fetchGasChart'});
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
                                selectedKeys={[currentMach.key ]}
                                treeData={machTree}
                                onSelect={(selectedKeys, {node})=>{  
                                    dispatch({ type:'gasMach/toggleMach', payload:{ device_id:node.key, key:node.key, title:node.title }});
                                    dispatch({ type:'gasMonitor/fetchEleInfo', payload:{ type:'ele' }});
                                    dispatch({ type:'gasMonitor/fetchEleChart'});                 
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
                            deviceTypes && deviceTypes.length 
                            ?
                            deviceTypes.map((item,index)=>(
                                <div className={item.device_type === currentType.device_type  ? style['list-item'] + ' ' + style['selected'] : style['list-item']} key={index} onClick={()=>{
                                    if ( currentType.device_type !== item.device_type ){
                                        dispatch({ type:'device/toggleDeviceType', payload:item });
                                        dispatch({ type:'device/fetchInfoList' });                                    
                                    }                               
                                }}>
                                    <div>{ item.type_name }</div>
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