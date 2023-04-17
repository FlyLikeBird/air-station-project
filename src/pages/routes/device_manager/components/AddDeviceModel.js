import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Modal, Select, Button, Upload, Divider, message  } from 'antd';
import { UploadOutlined, PlusOutlined, CloseCircleOutlined, EditOutlined } from '@ant-design/icons';
import style from './AddDeviceDrawer.css';

let { Option, OptGroup } = Select;
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function AddDeviceModel({ dispatch, info, brandList, onClose }){
    let [form] = Form.useForm();
    let [value, setValue] = useState('');
    let [fileList, setFileList] = useState([]);
    let [previewInfo, setPreviewInfo] = useState({});
    const handleChange = ( { fileList })=>{
        setFileList(fileList);
    };
    const handlePreview = (file)=>{
        // file.thumbUrl 默认编译成200*200像素的64位字符串, 用FileReader重新解析
        
        if ( !file.preview ) {
            getBase64(file.originFileObj)
                .then(data=>{
                    file.preview = data;
                    setPreviewInfo({
                        visible:true,
                        img:data,
                        title:file.name
                    });
                })
        } else {
            setPreviewInfo({
                visible:true,
                img:file.preview,
                title:file.name
            })
        }
    };
    const handleBeforeUpload = (file)=>{
        const isJPG = file.type === 'image/jpeg';
        const isJPEG = file.type === 'image/jpeg';
        const isGIF = file.type === 'image/gif';
        const isPNG = file.type === 'image/png';
        if (!(isJPG || isJPEG || isGIF || isPNG)) {
            message.error('只能上传JPG 、JPEG 、GIF、 PNG格式的图片')
        }
        const isLt2M = file.size / 1024 / 1024 < 5;
        if (!isLt2M) {
            message.error('图片不能超过1M');
        }
        return false;
    };
    const uploadButton = (
        <div>
          <PlusOutlined />
          <div className="ant-upload-text">上传图片</div>
        </div>
    );    
    useEffect(()=>{
        if ( info.forEdit ){
            let { brand_id, img_path, work_ele, work_volte, maintenance_cycle } = info.modelInfo;
            form.setFieldsValue({ ...info.modelInfo, brand_id:+brand_id, work_ele:work_ele ? work_ele : null, work_volte:work_volte ? work_volte : null, maintenance_cycle:maintenance_cycle ? maintenance_cycle : null });
            if ( img_path ){
                setFileList([
                    {
                        uid: '-1',
                        name: 'image.png',
                        status: 'done',
                        preview: 'http://' + window.g.apiHost + img_path,
                        url:'http://' + window.g.apiHost + img_path,
                    }
                ])
            } else {
                setFileList([]);
            }
        } else {
            form.resetFields();
            setFileList([]);
        }
    },[info])
    return (
        <div>
            <Form
                form={form}
                className={style['form-container']}
                layout='inline'
            >

                <Form.Item label="模型名称" name="model_name" >
                    <Input />
                </Form.Item>
                <Form.Item label="型号" name="model_code">
                    <Input />
                </Form.Item>

                <Form.Item label="品牌" name="brand_id">
                    <Select 
                        optionLabelProp="label"
                        dropdownRender={(menu) => (
                            <>
                                {menu}
                                <Divider
                                    style={{
                                      margin: '8px 0',
                                    }}
                                />
                                <div style={{ display:'inline-flex', padding:'0.5rem 1rem' }}>
                                    <Input placeholder="输入品牌名" value={value} onChange={e=>setValue(e.target.value)} />
                                    <Button type='primary' icon={<PlusOutlined />} onClick={()=>{
                                        if ( value ){
                                            new Promise((resolve, reject)=>{
                                                dispatch({ type:'deviceModel/addBrandAsync', payload:{ brand_name:value }})  
                                            })
                                            .then(()=>setValue(''))
                                            .catch(msg=>message.error(msg))
                                        } else {
                                            message.info('品牌名不能为空')
                                        }
                                    }}>添加品牌</Button>
                                </div>
                            </>
                        )}
                    >
                        {
                            brandList.map((item)=>(
                                <Option value={item.id} key={item.id} label={ item.brand_name }>
                                    
                                    <div style={{ display:'flex', width:'100%', justifyContent:'space-between', alignItems:'center' }} >
                                        <div>{ item.brand_name }</div>
                                        <div><CloseCircleOutlined style={{ marginRight:'6px', color:'rgba(0, 0, 0, 0.45)' }} onClick={e=>{
                                            e.stopPropagation();
                                            new Promise((resolve, reject)=>{
                                                dispatch({ type:'deviceModel/delBrandAsync', payload:{ resolve, reject, brand_id:item.id }})
                                            })
                                            .then()
                                            .catch(msg=>message.error(msg))
                                        }} />
                                        {/* <EditOutlined onClick={e=>{
                                            e.stopPropagation();
                                            setEditing(item.id);
                                            setUpdateText(item.brand_name);
                                            // new Promise((resolve, reject)=>{
                                            //     dispatch({ type:'deviceModel/updateBrandAsync', payload:{ resolve, reject, }})
                                            // })
                                        }} /> */}
                                        </div>
                                    </div>
                                    
                                </Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                <Form.Item label="额定功率(Kw)" name='rated_power'>
                    <InputNumber />
                </Form.Item>
                <Form.Item label='质保年限(年)' name='warranty'>
                    <Input />
                </Form.Item>

                <Form.Item label='外形尺寸(米)' name='size'>
                    <Input />
                </Form.Item>
                <Form.Item label='整体重量(Kg)' name='weight'>
                    <Input />
                </Form.Item>

                <Form.Item label='频率(HZ)' name='frequency'>
                    <InputNumber />
                </Form.Item>
                <Form.Item label='比功率 Kw/(m³/min)' name='specific_power'>
                    <InputNumber />
                </Form.Item>
                
                <Form.Item label='保养周期(月)' name='maintenance_cycle'>
                    <InputNumber />
                </Form.Item>
                <Form.Item label='能源类型' name='power_type'>
                    <Input />
                </Form.Item>

                <Form.Item label='工作电流(A)' name='work_ele'>
                    <Input />
                </Form.Item>
                <Form.Item label='工作电压(V)' name='work_volte'>
                    <Input />
                </Form.Item>
                <Form.Item label='容积流量(m³/min)' name='volumetric_flow'>
                    <InputNumber />
                </Form.Item>
                <Form.Item label='最大排气压力(MPa)' name='exhaust_pressure'>
                    <InputNumber />
                </Form.Item>
                <Form.Item label='工作压力(MPa)' name='work_pressure'>
                    <InputNumber />
                </Form.Item>
                <Form.Item label='主轴转速(r/min)' name='spindle_speed'>
                    <InputNumber />
                </Form.Item>
                {/* <Form.Item label='标签' name='tags' style={{ width:'100%' }}>
                    <Select
                        mode="tags"
                        style={{
                          width: '100%',
                        }}
                        placeholder="Tags Mode"
                    >
                        { [] }
                    </Select>
                </Form.Item> */}
                <Form.Item label='模型图' style={{ width:'100%', height:'160px' }}>
                    <Upload
                        className={style['custom-upload']}
                        style={{ padding:'1rem 2rem' }}
                        listType="picture-card"
                        fileList={fileList}
                        onChange={handleChange}
                        onPreview={handlePreview}
                        beforeUpload={handleBeforeUpload}
                        
                    >
                        {
                            fileList.length === 1 ? null : uploadButton
                        }
                    </Upload>
                </Form.Item> 
            </Form>
            <div style={{ position:'absolute', bottom:'1rem', left:'50%', transform:'translateX(-50%)' }}>
                <Button type='primary' size='large' ghost onClick={()=>onClose()}>取消</Button>
                <Button type='primary' size='large' style={{ marginLeft:'1rem' }} onClick={()=>{
                    form.validateFields()
                    .then(values=>{
                        if ( !values.model_name ) {
                            message.info('模型名称不能为空');
                            return;
                        }
                        if ( !values.model_code) {
                            message.info('型号不能为空');
                            return ;
                        }
                        if ( !values.brand_id ){
                            message.info('品牌不能为空');
                            return;
                        }
                        if ( !fileList.length ) {
                            message.info('请上传模型图片');
                            return ;
                        }
                        values.brand_name = brandList.filter(i=>i.id === values.brand_id)[0].brand_name;
                        values.photos = fileList.map(i=>i.originFileObj).filter(i=>i);
                        if ( info.forEdit ){
                            values.model_id = info.modelInfo.id;
                        }   
                        new Promise((resolve, reject)=>{
                            dispatch({ type:'deviceModel/addModelAsync', payload:{ resolve, reject, values, forEdit:info.forEdit }})
                        })
                        .then(()=>{
                            message.success(`${ info.forEdit ? '更新' : '新建' }设备模型成功`);
                            onClose();
                        })
                        .catch(msg=>message.error(msg))
                        
                    })
                }}>保存</Button>
            </div>
            <Modal visible={previewInfo.visible} width='1200px' title={previewInfo.title} footer={null} onCancel={()=>setPreviewInfo({ ...previewInfo, visible:false })}>
                <img src={previewInfo.img} style={{ width:'100%'}} />
            </Modal>
        </div>
    )
}

function areEqual(prevProps, nextProps){
    if ( prevProps.info !== nextProps.info || prevProps.brandList !== nextProps.brandList ) {
        return false;
    } else {
        return true;
    }
}
export default React.memo(AddDeviceModel, areEqual);