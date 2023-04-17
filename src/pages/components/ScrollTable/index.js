import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Table, Button, Card, Tree, Select, Skeleton } from 'antd';
import style from './ScrollTable.css';
import IndexStyle from '@/pages/IndexPage.css';

let tableData = [];
for ( var i=0;i<20;i++){
    tableData.push({ pos:'E区空压站', mach_name:'阿特拉斯AD-2342', type:'设备故障', time:'2022-06-20 14:00:30'});
}
function ScrollTable({ thead, data, scrollNum, forIndex }){
    
    // const [scroll, setScroll] = useState({ list: data && data.length ? data.slice(0,scrollNum) : [], current:0});
    const [scroll, setScroll] = useState({ list: data && data.length ? data.slice(0,scrollNum) : [], current:0});
    const scrollRef = useRef(scroll);
    useEffect(()=>{
        scrollRef.current = scroll;
    },[scroll]);
    useEffect(()=>{
        let tempArr, timer, count;
        if ( data.length <= scrollNum ) {
            tempArr = data.slice();
            setScroll({ list:tempArr, current:0});
        } else {
            let temp = Math.floor((data.length)/scrollNum);
            count = (data.length)%scrollNum === 0 ? temp : temp + 1;
            timer = setInterval(()=>{
                let { current } = scrollRef.current;
                if ( current === count ){
                    current = 0;
                }
                let startIndex = current * scrollNum ;
                tempArr = data.slice(startIndex, startIndex + scrollNum );
                // if ( tempArr.length < scrollNum ) {
                //     // 当滚动到不足一屏数量时，填充item保证高度不变
                //     let diffNum = scrollNum - tempArr.length;
                //     for(let i=0;i<diffNum;i++){
                //         tempArr.push({ ...tempArr[0], fillItem:true });
                //     }
                // }
                ++current;
                setScroll({ list:tempArr, current});
            },5000)
        }
        return ()=>{
            clearInterval(timer);
        }
    },[]);
    return (
        <div className={style['container']}>
            <div className={style['thead']}>
                {
                    thead && thead.length 
                    ?
                    thead.map((item,index)=>(
                        <div key={index} style={{ width:item.width, fontSize:forIndex ? '0.8rem' : '1rem', color:forIndex ? '#3294d7' : '#fff' }}>{ item.title }</div>
                    ))
                    :
                    null
                }
              
            </div>
            <div className={style['content-container']}>
                {
                    scroll.list && scroll.list.length 
                    ?
                    scroll.list.map((item,index)=>(
                        <div className={style['item']} key={index}>
                            {
                                thead && thead.length 
                                ?
                                thead.map((col,index)=>(
                                    <div key={index} className={col.collapse ? style['collapse'] : ''} style={{ width:col.width, fontSize:'0.8rem' }}>
                                        <span className={col.border ? style['tag-off'] : ''}>
                                            {
                                                col.type === 'time' 
                                                ?
                                                <span>
                                                    <span style={{ color:'#fff' }}>{ item[col.dataIndex].split(' ')[1]}</span>
                                                    <br/>
                                                    <span style={{ display:'inline-block', color:'rgba(255, 255, 255, 0.65)', transform:'scale(0.9)', transformOrigin:'left' }}>{ item[col.dataIndex].split(' ')[0]}</span>
                                                </span>
                                                
                                                :
                                                item[col.dataIndex] ? item[col.dataIndex] : '-- --'
                                            }
                                        </span>
                                    </div>
                                ))
                                :
                                null
                            }
                            {/* <div>{ item.region_name ? item.region_name : '-- --' }</div>
                            <div>
                                <div>{ item.mach_name }</div>
                                <div>{ item.type_name}</div>
                            </div>
                            <div>{ item.date_time }</div> */}
                        </div>
                    ))
                    :
                    <div>当前运行正常，没有异常发生</div>
                    
                }
            </div>
        </div>
    )
};

function areEqual(prevProps, nextProps){
    if ( prevProps.data !== nextProps.data  ) {
        return false;
    } else {
        return true;
    }
}

export default React.memo(ScrollTable, areEqual);

