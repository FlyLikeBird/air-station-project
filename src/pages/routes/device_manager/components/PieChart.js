import React, { useState, useRef } from 'react';
import { connect } from 'dva';
import { Radio, Card, Button,  } from 'antd';
import { LineChartOutlined, BarChartOutlined, PieChartOutlined, DownloadOutlined } from '@ant-design/icons';
import ReactEcharts from 'echarts-for-react';
import html2canvas from 'html2canvas';

const indicatorTypes = {
    'load_ratio':'稼动率',
    'empty_ratio':'空载率',
    'air_ele_ratio':'气电比',
    'air_save_cost':'气成本比',
    'air_cost_ratio':'节省效率'
};
const textMaps = {
    '稼动率':'load_ratio',
    '空载率': 'empty_ratio',
    '气电比' : 'air_ele_ratio',
    '气成本比':'air_save_cost',
    '节省效率':'air_cost_ratio'
};
function PieChart({ data }) {
    
    return (    
        <ReactEcharts
            notMerge={true}
            style={{ width:'100%', height:'100%' }}
            option={{
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c}%'
                },
                series: [
                    {
                        name: data.mach_name + '使用时间',
                        type: 'pie',
                        radius: ['75%', '80%'],
                        avoidLabelOverlap: false,
                        label: {
                            show:true,
                            position: 'center',
                            formatter:data.ratio + '%' + '\n' + ( data.ratio == 0 ? '已耗尽' : '剩余' ),
                            color:data.ratio == 0 ? '#fe2c2d' : data.ratio < 20 ? '#ffb766' : '#a7f270',
                            lineHeight:20
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            {value: Math.round(100 - data.ratio), name: '已使用', itemStyle:{ color:'#7e7e92'}},
                            {value: data.ratio, name: '还剩余', itemStyle:{ 
                                color:data.ratio == 0 ? '#7e7e92' : 
                                data.ratio < 20 ? '#ffb766' : '#a7f270'
                            }},
                        ]
                    }
                ]
            }}
        />          
    );
}

function areEqual(prevProps, nextProps){
    if ( prevProps.data !== nextProps.data ){
        return false;
    } else {
        return true;
    }
}
export default React.memo(PieChart, areEqual);
