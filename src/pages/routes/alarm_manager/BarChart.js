import React from 'react';
import ReactEcharts from 'echarts-for-react';

let colorsArr = ['#4cd5ee','#ff6b6c','#7272ab','#fec05d','#fec05d','#ea3ff8'];
function BarChart({ data, title, timeType, theme }){
    let textColor = theme === 'dark' ? '#b0b0b0' : '#000';
    let categoryData =[], seriesData = [];
    Object.keys(data).forEach((key,index)=>{
        if ( index === 0 ){
            categoryData = data[key].date;
        }
        seriesData.push({
            type:'bar',
            name:key,
            stack:'gas',
            barWidth:10,
            itemStyle:{
                color:colorsArr[index]
            },
            data:data[key].value
        })
    })
    return (
        <ReactEcharts
            notMerge={true}
            style={{ width:'100%', height:'100%' }}
            option={{
                tooltip: { 
                    show:true, 
                    trigger:'axis',
                    // formatter:(params)=>{
                    //     return `${params[0].marker}${params[0].axisValue}<br/>${params[0].data || '-- --'}%`
                    // }
                },
                title:{
                    text:title,
                    left:20,
                    top:10,
                    textStyle:{
                        fontSize:14,
                        color:'#fff'
                    }
                },
                legend:{
                    data:seriesData.map(i=>i.name),
                    left:'center',
                    top:10,
                    textStyle:{
                        color:textColor
                    }
                },
                grid:{
                    top:70,
                    bottom:20,
                    left:20,
                    right:40,
                    containLabel:true
                },    
                xAxis: {
                    show: true,
                    name: timeType === '1' ? '时' : timeType === '2' ?  '日' : '月',
                    nameTextStyle:{ color:textColor },
                    type:'category',
                    data:categoryData,
                    axisLine:{ show:false },
                    axisTick:{ show:false },
                    axisLabel:{
                        color:textColor
                    }
                },
                yAxis:{
                    show:true,
                    name:'次',
                    nameTextStyle:{
                        color:textColor
                    },
                    type:'value',
                    splitLine:{
                        lineStyle:{
                            color: theme === 'dark' ? '#22264b' : '#f0f0f0'
                        }
                    },
                    axisLine:{ show:false },
                    axisTick:{ show:false },
                    axisLabel:{
                        color:textColor
                    }
                },
                series:seriesData
            }}
        /> 
    )
}

function areEqual(prevProps, nextProps){
    if ( prevProps.data !== nextProps.data ){
        return false;
    } else {
        return true;
    }
}

export default React.memo(BarChart, areEqual);