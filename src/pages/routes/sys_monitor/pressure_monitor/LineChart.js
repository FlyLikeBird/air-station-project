import React, { useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Modal, Input, message, Spin } from 'antd';
import { findMaxAndMin } from '@/pages/utils/array';


function LineChart({ timeType, data, currentNode, theme, forShort }){
    const seriesData = [];
    theme = 'dark';
    let textColor = theme === 'dark' ? '#b0b0b0' : '#000';
    let sortArr = data.value ? data.value.filter(i=>i).sort((a,b)=>b-a) : [];
    // let max = sortArr[0] <= ( info.key === '3' ? 1 : 10 ) ? ( info.key === '3' ? 1 : 10 ) : Math.ceil(sortArr[0]) + ( info.key === '3' ? 1 : 10 );
    let min = sortArr[sortArr.length - 1], max = sortArr[0];
    let diff = max - min;
    seriesData.push({
        type:'line',
        name:'压差',
        data:data.value || [],
        smooth:true,
        itemStyle:{
            color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [{
                    offset: 0, color: '#22cfff' // 0% 处的颜色
                }, {
                    offset: 1, color: '#6a44ff' // 100% 处的颜色
                }],
                global: false // 缺省为 false
            }
        },
        symbolSize:0
    });
    
    let option = {
        grid:{
            top: forShort ? 10 : 50,
            bottom: forShort ? 20 : 50,
            left: forShort ? 10 : 20,
            right: forShort ? 10 : 20,
            containLabel: forShort ? false  : true
        },
        tooltip:{
            show:forShort ? false : true,
            trigger:'axis'
        },
        xAxis:{
            show:forShort ? false : true,
            type:'category',
            axisTick:{ show:false },
            axisLine:{
                lineStyle:{
                    color: theme === 'dark' ? '#22264b' : '#f0f0f0'
                }
            },
            axisLabel:{
                color:textColor
            },
            data:data.date || []
        },
        yAxis:{
            show:forShort ? false : true,
            type:'value',
            name:'bar',
            nameTextStyle:{
                color:textColor
            },
            axisTick:{ show:false },
            splitLine:{
                lineStyle:{
                    color: theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : '#f0f0f0',
                    type:'dotted'
                }
            },
            axisLine:{
                show:false
            },
            axisLabel:{
                color:textColor
            }
        },
        series:seriesData
    }
    if ( forShort ){
        option.yAxis.min = min;
        option.yAxis.max = max;
    }
    if ( !forShort ){
        option.dataZoom = [
            {
                show:true,
                bottom:10,
                handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                handleSize: '80%',
                handleStyle: {
                    color: '#fff',
                    shadowBlur: 3,
                    shadowColor: 'rgba(0, 0, 0, 0.6)',
                    shadowOffsetX: 2,
                    shadowOffsetY: 2
                },
                startValue:0,
                endValue:190
            }
        ]
    };
    
    return (
        <div style={{ height:'100%', position:'relative' }}>
          <ReactEcharts
                notMerge={true}
                style={{ width:'100%', height:'100%' }}
                option={option}
            />   
        </div> 
    )
}
function areEqual(prevProps, nextProps){
    if ( prevProps.data !== nextProps.data ) {
        return false;
    } else {
        return true;
    }
}
export default React.memo(LineChart, areEqual);