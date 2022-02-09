import React, { useState } from 'react';
import { Spin } from 'antd';
import AreaLineChart from './components/AreaLineChart';
import style from '@/pages/IndexPage.css';

function CustomTabs({ data }){
    let [currentKey, setCurrentKey] = useState('1');
    let loaded = Object.keys(data).length ? true : false;
    let chartInfo = {};
    if ( loaded ){
        if ( currentKey === '2' ){
            let temp = data.value.concat().map(item=>{
                return item === null ? null : item ? (1/item).toFixed(2) : 0;
            });
            chartInfo = { ...data, value:temp };
        } else {
            chartInfo = data;
        }
    }
    return (
        loaded 
        ? 
        <div className={style['card-container']} style={{ height:'21%', backgroundColor:'transparent', overflow:'hidden' }}>
            <div className={style['card-title']} style={{ color:'#fff', fontWeight:'normal', justifyContent:'flex-start' }}>
                <div style={{ borderBottom:currentKey === '1' ? '2px solid #5fbeff' : '2px solid transparent', marginRight:'1rem', cursor:'pointer' }} onClick={()=>setCurrentKey('1')}>近7日气电比<span className={style['sub-text']} style={{ color:'rgba(255, 255, 255, 0.6)'}}>(kwh/m³)</span></div>
                <div style={{ borderBottom:currentKey === '2' ? '2px solid #5fbeff' : '2px solid transparent', cursor:'pointer' }} onClick={()=>setCurrentKey('2')}>近7日比功率<span className={style['sub-text']} style={{ color:'rgba(255, 255, 255, 0.6)'}}>(m³/kwh)</span></div>
            </div>
            <div className={style['card-content']} style={{ padding:'0' }}>            
                <AreaLineChart data={chartInfo} />               
            </div>
        </div>
        :
        <div className={style['card-container']} style={{ height:'21%', backgroundColor:'transparent', overflow:'hidden' }}>
            <Spin className={style['spin']} />
        </div>
    )
}

export default CustomTabs;