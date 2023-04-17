import React, { useState } from 'react';
import ReactEcharts from 'echarts-for-react';

function LineChart({ data }){
    let seriesData = [];
    seriesData.push({
        type:'line',
        name:'故障告警',
        symbol:'none',
        smooth:true,
        itemStyle:{
            color:'#ffc321',
        },
        data:data.fault || []
    });
    seriesData.push({
        type:'line',
        name:'通讯告警',
        symbol:'none',
        smooth:true,
        itemStyle:{
            color:'#16fbfd',
        },
        data:data.link || []
    });
    return (
       
            <ReactEcharts
                notMerge={true}
                style={{ height:'100%' }}
                option={{
                    tooltip:{
                        trigger:'axis'
                    },
                    legend:{
                        top:6,
                        textStyle:{ color:'rgba(255, 255, 255, 0.65)' },
                        data:['故障告警','通讯告警'],
                        icon:'rect',
                        itemWidth:10,
                        itemHeight:10
                    },
                    grid:{
                        top:40,
                        bottom:6,
                        left:10,
                        right:20,
                        containLabel:true
                    },
                    xAxis: {
                        type: 'category',
                        axisTick:{ show:false },
                        axisLabel:{ 
                            color:'#b0b0b0', 
                        },
                        axisLine:{
                            show:true,
                            lineStyle:{
                                color:'rgba(18, 168, 254, 0.8)'
                            }
                        },
                        data:data.date || []
                    },
                    yAxis: {
                        type: 'value',
                        name:'次',
                        nameTextStyle:{
                            color:'#b0b0b0'
                        },
                        nameGap:10,
                        minInterval:1,
                        axisTick:{ show:false },
                        axisLabel:{ color:'#b0b0b0' },
                        axisLine:{ show:false },
                        splitLine:{
                            lineStyle:{
                                color:'#1f242c'
                            }
                        }
                    },
                    series: seriesData
                }}
            />
        
    )
}

function areEqual(prevProps, nextProps){
    if ( prevProps.data !== nextProps.data  ){
        return false;
    } else {
        return true;
    }
}

export default React.memo(LineChart, areEqual);