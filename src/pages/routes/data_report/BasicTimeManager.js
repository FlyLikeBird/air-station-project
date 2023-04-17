import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { DatePicker, Button, Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import style from '@/pages/IndexPage.css';
import zhCN from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';

function BasicTimeManager({ dispatch, gasControl }){
    let { basicTimeInfo } = gasControl;
    let { is_freeze } = basicTimeInfo;
    let [startDate, setStartDate] = useState(null);
    let [endDate, setEndDate] = useState(null);
    let [visible, setVisible] = useState(false);
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
        const isPDF = file.type === 'application/pdf';
        if (!(isJPG || isJPEG || isGIF || isPNG || isPDF )) {
            message.error('只能上传JPG 、JPEG 、GIF、 PNG格式的图片或者PDF文档');
            return Upload.LIST_IGNORE;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('上传文件不能超过2M');
            return Upload.LIST_IGNORE;
        }
        return false;
    };
    const uploadButton = (
        <div>
          <PlusOutlined />
          <div className="ant-upload-text">上传图片凭证或PDF文档</div>
        </div>
    );  
    useEffect(()=>{
        dispatch({ type:'gasControl/fetchTimeInfo'});
    },[]);
    useEffect(()=>{
        if ( Object.keys(basicTimeInfo).length ){
            setStartDate(moment(basicTimeInfo.begin_date));
            setEndDate(moment(basicTimeInfo.end_date));
        }
    },[basicTimeInfo])

    return (
        <div style={{ color:'#fff' }}>
            <span>开始时间 :</span>
            <DatePicker locale={zhCN} allowClear={false} className={style['custom-date-picker']} style={{ margin:'0 2rem 0 4px' }} value={startDate} onChange={value=>setStartDate(value)} />
            <span>结束时间 :</span>
            <DatePicker locale={zhCN} allowClear={false} className={style['custom-date-picker']} style={{ margin:'0 1rem 0 4px' }} value={endDate} onChange={value=>setEndDate(value)} />
            <Button type='primary' style={{ marginRight:'6px' }} disabled={ is_freeze ? true : false } onClick={()=>{
                new Promise((resolve, reject)=>{
                    dispatch({ type:'gasControl/setTimeInfo', payload:{ resolve, reject, begin_date:startDate.format('YYYY-MM-DD'), end_date:endDate.format('YYYY-MM-DD')}})
                })
                .then(()=>message.success('设置未智控基准时间段成功'))
                .catch(msg=>message.error(msg));
            }}>设置时段</Button>
            <Button type='primary' style={{ marginRight:'6px' }} onClick={()=>setVisible(true)} disabled={ is_freeze ? true : false }>{ is_freeze ? '已冻结' : '冻结' }</Button>
            {
                basicTimeInfo.is_freeze && basicTimeInfo.file_path 
                ?
                <Button type='primary'><a style={{ color:'#fff' }} href={basicTimeInfo.file_path} target='_blank'>查看附件</a></Button>
                :
                null
            }
            <Modal 
                visible={visible}
                onCancel={()=>setVisible(false)}
                cancelText='取消'
                okText='冻结'
                onOk={()=>{
                    if ( fileList.length ){
                        new Promise((resolve, reject)=>{
                            dispatch({ type:'gasControl/setTimeInfo', payload:{ resolve, reject, begin_date:startDate.format('YYYY-MM-DD'), end_date:endDate.format('YYYY-MM-DD'), file:fileList[0].originFileObj }})
                        })
                        .then(()=>setVisible(false))
                        .catch(msg=>message.error(msg));
                    } else {
                        message.info('请按规则上传合适的附件')
                    }
                }}
            >
                <Upload
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
            </Modal>          
            <Modal visible={previewInfo.visible} width='1200px' title={previewInfo.title} footer={null} onCancel={()=>setPreviewInfo({ ...previewInfo, visible:false })}>
                <img src={previewInfo.img} style={{ width:'100%'}} />
            </Modal>
        </div>
    )
}

export default connect(({ gasControl })=>({ gasControl }))(BasicTimeManager);