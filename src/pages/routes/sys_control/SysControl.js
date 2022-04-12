import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Tree, Spin, Menu, message } from 'antd';
import style from '@/pages/IndexPage.css';
import ColumnCollapse from '@/pages/components/ColumnCollapse';
import AutoControlManager from './AutoControlManager';
import PlanManager from './PlanManager';

let subMenuMaps = {
    'gas_mach_oper':AutoControlManager,
    'gas_control_plan':PlanManager
};

function SysControl({ dispatch, user, gasMach }){
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
        </div>
        
    );
    let Component = subMenuMaps[subMenu.menu_code] || (()=>null);
    let content = <Component menu={subMenu} />;
    return (
        <ColumnCollapse sidebar={sidebar} content={content} />
    )
   
}

export default connect(({ user, gasMach })=>({ user, gasMach }))(SysControl);