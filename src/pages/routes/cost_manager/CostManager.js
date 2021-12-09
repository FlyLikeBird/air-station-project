import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Radio, Tree, Spin, Menu, Skeleton, message } from 'antd';
import style from '@/pages/IndexPage.css';
import ColumnCollapse from '@/pages/components/ColumnCollapse';
import CustomDatePicker from '@/pages/components/CustomDatePicker';
import InfoItem from './InfoItem';
import StackBarChart from './StackBarChart';
import Loading from '@/pages/components/Loading';

function CostManager({ dispatch, user, cost, gasMach }){
    useEffect(()=>{
        if ( user.authorized ){
            dispatch({ type:'cost/init'});
        }
    },[user.authorized])
    let { machTree, treeLoading, currentNode } = gasMach;
    let { dataType, sumInfo, chartLoading, chartInfo } = cost;
    let sidebar = (
        <div>
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
                                dispatch({ type:'cost/fetchCostInfo'});
                                dispatch({ type:'cost/fetchCostChart' });                                              
                            }}
                        />
                    }
                </div>
            </div>      
        </div>
        
    );
    let content = (
        <div style={{ position:'relative' }}>
            {
                chartLoading 
                ?
                <Loading />
                :
                null
            }
            <div style={{ height:'40px', display:'flex', alignItems:'center' }}>
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
            <div style={{ height:'calc( 100% - 40px)'}}>
                <div style={{ height:'16%', paddingBottom:'1rem' }}>
                    {
                        sumInfo.costInfo && sumInfo.costInfo.length 
                        ?
                        sumInfo.costInfo.map((item,index)=>(
                            <div key={index} className={style['card-container-wrapper']} style={{ width:'33.3%', paddingBottom:'0', paddingRight:index === sumInfo.costInfo.length - 1 ? '0' : '1rem'}}>
                                <div className={style['card-container']}>
                                    <InfoItem data={item} dataType={dataType} />
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
                        <StackBarChart data={chartInfo} timeType={user.timeType} dataType={dataType} theme='dark' />
                        :
                        <Skeleton active className={style['skeleton']} />
                    }
                </div>
            </div>
        </div>
    )
    return (
        <ColumnCollapse sidebar={sidebar} content={content} />
    )
   
}

export default connect(({ user, cost, gasMach })=>({ user, cost, gasMach }))(CostManager);