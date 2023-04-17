import React, { useState } from 'react';
import { Upload, Button, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import style from '@/pages/IndexPage.css';

function UploadCom({ dispatch }){
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
    return (
        <>
            <div className={style['custom-button']} onClick={()=>setVisible(true)}>上传凭证</div>
            <Modal 
                visible={visible}
                onCancel={()=>setVisible(false)}
                cancelText='取消'
                okText='上传'
                onOk={()=>{
                    message.info('开发中');
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
        </>
        
    )
}

export default UploadCom;