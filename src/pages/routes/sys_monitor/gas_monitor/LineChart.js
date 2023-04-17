import React, { useState, useEffect } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Modal, Input, Button, Tag, Form, message } from 'antd';
import { findMaxAndMin } from '@/pages/utils/array';
import style from '@/pages/IndexPage.css';

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



function LineChart({ dispatch, startDate, timeType, onVisible, data, currentTab, typeRule, theme }){
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm();
    const seriesData = [];
    let textColor = theme === 'dark' ? '#b0b0b0' : '#000';
    let sortArr = data.value.concat().sort((a,b)=>b-a);
    let max = sortArr[0] <= ( currentTab.key === '3' ? 1 : 10 ) ? ( currentTab.key === '3' ? 1 : 10 ) : Math.ceil(sortArr[0]) + ( currentTab.key === '3' ? 1 : 10 );
    seriesData.push({
        type:'line',
        name:currentTab.tab,
        data:data.value,
        itemStyle:{
            color:'#4da4fe'
        },
        symbolSize:0,
        markPoint: {
            data: [
                {type: 'max', name: currentTab.tab, symbol:'circle', symbolSize:6 },
                {type: 'min', name: currentTab.tab, symbol:'circle', symbolSize:6 }
            ],
            label:{
                position:[-40,-30],
                formatter:(params)=>{
                    return `{blue|${ params.data.type === 'max' ? '最大值' : '最小值'} : ${params.data.value}}`;
                },
                rich:richStyle
            }
        }
    });
    if ( typeRule && typeRule.warning_min ){
        seriesData.push({
            type:'line',
            symbol:'none',
            itemStyle:{
                color:'#6ec71e'
            },
            data:data.date.map(i=>typeRule.warning_min),
            markPoint:{
                symbol:'rect',
                symbolSize:[100,20],
                data:[ { value:'下限值: '+ typeRule.warning_min, xAxis: data.date.length > 96 ? 96 - 4 : data.date.length - 2, yAxis:typeRule.warning_min } ],
            },
            lineStyle:{
                type:'dashed'
            },
            tooltip:{ show:false }
        });
    }
    if ( typeRule && typeRule.warning_max ){
        seriesData.push({
            type:'line',
            symbol:'none',
            itemStyle:{
                color:'#ff2d2e'
            },
            data:data.date.map(i=>typeRule.warning_max),
            markPoint:{
                symbol:'rect',
                symbolSize:[100,20],
                data:[ { value:'上限值: '+ typeRule.warning_max, xAxis:data.date.length > 96 ? 96 - 4 : data.date.length - 2, yAxis:typeRule.warning_max } ],
            },
            lineStyle:{
                type:'dashed'
            },
            tooltip:{ show:false }
        });
    }
    useEffect(()=>{
        if ( visible ){
            form.setFieldsValue({
                warning_min:typeRule && typeRule.warning_min ? typeRule.warning_min : null,
                warning_max:typeRule && typeRule.warning_max ? typeRule.warning_max : null
            })
        }
    },[visible]);
   
    return (
        <div style={{ height:'100%', position:'relative' }}>
            {
                currentTab.type 
                ?
                <div style={{ position:'absolute', right:'2rem', top:'1rem', zIndex:'10' }} className={style['custom-button'] + ' ' + style['small']} onClick={()=>setVisible(true)} >告警设置</div>   
                :
                null
            }
            <Modal
                visible={visible}
                bodyStyle={{ padding:'2rem 4rem' }}
                footer={null}
                onCancel={()=>setVisible(false)}
            >
                <Form
                    form={form}
                    labelCol={{
                      span: 6,
                    }}
                    wrapperCol={{
                      span: 18,
                    }}
                    onFinish={values=>{
                        new Promise((resolve, reject)=>{
                            dispatch({ type:'gasMonitor/setRule', payload:{ resolve, reject, warning_min:values.warning_min, warning_max:values.warning_max }})
                        })
                        .then(()=>{
                            setVisible(false);
                            form.resetFields();
                        })
                        .catch(msg=>message.error(msg))
                    }}
                >

                    <Form.Item label='当前属性' name='type_code'>
                        <Tag>{ currentTab.tab }</Tag>
                    </Form.Item>
                    <Form.Item label='告警上限值' name='warning_max' rules={[{ type:'number', message:'请输入数值类型', transform(value){ if(value) return Number(value) } }]}>
                        <Input style={{ width:'100%' }} addonAfter={currentTab.unit} />
                    </Form.Item>
                    <Form.Item label='告警下限值' name='warning_min' rules={[{ type:'number', message:'请输入数值类型', transform(value){ if(value) return Number(value) } }]}>
                        <Input style={{ width:'100%' }} addonAfter={currentTab.unit} />
                    </Form.Item> 
                    
                    <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
                        <Button onClick={()=>setVisible(false)} style={{ marginRight:'0.5rem' }}>取消</Button>
                        <Button type="primary" htmlType="submit">设置</Button>
                    </Form.Item>
                </Form>
            </Modal>
            <ReactEcharts
                notMerge={true}
                style={{ width:'100%', height:'100%' }}
                option={{
                    grid:{
                        top:60,
                        bottom:50,
                        left:20,
                        right:20,
                        containLabel:true
                    },

                    tooltip:{
                        trigger:'axis'
                    },
                    xAxis:
                        {
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
                        
                    yAxis:
                        {
                            type:'value',
                            name:currentTab.unit,
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
                    
                    dataZoom: [
                        {
                            show:true,
                            bottom:10,
                            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                            handleSize: '80%',
                            handleStyle: {
                                color: '#fff',
                                shadowBlur: 3,
                                shadowColor: 'rgba(0, 0, 0, 0.6)',
                                shadowOffsetX: 2,
                                shadowOffsetY: 2
                            },
                            startValue:0,
                            endValue: timeType === '2' ? 96 : data.date.length - 1
                        }
                    ],
                    series:seriesData
                }}
            /> 
        </div> 
    )
}
function areEqual(prevProps, nextProps){
    if ( prevProps.data !== nextProps.data || prevProps.typeRule !== nextProps.typeRule || prevProps.theme !== nextProps.theme  ) {
        return false;
    } else {
        return true;
    }
}
export default React.memo(LineChart, areEqual);