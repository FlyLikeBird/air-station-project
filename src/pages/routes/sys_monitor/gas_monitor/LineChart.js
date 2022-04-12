import React, { useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Modal, Input, message } from 'antd';
import { findMaxAndMin } from '@/pages/utils/array';

const richStyle = {
    'blue':{
        // width:80,
        padding:[0,10,0,10],
        height:20,
        align:'center',
        borderWidth:1,
        color:'#fff',
        borderColor:'#4da4fe',
        backgroundColor:'rgba(77,164,254,0.4)'
    },
    'purple':{
        // width:80,
        padding:[0,10,0,10],
        height:20,
        color:'#fff',
        align:'center',
        borderWidth:1,
        borderColor:'#7916f7',
        backgroundColor:'rgba(121, 22, 247,0.4)'
    }
}



function LineChart({ dispatch, startDate, timeType, onVisible, data, info, theme }){
    const seriesData = [];
    let textColor = theme === 'dark' ? '#b0b0b0' : '#000';
    let sortArr = data.value.concat().sort((a,b)=>b-a);
    let max = sortArr[0] <= ( info.key === '3' ? 1 : 10 ) ? ( info.key === '3' ? 1 : 10 ) : Math.ceil(sortArr[0]) + ( info.key === '3' ? 1 : 10 );
    seriesData.push({
        type:'line',
        name:info.tab,
        data:data.value,
        itemStyle:{
            color:'#4da4fe'
        },
        symbolSize:0,
        markPoint: {
            data: [
                {type: 'max', name: info.tab, symbol:'circle', symbolSize:6 },
                {type: 'min', name: info.tab, symbol:'circle', symbolSize:6 }
            ],
            label:{
                position:[-40,-30],
                formatter:(params)=>{
                    return `{blue|${ params.data.type === 'max' ? '最大值' : '最小值'} : ${params.data.value}}`;
                },
                rich:richStyle
            }
        },
        // markLine: {
        //     data: [
        //         {type: 'average', name: '平均值'}
        //     ],
        // }
    });
    if ( info.key === '2' ){
        // 添加最小压力阈值
        seriesData.push({
            type:'line',
            symbol:'none',
            name:'最小压力阈值',
            data:data.value.map(i=> data.minPressure  || 0),
            itemStyle:{
                color:'#4da4fe'
            },
            lineStyle:{
                type:'dashed'
            },
            markPoint:{
                symbol:'rect',
                symbolSize:[120,20],
                data:[ { value:'最小压力阈值: '+ data.minPressure + ' bar ', xAxis: timeType === '2' ? 186 : data.date.length-4, yAxis:data.minPressure } ],
            },
            tooltip:{ show:false }
        })
    }
    let onEvents = {
        'click':(params)=>{
            if ( params.componentType === 'markPoint' && params.data.value.includes('最小压力')){
                onVisible(true);
            }
        }
    }
    return (
            <ReactEcharts
                notMerge={true}
                onEvents={onEvents}
                style={{ width:'100%', height:'100%' }}
                option={{
                    grid:{
                        top:60,
                        bottom:50,
                        left:20,
                        right:20,
                        containLabel:true
                    },

                    tooltip:{
                        trigger:'axis'
                    },
                    xAxis:{
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
                        data:data.date
                    },
                    yAxis:{
                        type:'value',
                        name:`${info.unit}`,
                        nameTextStyle:{
                            color:textColor
                        },
                        axisTick:{ show:false },
                        splitLine:{
                            lineStyle:{
                                color: theme === 'dark' ? '#22264b' : '#f0f0f0'
                            }
                        },
                        axisLine:{
                            show:false
                        },
                        axisLabel:{
                            color:textColor
                        },
                        min:0,
                        max
                    },
                    dataZoom: [
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
                            endValue: timeType === '2' ? 192 : data.date.length - 1
                        }
                    ],
                    series:seriesData
                }}
            />  
    )
}
function areEqual(prevProps, nextProps){
    if ( prevProps.data !== nextProps.data || prevProps.theme !== nextProps.theme  ) {
        return false;
    } else {
        return true;
    }
}
export default React.memo(LineChart, areEqual);