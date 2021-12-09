import React, { useEffect, useState } from 'react';
import { Switch, message } from 'antd';
import style from './SysControl.css';

function AutoControlItem({ data, gasData, index, roleId, onVisible }){
    let [autoMode, setAutoMode] = useState(false);
    useEffect(()=>{
        setAutoMode(gasData.is_auto ? true : false);
    },[gasData])
    
    return (
        <div className={style['inline-item-wrapper']}>
            <div className={style['inline-item']}>
                <div className={style['inline-item-label']}>{ data.device_name }</div>
                <div className={style['inline-item-switch']}>
                    <Switch className={style['custom-switch']} checkedChildren="自动" unCheckedChildren="手动" checked={autoMode} onChange={(checked)=>{
                        if ( roleId === 1 || roleId === 2 ){
                            // 管理者权限
                            message.info('该操作会影响产气效率和生产用气安全，请谨慎操作');
                            onVisible({ visible:true, index });
                        } else {
                            // 使用者无权操作
                            message.info('该操作会影响产气效率和生产用气安全，你无权操作，请联系系统管理员');
                        }
                }}/></div>
            </div>
        </div>
    )
}

function areEqual(prevProps, nextProps){
    if ( prevProps.data !== nextProps.data || prevProps.gasData !== nextProps.gasData ) {
        return false;
    } else {
        return true;
    }
}

export default React.memo(AutoControlItem, areEqual);