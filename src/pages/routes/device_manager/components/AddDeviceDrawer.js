import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, DatePicker, Select, Button, Divider, Upload, message  } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import style from './AddDeviceDrawer.css';
import zhCN from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
let { Option, OptGroup } = Select;


let deviceTypes = [
    { title:'空压站', key:1},
    { title:'空压机', key:2},
    { title:'变压站', key:3},
    { title:'变压器', key:4},
    { title:'其他', key:0 }
];

function getTreeSubs(deviceList, node, result){
    result.push({ device_id:node.device_id, device_name:node.device_name });
    if ( node.subs && node.subs.length ){
        node.subs.forEach(item=>{
            getTreeSubs(deviceList, deviceList.filter(i=>i.device_id === item)[0], result);
        })
    }
}
function AddDeviceDrawer({ dispatch, info, deviceList, meterList, modelList, onClose }){
    let [form] = Form.useForm();
    let [value, setValue] = useState('');
    let [meterData, setMeterData] = useState(meterList);
    let subs = [];
    useEffect(()=>{
        if ( info.forEdit ){
            let { bind, tags, parent_id, model_id, buy_date, make_date, maintain_date, next_maintain_date } = info.machInfo;
            form.setFieldsValue({ 
                ...info.machInfo, 
                mach_ids:bind, 
                tags:tags && tags.length ? JSON.parse(tags) : null, 
                parent_id:parent_id || null,
                model_id:model_id ? model_id : null,
                buy_time: buy_date ? moment(buy_date) : null, 
                make_time: make_date ? moment(make_date) : null,
                maintain_date:maintain_date ? moment(maintain_date) : null, 
                next_maintain_date:next_maintain_date ? moment(next_maintain_date) : null
            });
            getTreeSubs(deviceList, info.machInfo, subs);
            subs = subs.map(i=>i.device_id);
        } else {
            form.resetFields();
        }
    },[info])
    return (
        <div>
            <Form
                form={form}
                className={style['form-container']}
                layout='inline'
            >

                <Form.Item label="设备名称" name="device_name" rules={[{ required:true, message:'设备名称不能为空'}]}>
                    <Input />
                </Form.Item>
                <Form.Item label="设备类型" name="device_type" rules={[{ required:true, message:'设备类型不能为空'}]}>
                    <Select>
                        {
                            deviceTypes.map((item,index)=>(
                                <Option value={item.key} key={item.key}>{ item.title }</Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                
                <Form.Item label="设备型号" name='device_model' rules={[{ required:true, message:'设备型号不能为空'}]}>
                    <Input />
                </Form.Item>
                <Form.Item label="资产编号" name="device_no" rules={[{ required:true, message:'资产编号不能为空'}]}>
                    <Input />
                </Form.Item>

                <Form.Item label="产品序列码" name="sequence_code" >
                    <Input />
                </Form.Item>
                <Form.Item label='出厂编号' name="factory_code">
                    <Input />
                </Form.Item>

                <Form.Item label="购买日期" name="buy_time" rules={[{ required:true, message:'购买日期不能为空'}]}>
                    <DatePicker locale={zhCN}/>
                </Form.Item>
                <Form.Item label="生产日期" name="make_time" rules={[{ required:true, message:'生产日期不能为空'}]}>
                    <DatePicker locale={zhCN}/>
                </Form.Item>
                
                <Form.Item label="保修期限(月)" name="guarantee" rules={[{ required:true, message:'保修期限不能为空'}]}>
                    <InputNumber min={0} />
                </Form.Item>
                <Form.Item label="购买金额(元)" name="buy_amount" rules={[{ required:true, message:'购买金额不能为空'}]} >
                    <Input />
                </Form.Item>
                
                <Form.Item label="最新保养时间" name="maintain_date" rules={[{ required:true, message:'不能为空'}]}>
                    <DatePicker locale={zhCN}/>
                </Form.Item>
                <Form.Item label="预计下次保养时间" name="next_maintain_date" rules={[{ required:true, message:'不能为空'}]}>
                    <DatePicker locale={zhCN}/>
                </Form.Item>
                
                <Form.Item label="使用部门" name="department">
                    <Input />
                </Form.Item>
                <Form.Item label="厂商联系方式" name="factory_link">
                    <Input />
                </Form.Item>
                
                <Form.Item label="安装位置" name="install_position">
                    <Input />
                </Form.Item>
                <Form.Item label="折旧年限" name="depreciation">
                    <InputNumber min={0} />
                </Form.Item>
                
                <Form.Item label="空滤使用时间(小时)" name="air_filter_hour">
                    <InputNumber min={0} />
                </Form.Item>
                <Form.Item label="油滤使用时间(小时)" name="oil_filter_hour">
                    <InputNumber min={0} />
                </Form.Item>
                
                <Form.Item label="油气分离器使用时间(小时)" name="oil_gas_separate_hour">
                    <InputNumber min={0} />
                </Form.Item>
                <Form.Item label="润滑脂使用时间(小时)" name="grease_hour">
                    <InputNumber min={0} />
                </Form.Item>

                <Form.Item name='mach_ids' label='绑定采集器' style={{ width:'100%' }}>
                    <Select mode="multiple" allowClear={true} maxTagCount={2} dropdownRender={menu=>(
                        <div>
                            { menu }
                            <Divider style={{ margin: '4px 0' }} />
                            <div style={{ display: 'flex', alignItems:'center', padding:'6px 10px' }}>
                                <Input style={{ flex: 'auto', marginRight:'6px' }} value={value} onChange={e=>setValue(e.target.value)} placeholder='输入要查询的采集器名称' />
                                <Button size='small' type='primary' onClick={()=>{
                                    let temp = meterList.filter(i=>i.meter_name.includes(value) || i.register_code.includes(value));
                                    setMeterData(temp);
                                }}>搜索</Button>
                            </div>
                        </div>
                    )}>
                        {
                            meterData.length 
                            ?
                            meterData.map((item,index)=>(
                                <Option value={item.mach_id} key={item.mach_id}>{ item.meter_name }</Option>
                            ))
                            :
                            null
                        }
                    </Select>
                </Form.Item>
                <Form.Item name='model_id' label='绑定设备模型' style={{ width:'100%' }}>
                    <Select>
                        {
                            modelList.map((item)=>(
                                <Option value={item.id} key={item.id}>{ item.model_name }</Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                <Form.Item name='parent_id' label='所属父级设备' style={{ width:'100%' }}>
                    <Select>
                        {
                            deviceList.length
                            ?
                            info.forEdit
                            ?
                            deviceList.filter(i=>!subs.includes(i.device_id)).map((item,index)=>(
                                <Option value={item.device_id} key={item.device_id}>{ item.device_name }</Option>
                            ))
                            :
                            deviceList.map((item,index)=>(
                                <Option value={item.device_id} key={item.device_id}>{ item.device_name }</Option>
                            ))
                            :
                            null
                        }
                    </Select>
                </Form.Item>
                
                <Form.Item label='标签' name='tags' style={{ width:'100%' }}>
                    <Select
                        mode="tags"
                        style={{
                          width: '100%'
                        }}
                        placeholder="输入按Enter键保存"
                    >
                        { [] }
                    </Select>
                </Form.Item>
                
            </Form>
            <div style={{ position:'absolute', bottom:'1rem', left:'50%', transform:'translateX(-50%)' }}>
                <Button type='primary' size='large' ghost onClick={()=>onClose()}>取消</Button>
                <Button type='primary' size='large' style={{ marginLeft:'6px' }} onClick={()=>{
                    form.validateFields()
                    .then(values=>{
                        if ( values.mach_ids && values.mach_ids.length ) {
                            values.buy_time = values.buy_time.format('YYYY-MM-DD');
                            values.make_time = values.make_time.format('YYYY-MM-DD');
                            values.maintain_date = values.maintain_date.format('YYYY-MM-DD');
                            values.next_maintain_date = values.next_maintain_date.format('YYYY-MM-DD');
                            if ( info.forEdit ){
                                values.device_id = info.machInfo.device_id;
                            }
                            if ( values.model_id ){
                                values.model_name = modelList.filter(i=>i.id === values.model_id )[0].model_name;
                            }
                            new Promise((resolve, reject)=>{
                                dispatch({ type:'device/add', payload:{ resolve, reject, values, forEdit:info.forEdit }})
                            })
                            .then(()=>{
                                onClose();

                            })
                            .catch(msg=>message.error(msg))
                        } else {
                            message.info('请选择绑定采集器');
                        }
                        console.log(values);
                        
                    })
                }}>保存</Button>
            </div>
        </div>
    )
}


function areEqual(prevProps, nextProps){
    if ( prevProps.info !== nextProps.info || prevProps.meterList !== nextProps.meterList ) {
        return false;
    } else {
        return true;
    }
}

export default React.memo(AddDeviceDrawer, areEqual);