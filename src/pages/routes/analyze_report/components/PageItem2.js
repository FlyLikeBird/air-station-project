import React from 'react';
import PageItem from './PageItem';
import { Spin } from 'antd';
import Loading from '@/pages/components/Loading';
import IndexStyle from '@/pages/IndexPage.css';
import style from '../AnalyzeReport.css';
import LineSymbolChart from './LineSymbolChart';
import BarChart from './BarChart';

function PageItem2({ title, data, text, isLoading }){
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
            <div style={{ height:'10%', paddingBottom:'1rem' }}>
                <div className={style['card-container']}>
                    <div className={style['card-title']}>
                        <div className={style['symbol']}></div>
                        <div>总体情况</div>
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
            <div style={{ height:'43.3%', paddingBottom:'1rem' }}>
                <div className={style['card-container']}>
                    <div className={style['card-title']}>
                        <div className={style['symbol']}></div>
                        <div>本月日单耗(气电比)</div>
                    </div>
                    <div className={style['card-content']}>
                        {
                            loaded
                            ?
                            <LineSymbolChart xData={data.date} yData={data.airEleRatio} unit='kwh/m³' theme='dark' />
                            :
                            <Spin className={IndexStyle['spin']} />
                        }
                    </div>
                </div>
            </div>
            <div style={{ height:'43.3%', paddingBottom:'1rem' }}>
                <div className={style['card-container']}>
                    <div className={style['card-title']}>
                        <div className={style['symbol']}></div>
                        <div>每立方用电成本</div>
                    </div>
                    <div className={style['card-content']}>
                        {
                            loaded
                            ?
                            <LineSymbolChart xData={data.date} yData={data.airCostRatio} unit='元' theme='dark' />
                            :
                            <Spin className={IndexStyle['spin']} />
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
export default React.memo(PageItem2, areEqual);