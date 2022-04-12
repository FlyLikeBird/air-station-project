import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Table, Drawer, message, Popconfirm  } from 'antd';
import { FileAddOutlined } from '@ant-design/icons';
import Loading from '@/pages/components/Loading';
import PlanForm from './PlanForm';
import style from '@/pages/IndexPage.css';

let dotStyle = {
    width:'6px',
    height:'6px',
    borderRadius:'50%',
    display:'inline-block',
    marginRight:'4px'
};
let statusMaps = {
    1:'未下发',
    2:'部分下发成功',
    3:'下发成功',
    4:'下发失败'
};
function PlanManager({ dispatch, user, gasMach }){
    useEffect(()=>{
        dispatch({ type:'gasMach/fetchPlanList'});
        dispatch({ type:'gasMach/fetchPlanMachs'});
    },[])
    let [info, setInfo] = useState({ visible:false, forEdit:false });
    let { isLoading, currentPage, total, planList, planMachs, planDetail } = gasMach;
    let columns = [
        {
            title:'序号',
            width:'60px',
            render:(text,record,index)=>{
                return `${ ( currentPage - 1) * 14 + index + 1}`;
            }
        },
        { title:'方案名称', dataIndex:'plan_name' },
        {
            title:'状态',
            dataIndex:'status',
            render:value=>(
                <span style={{ padding:'0 4px', borderRadius:'4px', backgroundColor:value === 2 || value === 3 ? 'rgba(27, 143, 254, 0.2)' : '#525259', display:'inline-flex', alignItems:'center' }}>
                    <span style={{ ...dotStyle, backgroundColor:value === 2 || value === 3 ? '#1b8ffe' : '#b6b6b6'  }}></span>
                    <span style={{ color:value === 2 || value === 3 ? '#1b8ffe' : '#b6b6b6'}}>{ statusMaps[value] }</span>
                </span>
            )
        },
        { title:'创建时间', dataIndex:'create_date' },
        { title:'推送时间', dataIndex:'push_date', render:value=>(<span>{ value || '-- -- '}</span>) },
        {
            title:'操作',
            render:row=>(
                <div>
                    {
                        row.status === 3
                        ?
                        null
                        :
                        <span style={{ color:'#158afa', marginRight:'1rem', cursor:'pointer' }} onClick={()=>{
                            new Promise((resolve, reject)=>{
                                dispatch({ type:'gasMach/pushPlanAsync', payload:{ resolve, reject, plan_id:row.plan_id }})
                            })
                            .then(()=>{
                                message.success(`${row.plan_name}推送成功`)
                            })
                            .catch(msg=>message.error(msg));
                        }}>推送</span>
                    }
                    <span style={{ color:'#158afa', marginRight:'1rem', cursor:'pointer' }} onClick={()=>{
                        dispatch({ type:'gasMach/fetchPlanDetail', payload:{ plan_id:row.plan_id }});
                        setInfo({ visible:true, forEdit:true })
                    }}>编辑</span>
                    <Popconfirm title='确定删除此方案吗' okText='确定' cancelText='取消' onConfirm={()=>{
                        new Promise((resolve, reject)=>{
                            dispatch({ type:'gasMach/delPlanAsync', payload:{ resolve, reject, plan_id:row.plan_id }})
                        })
                        .then(()=>{
                            message.success(`删除${row.plan_name}成功`);
                        })
                        .catch(msg=>message.error(msg))
                    }}><span style={{ color:'#158afa', marginRight:'1rem', cursor:'pointer' }}>删除</span></Popconfirm>
                </div>
            )
        }
    ]
    return (
        <div className={style['card-container']}>
            {
                isLoading
                ?
                <Loading />
                :
                null
            }
            <div style={{ height:'60px', display:'flex', alignItems:'center', padding:'0 1rem' }}>
                <span className={style['btn']} onClick={()=>setInfo({ visible:true, forEdit:false })}><FileAddOutlined />新增方案</span>
            </div>
            <div style={{ height:'calc( 100% - 60px)'}}>         
                <Table 
                    rowKey='plan_id'
                    columns={columns}
                    dataSource={planList}
                    className={style['self-table-container'] + ' ' + ( user.theme === 'dark' ? style['dark'] : '' ) + ' ' + style['noSpace']}
                    pagination={{
                        current:currentPage,
                        total,
                        pageSize:14,
                        showSizeChanger:false
                    }}
                    locale={{
                        emptyText:<div style={{ height:'140px', lineHeight:'140px' }}>还没有添加方案</div>
                    }}
                    onChange={(pagination)=>{
                        dispatch({ type:'gasMach/fetchPlanList', payload:{ currentPage:pagination.current }});
                    }}
                />
            </div>
            <Drawer 
                visible={info.visible}
                width='50%'
                className={style['custom-drawer']}
                title={ info.forEdit ? planDetail.plan_name  : '新增方案' } 
                placement="right" 
                bodyStyle={{ padding:'24px 40px' }}
                onClose={()=>setInfo({ visible:false, forEdit:false })} 
            >
                <PlanForm 
                    dispatch={dispatch}
                    info={info}
                    planMachs={planMachs}
                    planDetail={planDetail}
                    onClose={()=>setInfo({ visible:false, forEdit:false })}
                />
            </Drawer> 
        </div>
    )
}

export default connect(({ user, gasMach })=>({ user, gasMach }))(PlanManager);

