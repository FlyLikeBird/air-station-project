import React from 'react';
import { connect } from 'dva';
import { Link, Route, Switch } from 'dva/router';
import { Radio } from 'antd';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import style from '@/pages/IndexPage.css';
const labelStyle = {
    display:'inline-block',
    width:'40px',
    height:'40px',
    lineHeight:'40px',
    borderRadius:'10px',
    color:'#fff',
    fontSize:'1.2rem',
    fontWeight:'bold',
    textAlign:'center'
};
function InfoItem({ data, dataType }) {
    let { key, value, same, last } = data;
    return (     
        <div className={style['flex-container']}>
            <div className={style['flex-item']} style={{ height:'auto'}}>
                <span style={{...labelStyle, backgroundColor: key === 'day' ? '#af2aff' : key === 'month' ? '#6dcffb' : '#ffc177'}}>{ key === 'day' ? '日' : key === 'month' ? '月' : '年' }</span>
            </div>
            <div className={style['flex-item']} style={{ height:'auto'}}>
                <span style={{ color:'rgba(255,255,255,0.7)', fontSize:'0.8rem' }}>
                    {
                        key === 'day' ?  `昨日${ dataType ==='1' ? '费用' : '能耗'}`:
                        key === 'month' ?  `本月${ dataType ==='1' ? '费用' : '能耗'}`:
                        key === 'year' ?  `本年${ dataType ==='1' ? '费用' : '能耗'}`:                       
                        null
                    }
                </span>
                <br/>
                <span className={style['data']} >{Math.floor(+value)}</span><span style={{ color:'rgba(255,255,255,0.7)', fontSize:'0.8rem', margin:'0 6px'}}>{ dataType === '1' ? '元' : 'kwh' }</span>
            </div>  
            <div className={style['flex-item']} style={{ height:'auto'}}>
                <span style={{ color:'rgba(255,255,255,0.7)', fontSize:'0.8rem' }}>同比</span>
                <br/>
                {
                    !same
                    ?
                    <span className={style['data']}>-- --</span>
                    :
                    <span className={`${style['data']} ${style[ same < 0 ? 'down' : 'up']}`}>
                        { Math.abs(same).toFixed(1) + '%' }
                        { same < 0 ? <CaretDownOutlined style={{ fontSize:'1rem' }} /> : <CaretUpOutlined style={{ fontSize:'1rem' }}/> }                        
                    </span>
                }
            
            </div>    
            <div className={style['flex-item']} style={{ height:'auto'}}>
                <span style={{ color:'rgba(255,255,255,0.7)', fontSize:'0.8rem' }}>环比</span>
                <br/>
                {
                    !last
                    ?
                    <span className={style['data']}>-- --</span>
                    :
                    <span className={`${style['data']} ${style[ last < 0 ? 'down' : 'up']}`}>
                        { Math.abs(last).toFixed(1) + '%' }
                        { last < 0 ? <CaretDownOutlined style={{ fontSize:'1rem' }}/> : <CaretUpOutlined style={{ fontSize:'1rem' }}/> }
                        
                    </span>
                }
            </div>                        
        </div>         
    );
}

function areEqual(prevProps, nextProps){
    if ( prevProps.data != nextProps.data  ){
        return false;
    } else {
        return true;
    }
}
export default React.memo(InfoItem, areEqual);
