import React from 'react';
import ReactEcharts from 'echarts-for-react';

let colorsArr = ['#ff6b6c','#7272ab','#fec05d','#4dd3ef','#f03aff'];
function BarChart({ data, timeType, dataType, theme }){
    let textColor = theme === 'dark' ? '#b0b0b0' : '#000';
    let seriesData = [];
    if ( data.view && data.view.length ){
        data.view.forEach((item,index)=>{
            seriesData.push({
                type:'bar',
                name:item.device_name,
                stack:'gas',
                barWidth:10,
                itemStyle:{ color:colorsArr[index] },
                data:item.value.map(i=>dataType === '1' ? i.cost : i.energy )
            })
        })
    }
    
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
                    text:'成本趋势',
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
                    data:data.date,
                    axisLine:{ show:false },
                    axisTick:{ show:false },
                    axisLabel:{
                        color:textColor
                    }
                },
                yAxis:{
                    show:true,
                    name:'元',
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
    if ( prevProps.data !== nextProps.data || prevProps.dataType !== nextProps.dataType ){
        return false;
    } else {
        return true;
    }
}

export default React.memo(BarChart, areEqual);