import React from 'react';
import { Spin } from 'antd';
import style from './Loading.css';

function Loading({ title }){
    return (
        <div className={style['mask']}>
            <div className={style['content']}>
                <div style={{ color:'#fff' }}>{ title || '' }</div>
                <Spin className={style['spin']} size='large' />
            </div>
        </div>
    )
}

export default Loading;