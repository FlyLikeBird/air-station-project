import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Table, Drawer, Tag, message, Popconfirm  } from 'antd';
import { FileAddOutlined, MoreOutlined } from '@ant-design/icons';
import Loading from '@/pages/components/Loading';
import CustomPainter from './CustomPainter';
import style from './SysControl.css';
import IndexStyle from '@/pages/IndexPage.css';

let chartList = [];
chartList.push({ title:'空压站A', status:1, time:'2022-06-16 16:00'});
chartList.push({ title:'空压站B', status:1, time:'2022-06-16 16:00'});

function FlowChartManager({ dispatch, user, gasMach }){
    useEffect(()=>{
        dispatch({ type:'gasMach/fetchPlanList'});
        dispatch({ type:'gasMach/fetchPlanMachs'});
    },[])
    let [info, setInfo] = useState({ visible:false, forEdit:false });
    let { isLoading, currentPage, total, planList, planMachs, planDetail } = gasMach;
    
    return (
        <div style={{ height:'100%' }}>
            {
                isLoading
                ?
                <Loading />
                :
                null
            }
            {
                chartList.concat({ add:true }).map((item, index)=>(
                    <div key={index} className={style['flex-item-wrapper']}>
                        {
                            item.add 
                            ?
                            <div className={style['flex-item']} style={{ position:'relative'}}>
                                <div style={{ fontSize:'1.4rem', position:'absolute', left:'50%', top:'50%', transform:'translate(-50%, -50%)', color:'#fff'}} onClick={()=>setInfo({ visible:true })}>添加流向图</div>
                            </div>
                            :
                            <div className={style['flex-item']}>
                                <div className={style['flex-item-content']}></div>
                                <div className={style['flex-item-footer']}>
                                    <div>
                                        <div>
                                            <span style={{ color:'#fff' }}>{ item.title }</span>
                                            <span className={style['tag']}>启用中</span>
                                        </div>
                                        <div className={style['unit']}>{ item.time }</div>
                                    </div>
                                    <MoreOutlined style={{ fontSize:'1.2rem', color:'#fff' }} />
                                </div>
                            </div>
                        }
                        
                    </div>
                ))
            }
            <Drawer 
                visible={info.visible}
                width='100%'
                className={IndexStyle['custom-drawer']}
                placement="right" 
                bodyStyle={{ padding:'24px 40px' }}
                onClose={()=>setInfo({ visible:false, forEdit:false })} 
            >
                <CustomPainter />
            </Drawer> 
        </div>
    )
}

export default connect(({ user, gasMach })=>({ user, gasMach }))(FlowChartManager);

