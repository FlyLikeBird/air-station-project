import React from 'react';
import ReactEcharts from 'echarts-for-react';

function BarChart({ data, forReport, timeType }){
    let textColor = '#b0b0b0' ;
    let seriesData = [];
    seriesData.push({
        type:'bar',
        barWidth: forReport ? 6 : 14,
        name:'基准成本',
        itemStyle:{ color: forReport ? '#1b8ffe' : '#af2bff' },
        data:data.old_cost
    });
    seriesData.push({
        type:'bar',
        barWidth:forReport ? 6 : 14,
        name:'智控成本',
        itemStyle:{ color:forReport ? '#67de4a' : '#04a3fe' },
        data:data.cost
    });
    return (
        <ReactEcharts
            notMerge={true}
            style={{ width:'100%', height:'100%' }}
            option={{
                tooltip: { 
                    show:true, 
                    trigger:'axis',
                    backgroundColor:'rgba(50, 50, 50, 0.8)',
                    formatter:(params)=>{
                        return `<div>
                        <div>${ params[0].axisValue }</div>
                        <div>${params[0].marker}${params[0].seriesName} : ${ params[0].data }元</div>
                        <div>${params[1].marker}${params[1].seriesName} : ${ params[1].data }元</div>
                        <div style='padding-left:16px;'>节能成本 : ${data.save_cost[params[0].dataIndex]}元</div>
                        <div style='padding-left:16px;'>节能率 : ${data.save_cost_ratio[params[0].dataIndex]}%</div>
                        </div>`;
                    }
                },
                legend:{
                    data:seriesData.map(i=>i.name),
                    left:'center',
                    top:20,
                    textStyle:{
                        color:textColor
                    }
                },
                grid:{
                    top:60,
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
                            color: '#22264b'
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
    if ( prevProps.data !== nextProps.data  ){
        return false;
    } else {
        return true;
    }
}

export default React.memo(BarChart, areEqual);