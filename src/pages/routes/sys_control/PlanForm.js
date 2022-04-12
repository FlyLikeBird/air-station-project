import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, message, Radio } from 'antd';
import { CloseCircleOutlined, CheckCircleFilled, CloseCircleFilled, MinusCircleOutlined, InfoCircleFilled } from '@ant-design/icons';
import style from '@/pages/IndexPage.css';

const { Option } = Select;

function checkInfoList(data){
    let result = 0;
    for(let i=0;i<data.length;i++){
        if ( !data[i].currentMach ) {
            result = 1;
            break;
        }
        if ( data[i].currentAction && data[i].currentAction.has_value ){
            if ( !Number(data[i].currentAction.value) && Number(data[i].currentAction.value) !== 0 ) {
                result = 2;
                break;
            }
        }
    }
    return result;
}

function PlanForm({ dispatch, planMachs, planDetail, info, onClose }){
    let [infoList, setInfoList] = useState([]);
    let [value, setValue] = useState('');
    useEffect(()=>{
        if ( info.forEdit && planDetail.plan_id ){
            setValue(planDetail.plan_name);
            let temp = planDetail.details.map(item=>{
                let obj = {};
                let action = planMachs.filter(i=>i.mach_id === item.mach_id )[0].action;
                obj.currentMach = { mach_id:item.mach_id, meter_name:item.meter_name, action };
                obj.currentAction = { action:item.action, status:item.status  };
                if ( item.value === null ){

                } else {
                    obj.currentAction.has_value = 1;
                    obj.currentAction.value = item.value;
                }
                
                return obj;
            });
            setInfoList(temp);
        } else {
            setInfoList([{ currentMach:null, currentAction:null }]);
            setValue('');
        }
    },[planDetail]);
    
    let width = info.forEdit ? '28%' : '33.3%';
    let otherWidth = info.forEdit ? '16%' : '0';
    return (
        <div>
            
            {/* 空压机设置 */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', margin:'0.5rem 0'  }}>
                    <div>
                        方案名称:
                        <Input style={{ width:'200px', marginLeft:'4px' }} value={value} onChange={e=>setValue(e.target.value)} />
                    </div>
                    <Button type='primary' onClick={()=>{
                        setInfoList(infoList.concat({ currentMach:null, currentAction:null }));
                    }}>添加对象</Button>
                </div>
                
                <div className={style['info-container']}>
                    <div className={style['info-item']} style={{ width }}>
                        <div className={style['info-label']}>对象</div>
                    </div>
                    <div className={style['info-item']} style={{ width }}>
                        <div className={style['info-label']}>动作</div>
                    </div>
                    <div className={style['info-item']} style={{ width }}>
                        <div className={style['info-label']}>值</div>
                    </div>
                    {
                        info.forEdit 
                        ?
                        <div className={style['info-item']} style={{ width:otherWidth }}>
                            <div className={style['info-label']}>执行结果</div>
                        </div>
                        :
                        null
                    }
                    {
                        infoList.map((item,index)=>{
                            return (
                                <div key={index} style={{ position:'relative' }}>
                                    <div className={style['info-item']} style={{ width }}>
                                        <div className={style['info-content']}>
                                            <Select bordered={false} value={item.currentMach && item.currentMach.mach_id} onChange={value=>{
                                                let currentMach = planMachs.filter(i=>i.mach_id === value)[0];
                                                let temp = infoList.map((item,j)=>{
                                                    if ( index === j ) {
                                                        item.currentMach = currentMach;
                                                        item.currentAction = currentMach.action.length ? currentMach.action[0] : {};
                                                    }
                                                    return item;
                                                });
                                                setInfoList(temp);
                                            }}>
                                                {
                                                    planMachs.map((sub)=>(
                                                        <Option key={sub.mach_id} value={sub.mach_id}>{ sub.meter_name }</Option>
                                                    ))
                                                }
                                            </Select>
                                        </div>
                                    </div>
                                    <div className={style['info-item']} style={{ width }}>
                                        <div className={style['info-content']}>
                                            <Select bordered={false} value={item.currentAction && item.currentAction.action} onChange={value=>{
                                                let currentAction = item.currentMach && item.currentMach.action ? item.currentMach.action.filter(i=>i.action === value)[0] : {};
                                                let temp = infoList.map((item,j)=>{
                                                    if ( index === j){
                                                        item.currentAction = currentAction;
                                                    }
                                                    return item;
                                                });                                         
                                                setInfoList(temp);
                                            }}>
                                                {
                                                    item.currentMach && item.currentMach.action 
                                                    ?
                                                    item.currentMach.action.map((sub)=>(
                                                        <Option key={sub.action} value={sub.action}>{ sub.action_name }</Option>
                                                    ))
                                                    :
                                                    null
                                                }
                                            </Select>
                                        </div>
                                    </div>
                                    <div className={style['info-item']} style={{ width }}>
                                        <div className={style['info-content']}>
                                            <Input disabled={ item.currentAction && item.currentAction.has_value ? false : true } value={item.currentAction && item.currentAction.has_value ? item.currentAction.value : '-- --' } onChange={e=>{
                                                let temp = infoList.map((item,j)=>{
                                                    if ( index === j ){
                                                        item.currentAction.value = e.target.value;
                                                    }
                                                    return item;
                                                });
                                                setInfoList(temp);
                                            }} />
                                        </div>
                                    </div>
                                    {
                                        info.forEdit 
                                        ?
                                        <div className={style['info-item']} style={{ width:otherWidth }}>
                                            <div className={style['info-content']} style={{ paddingLeft:'6px' }}>
                                                {
                                                    item.currentAction && item.currentAction.status === 3 
                                                    ?
                                                    <CheckCircleFilled style={{ color:'#52c41a', fontSize:'1.4rem' }} />
                                                    :
                                                    item.currentAction && item.currentAction.status === 4 
                                                    ?
                                                    <CloseCircleFilled style={{ color:'#ff4d4f', fontSize:'1.4rem' }} />
                                                    :
                                                    <InfoCircleFilled style={{ color:'#ccc', fontSize:'1.4rem' }} />
                                                }
                                                
                                            </div>
                                        </div>
                                        :
                                        null
                                    }
                                    {/* 删除一行数据 */}
                                    <div style={{ position:'absolute', right:'-20px', top:'10px' }}>
                                        <MinusCircleOutlined onClick={()=>{
                                            let temp = infoList.filter((item,j)=>j !== index);
                                            setInfoList(temp);
                                        }} />
                                    </div>
                                </div>
                            )
                        })          
                    }      
                </div>
                <div style={{ position:'absolute', left:'50%', bottom:'2rem', transform:'translateX(-50%)' }}>
                    <div className={style['btn'] + ' ' + style['opacity']} onClick={()=>{
                        setInfoList([{ currentMach:null, currentAction:null }]);
                        setValue('');
                        onClose();
                    }}>取消</div>
                    <div className={style['btn']} onClick={()=>{
                        if ( infoList.length ){
                            if ( !value ){
                                message.info('方案名不能为空');
                                return;
                            }
                            let result = checkInfoList(infoList);
                            if ( !result ){
                                // 通过数据验证
                                let values = { plan_name:value };
                                if ( info.forEdit ){
                                    values.plan_id = planDetail.plan_id;
                                }
                                values.details = infoList.map(item=>{
                                    let obj = {};
                                    obj.mach_id = item.currentMach.mach_id;
                                    obj.meter_name = item.currentMach.meter_name;
                                    obj.action = item.currentAction.action;
                                    if ( item.currentAction.has_value ){
                                        obj.value = item.currentAction.value;
                                    }
                                    return obj; 
                                });
                                new Promise((resolve, reject)=>{
                                    dispatch({ type: 'gasMach/addPlanAsync', payload:{ resolve, reject, values, forEdit:info.forEdit }})
                                })
                                .then(()=>{
                                    message.success( `${ info.forEdit ? '修改' : '添加'}方案成功`);
                                    onClose();
                                })
                                .catch(msg=>message.error(msg));
                            } else if ( result === 1) {
                                message.info('要设置的对象不能为空');
                            } else if ( result === 2 ){
                                message.info('值必须是数值类型');
                            }
                        } else {
                            message.info('对象列表不能为空');
                        }
                        
                    }}>保存</div>
                </div>
        </div>
    )
}

function areEqual(prevProps, nextProps){
    if ( prevProps.planDetail !== nextProps.planDetail || prevProps.info !== nextProps.info ){
        return false;
    } else {
        return true;
    }
}
export default React.memo(PlanForm, areEqual);