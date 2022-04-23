import React from 'react';
import { Table, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import Loading from '@/pages/components/Loading';
import PageItem from './PageItem';
import style from '../AnalyzeReport.css';
import IndexStyle from '@/pages/IndexPage.css';
import MultiBarChart from '../../cost_manager/cost_save/MultiBarChart';

let infoList = [
    { title:'基准成本', color:'#1b8ffe', result:'old_cost', child:[{ text:'当前总用气量', key:'total_gas', unit:'m³'}, { text:'基准气电比', key:'collect_ele_gas_ratio', unit:'kwh/m³', hasTooltip:true }, { text:'当前电价', key:'ele_price', unit:'元/kwh', hasTooltip:true }]},
    { title:'智控成本', color:'rgb(84 195 57)', result:'total_cost', child:[{ text:'当前总用气量', key:'total_gas', unit:'m³'}, { text:'当前气电比', key:'ele_gas_ratio', unit:'kwh/m³', hasTooltip:true }, { text:'当前电价', key:'ele_price', unit:'元/kwh', hasTooltip:true }]}
]
function PageItem4({ title, data, stationInfo, isLoading }){
    let { avgPower, avgPressure, avgSpeed, elePrice, loadRatio, loadTime, runTime, saveCost } = data.realtimeParam || {};
    const content = (
        <div style={{ height:'100%' }}>
            {
                isLoading 
                ?
                <Loading />
                :
                null
            }
            <div style={{ height:'13%', paddingBottom:'1rem' }}>
                <div className={style['card-container']}>
                    <div style={{ position:'absolute', left:'80px' }}>
                        当前共节俭成本
                        <span style={{ marginLeft:'4px', color:'#fff', padding:'4px 10px', backgroundColor:'rgb(84 195 57)', fontSize:'1.2rem', borderRadius:'6px' }}>{ stationInfo.info ? stationInfo.info['save_cost'] : 0 }元</span>
                    </div>
                    <div className={style['card-title']}>
                        <div className={style['symbol']}></div>
                        <div>节能目标</div>
                    </div>
                    <div className={style['card-content']}>
                        {/* <div>目前空压系统年运行时间<span className={style['data']}>{`${runTime} 小时`}</span>，电价<span className={style['data']}>{`${elePrice} 元/kwh`}</span>，节能金额<span className={style['data']}>{`${saveCost ? Math.round(saveCost) : 0 } 元`}</span></div> */}
                        {
                            infoList.map((item,index)=>(
                                <div style={{ margin:'10px 0'}}>
                                    {
                                        item.child.map((sub, j)=>(
                                            <span>
                                                <span style={{ color:'rgba(255, 255, 255, 0.6)' }}>{ sub.text }</span>
                                                {
                                                    sub.hasTooltip 
                                                    ?
                                                    <Tooltip overlayStyle={{ maxWidth:'unset' }} title={<div style={{ whiteSpace:'nowrap' }}>{ stationInfo.info ? stationInfo.info[sub.key] : '' }</div>}>
                                                        <span style={{ margin:'0 4px', cursor:'pointer' }}>{ stationInfo.info ? sub.hasTooltip ? (stationInfo.info[sub.key]).toFixed(4): stationInfo.info[sub.key] : 0 } { sub.unit }</span>
                                                    </Tooltip>
                                                    :
                                                    <span style={{ margin:'0 4px'}}>{ stationInfo.info ? sub.hasTooltip ? (stationInfo.info[sub.key]).toFixed(4): stationInfo.info[sub.key] : 0 } { sub.unit }</span>
                                                }                                              
                                                <span style={{ margin:'0 4px'}}>{ j === item.child.length - 1 ? '=' : 'x' }</span>
                                            </span>
                                        ))
                                    }
                                    <span>{ item.title }</span>
                                    <span style={{ marginLeft:'4px', color:'#fff', padding:'4px 10px', backgroundColor:item.color, fontSize:'1.2rem', borderRadius:'6px' }}>{ stationInfo.info ? stationInfo.info[item.result] : 0 }元</span>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
            <div style={{ height:'40%', paddingBottom:'1rem' }}>
                <div className={style['card-container']}>
                    <div className={style['card-title']}>
                        <div className={style['symbol']}></div>
                        <div>节能对比</div>
                    </div>
                    <div className={style['card-content']}>
                        {
                            Object.keys(stationInfo).length 
                            ?
                            <MultiBarChart data={stationInfo.view} timeType='2' forReport={true} />
                            :
                            null
                        }
                    </div>
                </div>
            </div>
            <div style={{ height:'30%', paddingBottom:'1rem' }}>
                <div className={style['card-container']}>
                    <div className={style['card-title']}>
                        <div className={style['symbol']}></div>
                        <div>气站运行参数</div>
                    </div>
                    <div className={style['card-content']}>
                        <table className={style['table-container']}>
                            <thead>
                                <tr>
                                    <th style={{ width:'260px'}}>项目</th>
                                    <th style={{ width:'100px'}}>单位</th>
                                    <th>本月数据</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ width:'260px'}}>平均系统压力</td>
                                    <td>bar</td>
                                    <td>{ avgPressure || 0 }</td>
                                </tr>
                                <tr>
                                    <td style={{ width:'260px'}}>平均瞬时流量</td>
                                    <td>m³/min</td>
                                    <td>{ avgSpeed || 0 }</td>
                                </tr>
                                <tr>
                                    <td style={{ width:'260px'}}>平均功率</td>
                                    <td>kw</td>
                                    <td>{ avgPower || 0 }</td>
                                </tr>
                                <tr>
                                    <td style={{ width:'260px'}}>空压机累计运行时间</td>
                                    <td>小时</td>
                                    <td>{ runTime || 0 }</td>
                                </tr>
                                <tr>
                                    <td style={{ width:'260px'}}>空压机累计加载时间</td>
                                    <td>小时</td>
                                    <td>{ loadTime || 0 }</td>
                                </tr>
                                <tr>
                                    <td style={{ width:'260px'}}>稼动率</td>
                                    <td>%</td>
                                    <td>{ loadRatio || 0 }</td>
                                </tr>
                                <tr>
                                    <td style={{ width:'260px'}}>电单价</td>
                                    <td>元</td>
                                    <td>{ elePrice || 0 }</td>
                                </tr>
                                <tr>
                                    <td style={{ width:'260px'}}>节省成本</td>
                                    <td>元</td>
                                    <td>{ stationInfo.info ? stationInfo.info['save_cost'] : 0 }</td>
                                </tr>
                            </tbody>
                        </table>
                        
                    </div>
                </div>
            </div>
            
        </div>
    )
    return <PageItem title={title} content={content} />
}
function areEqual(prevProps, nextProps){
    if ( prevProps.data !== nextProps.data || prevProps.isLoading !== nextProps.isLoading || prevProps.stationInfo !== nextProps.stationInfo ){
        return false;
    } else {
        return true;
    }
}
export default React.memo(PageItem4, areEqual);