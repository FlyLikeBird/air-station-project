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
                <div style={{ display:'flex', height:'100px'}}>
                    {
                        saveCost.infoList && saveCost.infoList.length 
                        ?
                        saveCost.infoList.map((item,i)=>(
                            <div key={i} style={{
                                flex:i === 2 ? '2' : '1', 
                                display:'flex', 
                                alignItems:'center',
                                justifyContent:'space-around',
                                background:'#2e2e44', 
                                marginRight:'1rem', 
                                borderRadius:'6px', 
                                color:'#fff',
                                width:'340px',
                                position:'relative',
                                overflow:'hidden'
                            }}>
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
                                    <span style={{ position:'absolute', left:'42px', top:'-6px' }}>{ i === 0 ? '基准' : i === 1 ? '智控' : '节能' }</span>
                                </div>
                                {
                                    item.child && item.child.length
                                    ?
                                    item.child.map((sub,j)=>(
                                        <div key={`${i}-${j}`} >
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
                                                <span className={style['data']} style={ i === 2 && j === 2 ? { color:item.color } : {}}>{ sub.value }</span>
                                                <span className={style['sub-text']} style={{ color:'rgba(255, 255, 255, 0.6)', marginLeft:'6px' }}>{ sub.unit }</span>
                                            </div>
                                        </div>
                                    ))
                                    :
                                    null
                                }
                            </div>
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