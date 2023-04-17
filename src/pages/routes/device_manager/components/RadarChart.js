import React, { useState, useRef } from 'react';
import { connect } from 'dva';
import { Radio, Card, Button,  } from 'antd';
import { LineChartOutlined, BarChartOutlined, PieChartOutlined, DownloadOutlined } from '@ant-design/icons';
import ReactEcharts from 'echarts-for-react';
import html2canvas from 'html2canvas';

const indicatorTypes = {
    'load_ratio':'保养周期',
    'empty_ratio':'故障频次',
    'air_ele_ratio':'气电比',
    'air_save_cost':'OEE',
    'air_cost_ratio':'比功率',
    'mach_life':'设备生命'
};
const textMaps = {
    '保养周期':'load_ratio',
    '故障频次': 'empty_ratio',
    '气电比' : 'air_ele_ratio',
    'OEE':'air_save_cost',
    '比功率':'air_cost_ratio',
    '设备生命':'mach_life'
};
function RadarChart({ data }) {
    data = { load_ratio:30, empty_ratio:40, air_ele_ratio:50, air_save_cost:20, air_cost_ratio:60, mach_life:80 };
    let seriesData = [], indicator = [];
    Object.keys(data).forEach(key=>{
        indicator.push({ name:indicatorTypes[key], max:100 });
        seriesData.push(data[key]);
    });
    return (    
        <ReactEcharts
            notMerge={true}
            style={{ width:'100%', height:'100%'}}
            option={{
                tooltip:{
                    show:false
                },
                radar: {
                    // shape: 'circle',
                    name: {
                        formatter:(value, indicator)=>{                        
                            return `${value} {a|${data[textMaps[value]]}}`
                        },
                        textStyle: {
                            color: '#babac1',
                            rich:{
                                a:{
                                    backgroundColor:'#4cd0ef',
                                    color:'#fff',
                                    padding:[2,6],
                                    borderRadius:6
                                }
                            }
                        }
                    },
                    radius:'65%',
                    splitNumber:4,
                    splitArea: {
                        areaStyle: {
                            color: ['rgba(21, 138, 250, 0.15)']
                        }
                    },
                    splitLine:{
                        lineStyle:{
                            width:1,
                            color:'#158afa'
                        }
                    },
                    axisLine:{
                        lineStyle:{
                            color:'rgba(21, 138, 250, 0.55)'
                        }
                    },
                    indicator
                },                    
                series:{
                    type: 'radar',
                    name:'用气体验',
                    symbolSize:6,
                    label:{
                        distance:2
                    },
                    itemStyle:{ color:'rgba(113, 52, 246, 1.0)'},
                    data: [
                        {
                            value: seriesData,
                            lineStyle:{
                                opacity:0
                            },
                            areaStyle:{
                                opacity:0.9,
                                color:{
                                    type:'linear',
                                    x:0,
                                    y:0,
                                    x2:0,
                                    y2:1,
                                    colorStops: [{
                                        offset: 0, color: 'rgba(113, 52, 246, 1.0)' // 0% 处的颜色
                                    }, {
                                        offset: 1, color: 'rgba(113, 52, 246, 0.8)' // 100% 处的颜色
                                    }],
                                    
                                },
                            }
                        }

                    ]
                }
            }}
        /> 
           
    );
}

export default RadarChart;
