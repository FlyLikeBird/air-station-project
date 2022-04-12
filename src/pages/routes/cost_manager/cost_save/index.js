import React from 'react';
import { connect } from 'dva';
import { Tooltip } from 'antd';

import { PayCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import CustomDatePicker from '@/pages/components/CustomDatePicker';
import style from '@/pages/IndexPage.css';
import MultiBarChart from './MultiBarChart';

let infoList = [
    { color:'#af2bff', child:[{ title:'采集气电比', value:0.75, unit:'kwh/m³'}, { title:'采集电价', value:0.53, unit:'元/kwh' }]},
    { color:'#04a3fe', child:[{ title:'当月气电比', value:0.90, unit:'kwh/m³'}, { title:'当月用气量', value:450000, unit:'m³' }]},
    { color:'#5fd942', child:[{ title:'基准成本', value:150000, unit:'元'}, { title:'智控后成本', value:250000 , unit:'元'}, { title:'节省成本', value:100000, unit:'元'}]}
];
function CostSaveManager(){
    return (
        <div style={{ position:'relative' }}>
            <div style={{ height:'50px', display:'flex', alignItems:'center' }}>
                <CustomDatePicker onDispatch={()=>{
                    dispatch({ type:'cost/fetchCostChart' });
                }} />
            </div>
            <div className={style['card-container']} style={{ height:'calc( 100% - 50px)', padding:'1rem' }}>
                <div style={{ display:'flex', height:'100px'}}>
                    {
                        infoList.map((item,i)=>(
                            <div key={i} style={{
                                flex:i > 1 ? '2' : '1', 
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
                                                    i === 2 && j === 0
                                                    ?
                                                    <Tooltip overlayStyle={{ maxWidth:'unset' }} title={<div style={{ whiteSpace:'nowrap' }}>节省成本 = [未启用智控前气电比(kwh/m³) - 启用智控后气电比(kwh/m³)] X 用气量(m³) X 平均单价(元/kwh)</div>}><QuestionCircleOutlined style={{ marginTop:'4px', marginLeft:'4px' }} /></Tooltip>
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
                    }
                </div>
                {/* 图表区 */}
                <div style={{ height:'calc( 100% - 100px)' }}>
                    <MultiBarChart theme='dark' />
                </div>
            </div>
        </div>
        
    )
}

export default CostSaveManager;