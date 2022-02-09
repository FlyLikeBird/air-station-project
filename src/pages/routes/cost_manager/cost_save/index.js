import React from 'react';
import { connect } from 'dva';
import { Tooltip } from 'antd';

import { PayCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import CustomDatePicker from '@/pages/components/CustomDatePicker';
import style from '@/pages/IndexPage.css';

let infoList = [
    { color:'#af2bff', child:[{ title:'非智控用气量', value:124353, unit:'m³'}, { title:'非智控单价', value:0.53, unit:'元/m³' }, { title:'非智控成本', value:62176, unit:'元' }]},
    { color:'#04a3fe', child:[{ title:'智控用气量', value:124353, unit:'m³'}, { title:'智控单价', value:0.53, unit:'元/m³' }, { title:'智控成本', value:62176, unit:'元' }]},
    { color:'#7ef063', child:[{ title:'节俭成本', value:68292, unit:'元'}]}
]
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
                                display:'flex', 
                                alignItems:'center',
                                justifyContent:i === 0 || i === 1 ? 'space-around' : 'flex-start',
                                background:'#2e2e44', 
                                marginRight:'1rem', 
                                borderRadius:'6px', 
                                color:'#fff',
                                width:'340px',
                                position:'relative',
                                overflow:'hidden'
                            }}>
                                {
                                    i === 0 || i === 1 
                                    ?
                                    <div style={{ width:'20px', height:'50px', backgroundColor:item.color, position:'absolute', left:'-10px', borderRadius:'10px' }}></div>
                                    :
                                    i === 2 
                                    ?
                                    <div style={{ margin:'0 1rem', width:'46px', height:'46px', lineHeight:'46px', textAlign:'center', backgroundImage:'linear-gradient(to bottom, #84f669, #5fd842)', borderRadius:'16px' }}><PayCircleOutlined style={{ fontSize:'1.6rem', lineHeight:'1.6rem', verticalAlign:'middle' }} /></div>
                                    :
                                    null
                                }
                                {
                                    item.child && item.child.length
                                    ?
                                    item.child.map((sub,j)=>(
                                        <div key={`${i}-${j}`} >
                                            <div>
                                                { sub.title }
                                                {
                                                    i === 2 
                                                    ?
                                                    <Tooltip title={<div style={{ whiteSpace:'nowrap' }}>节俭成本 = [未启用智控成本(元/m³) - 当前成本(元/m³)] X 用气量(m³)</div>}><QuestionCircleOutlined style={{ marginTop:'4px', marginLeft:'4px' }} /></Tooltip>
                                                    :
                                                    null
                                                }
                                            </div>
                                            <div>
                                                <span className={style['data'] + ' ' + ( i === 2 ? style['spec'] : '')} >{ sub.value }</span>
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
            </div>
        </div>
        
    )
}

export default CostSaveManager;