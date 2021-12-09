import React, { useRef, useEffect } from 'react';
import { connect } from 'dva';
import Header from '@/pages/components/Header';
import style from './IndexPage.css';

function isFullscreen(){
    return document.fullscreenElement    ||
           document.msFullscreenElement  ||
           document.mozFullScreenElement ||
           document.webkitFullscreenElement || false;
}

function IndexPage({ children, user }){
    let { currentMenu } = user;
    return (
        <div className={style['container'] + ' ' + style['dark']} >
            <Header />
            <div className={style['main-content']} style={ isFullscreen() && currentMenu.menu_code === 'gas_home' ?  { height:'100%' } : { height:'calc(100% - 60px)'} }>
                { children }
            </div>
        </div>
    )
}

export default connect(({ user })=>({ user }))(IndexPage);