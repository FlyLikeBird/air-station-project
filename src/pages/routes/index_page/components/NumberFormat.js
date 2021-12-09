import React from 'react';
import style from '@/pages/IndexPage.css';
import numberBg from '../../../../../public/number-bg.png';

function NumberFormat({ data, containerWidth }){
    let strArr = Math.round(data).toString().split('');
    return (
        <div style={{ textAlign:'center', whiteSpace:'nowrap' }}>
            {
                strArr.map((item,index)=>(
                    item === '.' 
                    ?
                    <span key={index} style={{ marginRight:'6px' }}><span className={style['data']} style={{ color:'#fff' }}>,</span></span>
                    :
                    <span key={index} style={{ 
                        display:'inline-block', 
                        verticalAlign:'bottom',
                        width: containerWidth <= 1440 ? '24px' : '30px', 
                        height: containerWidth <= 1440 ? '40px' : '50px', 
                        textAlign:'center', 
                        lineHeight: containerWidth <= 1440 ? '40px' : '50px', 
                        marginRight:'6px', 
                        backgroundSize:'cover',
                        backgroundImage:`url(${numberBg})`
                    }}><span className={style['data']} style={{ color:'#0674c7'}}>{ item }</span></span>
                ))
            }
            <span className={style['sub-text']}>元</span>
        </div>
    )
}

export default NumberFormat;