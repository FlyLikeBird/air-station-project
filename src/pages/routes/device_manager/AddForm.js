import React, { useState, useEffect } from 'react';
import { Form, Select, Input, DatePicker, Button, message, Divider } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import style from './AddForm.css';
import IndexStyle from '@/pages/IndexPage.css';
import zhCN from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';

const { Option } = Select;
const { Search, TextArea } = Input;

let deviceTypes = [
    { title:'空压站', key:1},
    { title:'空压机', key:2},
    { title:'变压站', key:3},
    { title:'变压器', key:4},
    { title:'其他', key:0 }
];
function validator(a,value){
    if ( !value || (typeof +value === 'number' && +value === +value && +value >=0  )) {
        return Promise.resolve();
    } else {
        return Promise.reject('请填入合适的阈值');
    }
}

function getTreeSubs(deviceList, node, result){
    result.push({ device_id:node.device_id, device_name:node.device_name });
    if ( node.subs && node.subs.length ){
        node.subs.forEach(item=>{
            getTreeSubs(deviceList, deviceList.filter(i=>i.device_id === item)[0], result);
        })
    }
}

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};
function AddForm({ info, meterList, deviceList, onDispatch, onClose }){  
    const [form] = Form.useForm();
    let [value, setValue] = useState('');
    let [meterData, setMeterData] = useState(meterList);
    let subs = [];
    if ( info.forEdit ){
        // 编辑模式下筛选出当前设备下关联的树级子设备
        getTreeSubs(deviceList, info.machInfo, subs);
        subs = subs.map(i=>i.device_id);
    }
    useEffect(()=>{
        if ( info.forEdit ){
            form.setFieldsValue({
                device_no : info.machInfo.device_no ,
                device_name: info.machInfo.device_name ,
                device_model : info.machInfo.device_model ,
                sequence_code : info.machInfo.sequence_code ,
                device_type : info.machInfo.device_type ,
                buy_time : moment(info.machInfo.buy_date) ,
                make_time : moment(info.machInfo.make_date) ,
                guarantee : info.machInfo.guarantee ,
                buy_amount : info.machInfo.buy_amount ,
                remark : info.machInfo.remark ,
                mach_ids : info.machInfo.bind ,
                parent_id : info.machInfo.parent_id ? info.machInfo.parent_id : null

            });
        }
        
       
    },[info]);
   
    return (
        <div>
            <Form
                {...layout} 
                name="add-form"
                className={style['form-container']}
                form={form}
                onFinish={values=>{
                    
                    if ( info.forEdit ) {
                        values.mach_id = info.currentMach.mach_id;
                    }
                    // console.log(values);
                    new Promise((resolve,reject)=>{
                        onDispatch({ type: forMachs ? 'controller/add' : 'gateway/add', payload:{ values, resolve, reject, forEdit:info.forEdit }});
                    })
                    .then(()=>{
                        onClose();
                        message.success(`${info.forEdit ? '修改' : '添加'}${ forMachs ? '空开' :'网关'}成功`);
                    })
                    .catch(msg=>{
                        message.error(msg);
                    })
                }}
            >
                
                <Form.Item name='device_no' label='资产编号' rules={[{ required:true, message:'资产编号不能为空'}]}>
                    <Input />
                </Form.Item>
                <Form.Item name='device_name' label='产品名称' rules={[{ required:true, message:'产品名称不能为空'}]}>
                    <Input />
                </Form.Item>
                <Form.Item name='device_model' label='产品型号' rules={[{ required:true, message:'产品型号不能为空'}]}>
                    <Input />
                </Form.Item>
                <Form.Item name='sequence_code' label='产品序列码' rules={[{ required:true, message:'产品序列码不能为空'}]}>
                    <Input />
                </Form.Item>
                <Form.Item name='device_type' label='设备类型' rules={[{ required:true, message:'请选择设备类型'}]}>
                    <Select>
                        {
                            deviceTypes.map((item,index)=>(
                                <Option value={item.key} key={item.key}>{ item.title }</Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                <Form.Item name='buy_time' label='购买日期' rules={[{ required:true, message:'购买日期不能为空'}]}>
                    <DatePicker style={{ width:'100%' }} locale={zhCN} />
                </Form.Item>
                <Form.Item name='make_time' label='生产日期' rules={[{ required:true, message:'生产日期不能为空'}]}>
                    <DatePicker style={{ width:'100%' }} locale={zhCN} />
                </Form.Item>
                <Form.Item name='guarantee' label='保修期限' rules={[{ required:true, message:'保修期限不能为空'}]}>
                    <Input addonAfter='月' />
                </Form.Item>
                <Form.Item name='buy_amount' label='购买金额' rules={[{ required:true, message:'购买金额不能为空'}]}>
                    <Input addonAfter='元' />
                </Form.Item>
                
                <Form.Item name='mach_ids' label='绑定采集器' rules={[{ required:true, message:'请选择要绑定的采集器'}]}>
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
                <Form.Item name='parent_id' label='所属父级设备' >
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
                <Form.Item name='remark' label='备注信息'>
                    <TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
                </Form.Item>
                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
                    <span className={IndexStyle['btn']} onClick={()=>{
                        form.validateFields()
                        .then(values=>{
                            if ( info.forEdit ){
                                values.device_id = info.machInfo.device_id;
                            }
                            values.buy_time = values.buy_time.format('YYYY-MM-DD');
                            values.make_time = values.make_time.format('YYYY-MM-DD');
                            new Promise((resolve, reject)=>{
                                onDispatch({ type:'device/add', payload:{ resolve, reject, values, forEdit:info.forEdit }})
                            })
                            .then(()=>{
                                message.success(`${info.forEdit ? '修改':'添加'}设备成功`);
                                onClose();
                                form.resetFields();
                            })
                            .catch(msg=>message.error(msg))
                        })
                    }}>保存</span>
                    <span className={IndexStyle['btn'] + ' ' + IndexStyle['opacity']} onClick={()=>{
                        form.resetFields();
                        onClose();
                    }}>取消</span>
                </Form.Item>
            </Form>
            
        </div>
    )
}

function areEqual(prevProps, nextProps){
    if ( prevProps.info !== nextProps.info  ) {
        return false;
    } else {
        return true;
    }
}

export default React.memo(AddForm, areEqual);