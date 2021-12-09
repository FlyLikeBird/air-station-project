import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Switch, message } from 'antd';
import style from './SysControl.css';
import IndexStyle from '@/pages/IndexPage.css';
import AutoControlItem from './AutoControlItem';
import ActionConfirm from '@/pages/components/ActionConfirm';

function AutoControlManager({ dispatch, user, gasMach }){
    useEffect(()=>{
        dispatch({ type:'gasMach/initAirMachControl'});
    },[]);
    let [info, setInfo] = useState({ visible:false, index:'' });
    let { machTree, currentNode, airMachStatus } = gasMach;
    let [gasData, setGasData] = useState([]);
    let machList = currentNode.child || [];
    useEffect(()=>{
        setGasData(airMachStatus);
    },[airMachStatus])
    return (
        <div className={IndexStyle['card-container']}>
            <ActionConfirm dispatch={dispatch} visible={info.visible} onClose={()=>setInfo({ visible:false, index:''})} onDispatch={()=>{
                // new Promise((resolve, reject)=>{
                //     dispatch({ type:'', payload:{ resolve, reject, mach_id:currentMach.mach_id }})
                // })
                // .then(()=>{
                //     message.success(`${currentMach.switch_status === 0 ? '合闸' : '分断'}成功`);
                // })
                // .catch(msg=>message.info(msg))
                message.success('更改模式成功');
                let temp = gasData.map((item, index)=>{    
                    let obj = { ...item };
                    if (  index === info.index ){
                        obj.is_auto = obj.is_auto === 0 ? 1 : 0;
                    }
                    return obj;
                })
                setGasData(temp);
            }} />
            <div className={style['inline-container']}>
                <div className={style['inline-container-content']}>
                    {
                        machList.map((item, index)=>(
                            <AutoControlItem key={index} index={index} data={item} gasData={gasData[index] || {}} roleId={user.userInfo.role_id} onVisible={info=>setInfo(info)} />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default connect(({ user, gasMach })=>({ user, gasMach }))(AutoControlManager);