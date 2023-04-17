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
    let { currentMenu, theme, authorized, isFrame } = user;
    return (
        <div className={style['container'] + ' ' + ( theme === 'dark' ? style['dark'] : '' )} >
            { 
                authorized 
                ?
                isFrame 
                ?
                null
                :
                <Header />
                :
                null
            }
            <div className={style['main-content']} style={ ( isFullscreen() && currentMenu.menu_code === 'gas_home' ) || isFrame ?  { height:'100%' } : { height:'calc(100% - 60px)'} }>
                { children }
            </div>
        </div>
    )
}

export default connect(({ user })=>({ user }))(IndexPage);