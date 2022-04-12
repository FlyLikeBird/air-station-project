import React from 'react';
import ReactEcharts from 'echarts-for-react';

let categoryData = [];
for(var i=1;i<=15;i++){
    let baseCost = Math.round(Math.random() * 5000);
    categoryData.push({ date:i, baseCost, smartCost:baseCost - Math.round(Math.random() * 200) });
}
function BarChart({ data, timeType, dataType, theme }){
    let textColor = '#b0b0b0' ;
    let seriesData = [];
    seriesData.push({
        type:'bar',
        barWidth:14,
        name:'基准成本',
        itemStyle:{ color:'#af2bff' },
        data:categoryData.map(i=>i.baseCost)
    });
    seriesData.push({
        type:'bar',
        barWidth:14,
        name:'智控成本',
        itemStyle:{ color:'#04a3fe' },
        data:categoryData.map(i=>i.smartCost)
    });
    return (
        <ReactEcharts
            notMerge={true}
            style={{ width:'100%', height:'100%' }}
            option={{
                tooltip: { 
                    show:true, 
                    trigger:'axis',
                    formatter:(params)=>{
                        let diff = params[0].data - params[1].data;
                        let ratio = (diff / params[0].data).toFixed(1);
                        return `<div>
                        <div>${ params[0].axisValue }</div>
                        <div>${params[0].marker}${params[0].seriesName} : ${ params[0].data }元</div>
                        <div>${params[1].marker}${params[1].seriesName} : ${ params[1].data }元</div>
                        <div style='padding-left:16px;'>节能成本 : ${diff}元</div>
                        <div style='padding-left:16px;'>节能率 : ${ratio}%</div>
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
                    top:90,
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
                    data:categoryData.map(i=>i.date),
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