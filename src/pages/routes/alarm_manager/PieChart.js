import React from 'react';
import ReactEcharts from 'echarts-for-react';

let stylesMap = {
    '1':{
        type:'linear',
        x:0,
        y:0,
        x2:1,
        y2:0,
        colorStops: [{
            offset: 0, color: '#4cbaf7' // 0% 处的颜色
        }, {
            offset: 1, color: '#4ce6e6' // 100% 处的颜色
        }],
        
    },
    '2':{
        type:'linear',
        x:0,
        y:0,
        x2:1,
        y2:0,
        colorStops: [{
            offset: 0, color: '#851af9' // 0% 处的颜色
        }, {
            offset: 1, color: '#a91dfb' // 100% 处的颜色
        }],
    },
    '3':{
        type:'linear',
        x:0,
        y:0,
        x2:1,
        y2:0,
        colorStops: [{
            offset: 0, color: '#ff9f48' // 0% 处的颜色
        }, {
            offset: 1, color: '#ffb455' // 100% 处的颜色
        }],
    },
    '4':{
        type:'linear',
        x:0,
        y:0,
        x2:1,
        y2:0,
        colorStops: [{
            offset: 0, color: '#525286' // 0% 处的颜色
        }, {
            offset: 1, color: '#7a7ab3' // 100% 处的颜色
        }],
    },
} 

function PieChart({ data, title, theme }){
    let seriesData = [];
    let num = 0;
    Object.keys(data).forEach(key=>{
        num += data[key];
        seriesData.push({ value:data[key], name:key });
    });
    return (
        <ReactEcharts
            style={{ height:'100%' }}
            notMerge={true}
            option={{
                tooltip: {
                    trigger: 'item'
                },
                title:{
                    text:title,
                    left:20,
                    top:20,
                    textStyle:{
                        color:'#fff', fontSize:14
                    }
                }, 
                legend: {
                    show:true,
                    left:'54%',
                    top:'center',
                    orient:'vertical',
                    data:seriesData.map(i=>i.name),
                    icon:'circle',
                    formatter:(name)=>{
                        let temp = seriesData.filter(i=>i.name === name)[0];
                        // let temp = findData(name, seriesData);
                        let ratio = num ? (temp.value / num * 100).toFixed(1) : 0.0;
                        return `{title|${name}}\n{value|${ratio}%  ${temp.value}}{title|次}`
                    },
                    textStyle:{
                        rich: {
                            title: {
                                fontSize: 12,
                                lineHeight: 24,
                                color: '#9a9a9a',

                            },
                            value: {
                                fontSize: 16,
                                fontWeight:'bold',
                                lineHeight: 24,
                                color: theme === 'dark' ? '#fff' : 'rgba(0, 0, 0, 0.8)',
                                paddding:[0,4,0,0]
                            }
                        }
                    }
                },
                series:[{
                    type:'pie',
                    name:title,
                    center:['30%','50%'],
                    radius: ['54%', '72%'],
                    avoidLabelOverlap: false,
                    label:{
                        show:false
                    },
                    labelLine:{
                        show:false
                    },
                    data:seriesData.map((item,index)=>{
                        return { 
                            value:item.value, 
                            name:item.name,
                            itemStyle:{
                                borderWidth:6,
                                borderColor: theme === 'dark' ? '#191a2f' : '#fff',
                                color:stylesMap[index+1]
                            }
                        }
                    })
                }]
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
export default React.memo(PieChart, areEqual);