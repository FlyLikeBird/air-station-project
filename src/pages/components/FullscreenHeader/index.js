import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import headerBg from '../../../../public/air-station-header.png';
import titleBg from '../../../../public/agent_title_bg.png';

import { getToday } from '@/pages/utils/parseDate';
import { UserOutlined, FullscreenExitOutlined, LogoutOutlined } from '@ant-design/icons'
import style from './FullscreenHeader.css';
function cancelFullScreen(el ){
    // let func = el.cancelFullsceen || el.msCancelFullsceen || el.mozCancelFullsceen || el.webkitCancelFullsceen 
    //         || document.exitFullscreen || document.msExitFullscreen || document.mozExitFullscreen || document.webkitExitFullscreen ;
    // if ( func && typeof func === 'function' ) func();
    if ( typeof document.exitFullscreen === 'function' ) {
        document.exitFullscreen();
    }
}
const weekObj = {
    0:'周日',
    1:'周一',
    2:'周二',
    3:'周三',
    4:'周四',
    5:'周五',
    6:'周六',
}
let timer = null;
function FullscreenHeader({ dispatch, user, title, forAgent }){
    let { userInfo, weatherInfo } = user;
    let week = new Date().getDay();
    const [curTime, updateTime] = useState(getToday(2));
    let dateArr = curTime.split(' ');
    let year = dateArr[0];
    let nowTime = dateArr[1];
    useEffect(()=>{
        timer = setInterval(()=>{
            updateTime(getToday(2));
        },1000 * 60);
        return ()=>{
            clearInterval(timer);
            timer = null;
        }
    },[]);
    return (
        <div className={style['container']} style={{ backgroundImage:`url(${headerBg})`}}>
            <div className={style['title']}>
                <img src={titleBg} style={{ height:'100%' }} />
            </div>
            <div className={style['weather-container']}>
                <span className={style['spec-time']}>{ nowTime }</span>
                <span>{`${weekObj[week]} ${year}` }</span>
                <span style={{ margin:'0 10px', color:'#15f1fd' }}>{ weatherInfo.city }</span>
                <span style={{ color:'#15f1fd' }}>{ weatherInfo.weather }</span>
            </div>
            <div className={style['btn-group']}>
                <span className={style['btn-item']}><UserOutlined />{ userInfo.user_name } </span>
                <span className={style['btn-item']} onClick={()=>{
                    if ( forAgent ){
                        dispatch({ type:'user/loginOut'});
                    } else {
                        cancelFullScreen();
                    }
                }} style={{ cursor:'pointer' }}>
                    { forAgent ? <LogoutOutlined style={{ marginRight:'6px' }} /> : <FullscreenExitOutlined style={{ marginRight:'6px' }} /> }
                    { forAgent ? '退出登录' : '退出全屏' }
                </span>
            </div>
        </div>
    )
}

export default connect(({ user })=>({ user }))(FullscreenHeader);