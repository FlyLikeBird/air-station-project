import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Tooltip } from 'antd';
import { PayCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import CustomDatePicker from '@/pages/components/CustomDatePicker';
import style from '@/pages/IndexPage.css';
import MultiBarChart from './MultiBarChart';
import Loading from '@/pages/components/Loading';

function SaveCostManager({ dispatch, cost }){
    let { saveCost, chartLoading } = cost;
    useEffect(()=>{
        dispatch({ type:'cost/initSaveCost'});
        return ()=>{
            dispatch({ type:'cost/reset'});
        }
    },[])
    return (
        <div style={{ position:'relative' }}>
            {
                chartLoading 
                ?
                <Loading />
                :
                null
            }
            <div style={{ height:'50px', display:'flex', alignItems:'center' }}>
                <CustomDatePicker onDispatch={()=>{
                    dispatch({ type:'cost/fetchSaveCost' });
                }} />
            </div>
            <div className={style['card-container']} style={{ height:'calc( 100% - 50px)', padding:'1rem' }}>
                <div style={{ display:'flex', alignItems:'center', height:'100px'}}>
                    {
                        saveCost.infoList && saveCost.infoList.length 
                        ?
                        saveCost.infoList.map((item,i)=>(
                            item.child 
                            ?
                            <div key={i} style={{
                                flex:item.flex,
                                display:'flex', 
                                alignItems:'center',
                                justifyContent:'space-around',
                                background: item.child ? 'rgba(255, 255, 255, 0.1)' : 'none', 
                                borderRadius:'6px', 
                                color:'#fff',
                                position:'relative',
                                overflow:'hidden',
                                padding:'1rem 2rem'
                            }}>
                                {
                                    item.hasTag 
                                    ?
                                    <div style={{ 
                                        position:'absolute', 
                                        right:'-48px', 
                                        bottom:'0px',
                                        backgroundColor:item.color,
                                        width:'120px',
                                        height:'40px',
                                        transform:'rotate(-45deg)',
                                        textAlign:'center',
                                        lineHeight:'46px'
                                    }}>
                                        <span style={{ position:'absolute', left:'42px', top:'-6px' }}>{ item.tagName }</span>
                                    </div>
                                    :
                                    null
                                }
                                
                                {
                                    item.child && item.child.length
                                    ?
                                    item.child.map((sub,j)=>(
                                        <>
                                            <div key={`${i}-${j}`}>
                                                <div>
                                                    { sub.title }
                                                    {
                                                        sub.hasTooltip
                                                        ?
                                                        <Tooltip overlayStyle={{ maxWidth:'unset' }} title={<div style={{ whiteSpace:'nowrap' }}>{ sub.tooltipContent }</div>}><QuestionCircleOutlined style={{ marginTop:'4px', marginLeft:'4px' }} /></Tooltip>
                                                        :
                                                        null
                                                    }
                                                </div>
                                                <div>
                                                    <span className={style['data'] + ' ' + ( item.tagName === '节能' ? style['spec'] : '' )} style={{ color:item.tagName === '节能' ? '#5fd942' : '#fff' }} >{ sub.value }</span>
                                                    <span className={style['sub-text']} style={{ color:'rgba(255, 255, 255, 0.6)', marginLeft:'6px' }}>{ sub.unit }</span>
                                                </div>
                                            </div>
                                            { j === 0 && item.child.length === 2 ? <div style={{ fontSize:'1.6rem' }}>×</div> : null }
                                        </>
                                    ))
                                    :
                                    null
                                }
                            </div>
                            :
                            <div key={i} style={{ margin:item.hasBg ? '0 1rem' : '0', width:'16px', height:'16px', textAlign:'center', fontWeight:'bold', lineHeight:'16px', borderRadius:'50%', transform:'scale(1.4)', background:item.hasBg ? 'rgba(255, 255, 255, 0.55)' : 'none', color:item.hasBg ? '#191932': '#fff' }}>{ item.value }</div>
                        ))
                        :
                        null
                    }
                </div>
                {/* 图表区 */}
                <div style={{ height:'calc( 100% - 100px)' }}>
                    {
                        Object.keys(saveCost).length 
                        ?
                        <MultiBarChart data={saveCost.view} theme='dark' />
                        :
                        null
                    }
                </div>
            </div>
        </div>
        
    )
}

export default connect(({ cost })=>({ cost }))(SaveCostManager);