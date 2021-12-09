import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Table } from 'antd';
import style from '@/pages/IndexPage.css';

const data = [];
for (let i = 0; i < 60; i++) {
  data.push({
    key: i,
    name: 'John Brown',
    age: i + 1,
    street: 'Lake Park',
    building: 'C',
    number: 2035,
    companyAddress: 'Lake Street 42',
    companyName: 'SoftLake Co',
    gender: 'M',
  });
}
// let columns = [];
// for( var i=0;i<96;i++){
   
//     columns.push({
//         width:'100px',
//         title:'设备' + i,
//         children:[
//             {
//                 title:'Name',
//                 dataIndex:'name',
//                 key:'name'
//             },
//             {
//                 title:'Street',
//                 dataIndex:'street',
//                 key:'name'
//             },
//             {
//                 title:'Gender',
//                 dataIndex:'gender',
//                 key:'name'
//             }
//         ]
//     })
// }
// columns.unshift({
//     width:'100px',
//     title:'属性',
//     dataIndex:'age'
// });
// columns.unshift({
//     width:'100px',
//     title:'设备周期',
//     dataIndex:'number'
// });
function Test3({ dispatch, user, dataReport }){
    let { list, columns, total, currentPage } = dataReport;
    useEffect(()=>{
        if ( user.authorized ){
            dispatch({ type:'user/toggleTimeType', payload:'1' });      
            dispatch({ type:'dataReport/initCostReport', payload:{ type:'running' }});
        }
        
    },[user.authorized]);
    return (
        <div style={{ width:'1920px', overflow:'scroll hidden'}}>
            {/* <table >
                <thead>
                    <tr>
                        {
                            columns.map((item,index)=>(
                                item.children
                                ?
                                <th key={index} colSpan={3}>{ item.title }</th>
                                :
                                <th key={index} rowSpan={2} >{ item.title }</th>
                            ))
                        }
                       
                    </tr>
                    <tr>
                        {
                            columns.map((item,index)=>(
                                item.children && item.children.length 
                                ?
                                item.children.map((inner,j)=>(
                                    <th key={`${index}-${j}`}>{ inner.title }</th>
                                ))
                                :
                                null
                            ))
                        }
                        
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((item,index)=>(
                            <tr key={index}>
                                {
                                    columns.map((col, j)=>(
                                        col.children 
                                        ?
                                        col.children.map((inner, k)=>(
                                            <td key={`${j}-${k}`}>{item[inner.dataIndex]}</td>
                                        ))
                                        :
                                        <td key={j}>{ item[col.dataIndex] }</td>
                                    ))
                                }
                            </tr>
                        ))
                    }
                </tbody>
            </table> */}
            <Table
                className={style['self-table-container'] + ' ' + style['dark']}
                dataSource={list}
                columns={columns}
                rowKey='device_name'
                // onChange={(pagination)=>{
                //     setCurrentPage(pagination.current);
                // }}
                // pagination={{ total, current:currentPage, pageSize:12, showSizeChanger:false }}
            />
        </div>
    )
}

export default connect(({ user, dataReport })=>({ user, dataReport }))(Test3);