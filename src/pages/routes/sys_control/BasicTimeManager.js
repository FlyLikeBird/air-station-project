import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Table, Form, DatePicker, Popconfirm, message  } from 'antd';
import { FileAddOutlined } from '@ant-design/icons';
import Loading from '@/pages/components/Loading';
import PlanForm from './PlanForm';
import style from '@/pages/IndexPage.css';
import zhCN from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';

const EditablCell = ({ editing, dataIndex, title, children, record, ...restProps })=>{
    return (
        <td {...restProps}>
            {
                editing 
                ?
                (<Form.Item
                    name={dataIndex}
                    style={{ margin:'0' }}
                >
                    <DatePicker locale={zhCN} allowClear={false} />
                </Form.Item>)
                :
                (children)
            }
        </td>
    )
}

function BasicTimeManager({ dispatch, user, gasControl }){
    useEffect(()=>{
        dispatch({ type:'gasControl/fetchTimeInfo'});
    },[]);
    const [form] = Form.useForm();
    let { isLoading, timeInfo } = gasControl;
    let [isEditing, setEditing] = useState(false);
    let tableData = Object.keys(timeInfo).length ? [{ name:'未开启智控的基准方案时间段', startDate:timeInfo.begin_date, endDate:timeInfo.end_date }] : [];
    let columns = [
        {
            title:'方案',
            dataIndex:'name',
            width:360
        },
        { title:'开始时间', dataIndex:'startDate', editable:true },
        { title:'结束时间', dataIndex:'endDate', editable:true },
        {
            title:'操作',
            width:160,
            render:row=>(
                isEditing 
                ?
                <div>
                    <span style={{ color:'#158afa', marginRight:'1rem', cursor:'pointer' }} onClick={()=>{
                        form.validateFields()
                        .then(values=>{
                            new Promise((resolve, reject)=>{
                                dispatch({ type:'gasControl/setTimeInfo', payload:{ resolve, reject, begin_date:values.startDate.format('YYYY-MM-DD'), end_date:values.endDate.format('YYYY-MM-DD')}})
                            })
                            .then(()=>{
                                setEditing(false);
                            })
                            .catch(msg=>message.error(msg))
                        })
                    }}>确定</span>
                    <span style={{ color:'#ccc', marginRight:'1rem', cursor:'pointer' }} onClick={()=>setEditing(false)} >取消</span>
                </div>
                :
                <div>                
                    <span style={{ color:'#158afa', marginRight:'1rem', cursor:'pointer' }} onClick={()=>{
                        setEditing(true);
                        form.setFieldsValue({
                            startDate:moment(timeInfo.begin_date),
                            endDate:moment(timeInfo.end_date)
                        })
                    }}>编辑</span>
                </div>
            )
        }
    ];
    let mergedColumns = columns.map(col=>{
        if ( !col.editable ) {
            return col;
        }
        return {
            ...col,
            onCell:record=>({
                record,
                dataIndex:col.dataIndex,
                title:col.title,
                editing:isEditing
            })
        }
    })
    return (
        
                <Form form={form} component={false}>
                    <Table 
                        rowKey='name'
                        style={{ width:'70%', padding:'0', background:'#000' }}
                        columns={mergedColumns}
                        dataSource={tableData}
                        className={style['self-table-container'] + ' ' + style['small'] + ' ' + ( user.theme === 'dark' ? style['dark'] : '' ) + ' ' + style['noSpace']}
                        components={{
                            body:{
                                cell:EditablCell
                            }
                        }}
                        pagination={false}
                    />
                </Form>
           
    )
}

export default connect(({ user, gasControl })=>({ user, gasControl }))(BasicTimeManager);

