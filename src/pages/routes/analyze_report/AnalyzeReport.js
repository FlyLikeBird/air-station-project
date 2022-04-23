import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'dva';
import { Spin, DatePicker, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import style from './AnalyzeReport.css';
import IndexStyle from '@/pages/IndexPage.css';
import PageItem1 from './components/PageItem1';
import PageItem2 from './components/PageItem2';
import PageItem3 from './components/PageItem3';
import PageItem4 from './components/PageItem4';
import reportBg from '../../../../public/report_bg.jpg';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Loading from '@/pages/components/Loading';
import zhCN from 'antd/es/date-picker/locale/zh_CN';

let canDownload = false;
function getBase64(dom){
    return html2canvas(dom, { dpi:96, scale:2 })
        .then(canvas=>{
            let MIME_TYPE = "image/png";
            return canvas.toDataURL(MIME_TYPE);
        })
}

function getPromise(dispatch, action){
    return new Promise((resolve, reject)=>{
        // forReport字段为了优化请求流程，不重复请求维度接口，共享维度属性树全局状态
        dispatch({ ...action, payload:{ resolve, reject, forReport:true }});
    })
}


function AnalyzeReport({ dispatch, user, report, cost }){
    let [finishLoading, setFinishLoading] = useState(false);
    let { currentCompany } = user;
    let { isLoading, reportInfo, currentDate } = report;
    let containerRef = useRef();
    let inputRef = useRef();
    let dateStr = currentDate.format('YYYY-MM-DD').split('-');
    useEffect(()=>{
        return ()=>{
            canDownload = false;
        }
    },[]);
    useEffect(()=>{
        if ( user.authorized ){
            Promise.all([
                new Promise((resolve, reject)=>{
                    dispatch({ type:'report/fetchReport', payload:{ resolve, reject }})
                }),
                new Promise((resolve, reject)=>{
                    dispatch({ type:'cost/initSaveCost', payload:{ resolve, reject }})
                })
            ])
            .then(()=>{
                canDownload = true;
            })
            .catch(err=>{
                console.log(err);
            });
        }
    },[user.authorized])
    const handleDownload = ()=>{
        let container = containerRef.current;
        if ( container ){
            let pageDoms = container.getElementsByClassName(style['page-container']);
            Promise.all(Array.from(pageDoms).map(dom=>getBase64(dom)))
            .then(base64Imgs=>{
                // console.log(base64Imgs);
                // 初始比例 870 * 900 
                var pdf = new jsPDF('p', 'px', [522, 540]);
                base64Imgs.map((img, index)=>{
                    pdf.addImage(img, 'JPEG', 0, 0, 522, 540);
                    if ( index === base64Imgs.length - 1 ) return ;
                    pdf.addPage();
                })
                pdf.save(`智慧空压站${dateStr[0]}年${dateStr[1]}月分析报告.pdf`);
                setFinishLoading(false);
                
            })
        }
    };
    // console.log(currentDate.endOf('month'));
    // console.log(currentDate.endOf('month').toDate());
    return (
        <div className={IndexStyle['card-container']} style={{ backgroundColor:'#05050f', position:'relative', overflow: finishLoading ? 'hidden' : 'hidden auto'}}>
            {
                finishLoading 
                ?
                <div className={style['mask']} onClick={e=>e.stopPropagation()}>
                    <div className={style['content']}>
                        <div style={{ color:'#fff' }}>报告生成中，请稍后...</div>
                        <Spin size='large' />
                    </div>
                </div>
                :
                null
            }
            <div className={style['download-btn']} onClick={()=>{
                if ( canDownload ){
                    setFinishLoading(true);
                    handleDownload();
                } else {
                    message.info('数据加载中，请稍后');
                }
            }}><DownloadOutlined style={{ fontSize:'1.2rem' }} /></div>
            <div style={{ position:'fixed', left:'1rem', top:'50%', transform:'translateY(-50%)' }}>
                <div style={{ color:'#fff' }}>当前月份:</div>
                <DatePicker ref={inputRef} className={IndexStyle['custom-date-picker']} locale={zhCN} allowClear={false} picker='month' value={currentDate} onChange={value=>{
                    dispatch({ type:'report/setDate', payload:value });
                    canDownload = false;
                    Promise.all([
                        new Promise((resolve, reject)=>{
                            dispatch({ type:'report/fetchReport', payload:{ resolve, reject }})
                        }),
                        new Promise((resolve, reject)=>{
                            dispatch({ type:'cost/fetchSaveCost', payload:{ resolve, reject }})
                        })
                    ])
                    .then(()=>{
                        canDownload = true;
                    })
                    .catch(err=>{
                        console.log(err);
                    });
                    if ( inputRef.current && inputRef.current.blur ) inputRef.current.blur();
                }} />
            </div>
            <div className={style['container']} ref={containerRef}>
                <div className={style['page-container']} style={{ backgroundImage:`url(${reportBg})`, backgroundColor:'#060022', position:'relative' }}>
                    <div style={{ position:'absolute', right:'2rem', top:'1rem', color:'#04a3fe' }}>{ currentCompany.company_name }</div>
                    <div style={{ position:'absolute', bottom:'1rem', left:'50%', transform:'translateX(-50%)', color:'#04a3fe', fontSize:'1.2rem', fontWeight:'bold' }}>{ `${dateStr[0]}年${dateStr[1]}月`}</div>
                </div>
                <PageItem1 title='本月总览' data={reportInfo.page1 || {}} text={reportInfo.text ? reportInfo.text.page1 : []} isLoading={isLoading} />
                <PageItem2 title='功率分析' data={reportInfo.page2 || {}} text={reportInfo.text ? reportInfo.text.page2 : []} isLoading={isLoading} />
                <PageItem3 title='瞬时流量与压力' data={reportInfo.page3 || {}} text={reportInfo.text ? reportInfo.text.page3 : []} isLoading={isLoading} maxDay={currentDate.endOf('month').toDate().getDate()} />
                <PageItem4 title='节能情况' data={reportInfo.page4 || {}} isLoading={isLoading} stationInfo={cost.saveCost} />
            </div>
        </div>
    )
}

export default connect(({ user, report, cost })=>({ user, report, cost }))(AnalyzeReport);