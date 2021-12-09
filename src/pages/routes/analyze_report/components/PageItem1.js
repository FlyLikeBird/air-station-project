import React from 'react';
import { Spin } from 'antd';
import Loading from '@/pages/components/Loading';
import PageItem from './PageItem';
import style from '../AnalyzeReport.css';
import IndexStyle from '@/pages/IndexPage.css';
import PieChart from './PieChart';
import RadarChart from './RadarChart';

function PageItem1({ title, data, text, isLoading }){
    console.log(data);
    let loaded = Object.keys(data).length ? true : false;
    const content = (
        <div style={{ height:'100%' }}>
            {
                isLoading 
                ?
                <Loading />
                :
                null
            }
            <div style={{ height:'38%', paddingBottom:'1rem' }}>
                <div className={style['card-container']} style={{ width:'50%' }}>
                    <div className={style['card-title']}>
                        <div className={style['symbol']}></div>
                        <div>本月电费</div>
                    </div>
                    <div className={style['card-content']}>
                        {
                            loaded
                            ?
                            <PieChart data={data.cost} title='电费' unit='元' />
                            :
                            <Spin className={IndexStyle['spin']} />
                        }
                    </div>
                </div>
                <div className={style['card-container']} style={{ width:'50%' }}>
                    <div className={style['card-title']}>
                        <div className={style['symbol']}></div>
                        <div>本月能耗</div>
                    </div>
                    <div className={style['card-content']}>
                        {
                            loaded
                            ?
                            <PieChart data={data.energy} title='电量' unit='kwh' />
                            :
                            <Spin className={IndexStyle['spin']} />
                        }
                    </div>
                </div>
            </div>
            <div style={{ 
                // position:'absolute', 
                // left:'50%', 
                // top:'43%', 
                // transform:'translateX(-50%)',
                width:'400px',
                margin:'1rem auto',
                whiteSpace:'nowrap',
                border:'1px solid #2794ff',
                borderRadius:'4px',
                padding:'4px 16px',
                color:'#fff',
                fontSize:'1.3rem',
                letterSpacing:'2px',
                textAlign:'center'
            }}>
                <span>本月总费用</span><span style={{ color:'#2794ff', fontWeight:'bold' }}>{ data.totalCost ? Math.round(data.totalCost) : 0 }元</span><span>, 平均电价为</span><span style={{ color:'#2794ff', fontWeight:'bold' }}>{ data.elePrice }元</span>
            </div>
            <div style={{ height:'30.3%', paddingBottom:'1rem' }}>
                <div className={style['card-container']} style={{ width:'50%' }}>
                    <div className={style['card-title']}>
                        <div className={style['symbol']}></div>
                        <div>用气体验</div>
                    </div>
                    <div className={style['card-content']}>
                        {
                            loaded
                            ?
                            <RadarChart data={data.grade} />
                            :
                            <Spin className={IndexStyle['spin']} />
                        }
                    </div>
                </div>
                <div className={style['card-container']} style={{ width:'50%' }}>
                    <div className={style['card-title']}>
                        <div className={style['symbol']}></div>
                        <div>用气指标</div>
                    </div>
                    <div className={style['card-content']}>
                        <div className={style['circle-container']}>
                            <div className={style['circle-symbol']}>
                                <div className={style['symbol-text']}>
                                    <span>{ data && data.totalGrade ? Math.round(data.totalGrade) : 0}</span>
                                    <span style={{ fontSize:'1rem' }}>分</span>
                                </div>
                                
                            </div>
                            <div className={style['circle-text']}>用气指标综合评定</div>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ height:'27%', paddingBottom:'1rem' }}>
                <div className={style['card-container']}>
                    <div className={style['card-title']}>
                        <div className={style['symbol']}></div>
                        <div>本月电费</div>
                    </div>
                    <div className={style['card-content']}>
                        {
                            text.map((item,index)=>(
                                <div className={style['desc-text']} key={index}><span className={style['num']}>{ index + 1 }. </span>{ item }</div>

                            ))
                        }
                    </div>
                </div> 
            </div>
        </div>
    )
    return <PageItem title={title} content={content} />
}

function areEqual(prevProps, nextProps){
    if ( prevProps.data !== nextProps.data || prevProps.isLoading !== nextProps.isLoading ){
        return false;
    } else {
        return true;
    }
}
export default React.memo(PageItem1, areEqual);