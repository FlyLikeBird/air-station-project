import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Tree, Spin, Menu, message } from 'antd';
import style from '@/pages/IndexPage.css';
import ColumnCollapse from '@/pages/components/ColumnCollapse';
import CostReport from './CostReport';
import Loading from '@/pages/components/Loading';


let typeMaps = {
    'cost_table':'cost',
    'ele_table':'ele',
    'gas_table_air':'gas',
    'running_table':'running',
    'basic_ratio_table':'basic',
    'save_cost_table':'save'
};

function DataReport({ dispatch, user, gasMach, dataReport }){
    let { currentMenu, userMenu, containerWidth } = user;
    let { machTree, treeLoading, currentNode } = gasMach;
    let { isLoading, list, columns, layout, currentPage, total } = dataReport;
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
                subMenu['menu_code'] === 'basic_ratio_table' || subMenu['menu_code'] === 'save_cost_table'
                ?
                null
                :
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
                                selectedKeys={[currentNode.key ]}
                                treeData={machTree}
                                onSelect={(selectedKeys, {node})=>{  
                                    dispatch({ type:'gasMach/toggleNode', payload:node });
                                    dispatch({ type:'dataReport/fetchCostReport', payload:{ type:typeMaps[subMenu.menu_code] } });

                                }}
                            />
                        }
                    </div>
                </div>  
            }  
        </div>      
    );
   
    let content = user.authorized 
                ? 
                <div style={{ position:'relative' }}>
                    {
                        isLoading 
                        ?
                        <Loading />
                        :
                        null
                    }
                    <CostReport 
                        type={typeMaps[subMenu.menu_code] || 'cost' } 
                        data={list}
                        columns={columns}
                        currentPage={currentPage}
                        layout={layout}
                        total={total}
                        dispatch={dispatch}
                        timeType={user.timeType}
                        startDate={user.startDate}
                        endDate={user.endDate}
                        theme={user.theme}
                        containerWidth={containerWidth}
                    /> 
                </div>
                : null
    return (
        <ColumnCollapse sidebar={sidebar} content={content} />
    )
}

export default connect(({ user, gasMach, dataReport })=>({ user, gasMach, dataReport }))(DataReport);