import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Tree, Spin, Menu, message } from 'antd';
import style from '@/pages/IndexPage.css';
import ColumnCollapse from '@/pages/components/ColumnCollapse';
import DeviceArchives from './DeviceArchives';
import DeviceStatus from './DeviceStatus';
import DeviceModel from './DeviceModel';
import DeviceMachList from '../sys_monitor/device_monitor';

let subMenuMaps = {
    'gas_mach_archives':DeviceArchives,
    'gas_mach_status':DeviceStatus,
    'gas_mach_model':DeviceModel,
    'gas_mach_list':DeviceMachList
};

function DeviceManager({ dispatch, user, gasMach }){
    let { currentMenu, userMenu } = user;
    let { machTree, treeLoading, currentNode } = gasMach;
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
                subMenu.menu_code === 'gas_mach_status'
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
                                    dispatch({ type:'deviceModel/fetchDeviceDetail'});                                              
                                }}
                            />
                        }
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

export default connect(({ user, gasMach })=>({ user, gasMach }))(DeviceManager);