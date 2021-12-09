import React from 'react';
import ReactEcharts from 'echarts-for-react';

function LineChart({ xData, yData, name, theme }){
    let textColor = theme === 'dark' ? '#b0b0b0' : '#000';
    const seriesData = [];
    seriesData.push({
        type:'line',
        name,
        data:yData,
        itemStyle:{
            color:'#eff400'
        },
        symbolSize:0
    });
    
    
    return (
        <ReactEcharts
            notMerge={true}
            style={{ width:'100%', height:'100%' }}
            option={{
                grid:{
                    top:40,
                    bottom:20,
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
                            color:textColor
                        }
                    },
                    axisLabel:{
                        color:textColor
                    },
                    data:xData
                },
                yAxis:{
                    type:'value',
                    splitLine:{
                        lineStyle:{
                            color: theme === 'dark' ? '#22264b' : '#f0f0f0'
                        }
                    },
                    axisTick:{
                        show:false
                    },
                    axisLine:{
                        show:false
                    },
                    axisLabel:{
                        color:textColor
                    },
                },
                series:seriesData
            }}
        />
    )
}
function areEqual(prevProps, nextProps){
    if ( prevProps.data !== nextProps.data  ) {
        return false;
    } else {
        return true;
    }
}
export default LineChart;