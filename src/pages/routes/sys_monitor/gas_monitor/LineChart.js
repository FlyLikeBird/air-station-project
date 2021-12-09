import React from 'react';
import ReactEcharts from 'echarts-for-react';
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



function LineChart({ startDate, timeType, data, info, theme }){
    const seriesData = [];
    let textColor = theme === 'dark' ? '#b0b0b0' : '#000';
    let sortArr = data.value.concat().sort((a,b)=>b-a);
    let max = sortArr[0] <= 10 ? 10 : Math.ceil(sortArr[0]) + 10;
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
    
    return (
        <ReactEcharts
            notMerge={true}
            style={{ width:'100%', height:'100%' }}
            option={{
                grid:{
                    top:60,
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
export default React.memo(LineChart, areEqual);