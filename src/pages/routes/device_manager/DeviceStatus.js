import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Table, Modal, Popconfirm, Drawer, message } from 'antd';
import { BarChartOutlined, UpCircleFilled, DownCircleFilled, ExclamationCircleOutlined } from '@ant-design/icons';
import ReactEcharts from 'echarts-for-react';
import Loading from '@/pages/components/Loading';
import RadarChart from './components/RadarChart';
import PieChart from './components/PieChart';
import MachInfoDrawer from './components/MachInfoDrawer';
import style from './DeviceManager.css';
import IndexStyle from '@/pages/IndexPage.css';
import normalIcon from '../../../../public/mach_status_normal.png';
import warningIcon from '../../../../public/mach_status_warning.png';
import rankImg from '../../../../public/mach_status_rank.png';


let infoList = [];
infoList.push({ title:'设备使用时长', value:8533, unit:'h', status:0, statusText:'正常', rank:5, ratio:12.3 });
infoList.push({ title:'平均气电比', value:0.26, unit:'kwh/m³', status:0, statusText:'正常', rank:2, ratio:12.3 });
infoList.push({ title:'最大产气量', value:5.1, unit:'m³', status:0, statusText:'正常', rank:3, ratio:21.3 });
infoList.push({ title:'比功率', value:3.1, unit:'m³/kwh', status:1, statusText:'偏高', rank:7, ratio:43.3 });

let infoList2 = [];
infoList2.push({ mach_name:'空滤器', value:2432, unit:'h', ratio:0 });
infoList2.push({ mach_name:'油滤器', value:848, unit:'h', ratio:46 });
infoList2.push({ mach_name:'油气分离器', value:1542, unit:'h', ratio:17 });
infoList2.push({ mach_name:'润滑脂', value:2912, unit:'h', ratio:0 });

let textList = [];
textList.push({ text:'本机能效过低,建议更换空压机', level:1 });
textList.push({ text:'油分含水量过高，请更换油分', level:1 });
textList.push({ text:'卸载率偏高，易造成能源浪费'});

function DeviceStatus({ dispatch, user, deviceModel }){
    useEffect(()=>{
        if ( user.authorized ){
            dispatch({ type:'deviceModel/initDetail'});
        }
    },[user.authorized]);
    let [info, setInfo] = useState({ visible:false, forEdit:false, machInfo:null });
    let { detailInfo, detailLoading } = deviceModel;
    let [visible, setVisible] = useState(false);
    return (
            <div style={{ height:'100%' }}>
                {
                    detailLoading
                    ?
                    <Loading />
                    :
                    null
                }
                <div style={{ height:'56%'}}>
                    <div className={IndexStyle['card-container-wrapper']} style={{ width:'33.3%' }}>
                        <div className={IndexStyle['card-container']}>
                            <div className={IndexStyle['card-title']} style={{ border:'none', fontSize:'1.2rem', fontWeight:'normal', height:'4rem', lineHeight:'4rem' }}>
                                <div>巨风空气压缩机</div>
                                {
                                    detailInfo.realtime 
                                    ?
                                    <div style={{ display:'inline-flex', alignItems:'center', lineHeight:'1rem' }}>
                                        <span className={style['tag']} style={{ background: detailInfo.realtime.is_running ? '#70ca2a' : 'rgb(254, 44, 45)', padding:'4px 8px', fontSize:'0.8rem' }}>{ detailInfo.realtime.is_running ? '运行' : '停机' }</span>
                                        <img src={rankImg} style={{ marginRight:'6px' }} />
                                        <span style={{ background:'#04a3fe', padding:'4px 8px', fontSize:'0.8rem' }}>1级</span>
                                    </div>
                                    :
                                    null
                                }
                            </div>
                            <div className={IndexStyle['card-content']} style={{ height:'calc( 100% - 4rem)', textAlign:'center' }}>
                                <img src={detailInfo.info ? detailInfo.info.img_url : ''} style={{ height:'74%' }} />
                                <div className={style['tag']} style={{ cursor:'pointer', position:'absolute', bottom:'1rem', left:'50%', transform:'translateX(-50%)', color:'#fff', backgroundColor:'#47475b' }} onClick={()=>setVisible(true)}>设备信息</div>
                            </div>
                        </div>
                    </div>
                    <div className={IndexStyle['card-container-wrapper']} style={{ width:'33.3%' }}>
                        <div className={IndexStyle['card-container']}>
                            <div className={IndexStyle['card-title']} style={{ border:'none', fontSize:'1.2rem', fontWeight:'normal', height:'4rem', lineHeight:'4rem' }}>综合分析</div>
                            <div className={IndexStyle['card-content']} style={{ height:'calc( 100% - 4rem)'}}>
                                <RadarChart />
                            </div>
                        </div>
                    </div>
                    <div className={IndexStyle['card-container-wrapper']} style={{ width:'33.3%' }}>
                        <div className={IndexStyle['card-container']}>
                            <div className={IndexStyle['card-title']} style={{ border:'none', fontSize:'1.2rem', fontWeight:'normal', height:'4rem', lineHeight:'4rem' }}>改善建议</div>
                            <div className={IndexStyle['card-content']} style={{ height:'calc( 100% - 4rem)'}}>
                                {
                                    textList.map((item,index)=>(
                                        <div key={index} style={{ display:'flex', alignItems:'flex-start', padding:'1rem', marginBottom:'1rem', color:'rgba(255, 255, 255, 0.65)', border:'1px solid rgba(255, 255, 255, 0.65)', borderRadius:'6px' }}>
                                            <ExclamationCircleOutlined style={{ fontSize:'1.4rem', marginRight:'6px', color:item.level === 1 ? '#fe2c2d' : '#f8b83c' }} />
                                            <div>{ item.text }</div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ height:'22%'}}>
                    {
                        infoList.map((item,index)=>(
                            <div className={IndexStyle['card-container-wrapper']} style={{ width:'25%', paddingRight:index === infoList.length - 1 ? '0' : '1rem' }} key={index}>
                                <div className={IndexStyle['card-container']} style={{ overflow:'hidden', padding:'1rem 2rem', display:'flex', flexDirection:'column', justifyContent:'space-around' }}>
                                    <div style={{ color:'#fff' }}>{ item.title }</div>
                                    <div>
                                        <span className={style['data']}>{ item.value }</span>
                                        <span className={style['unit']}>{ item.unit }</span>
                                        <span style={{ color:item.ratio <= 0 ? '#afff72' : '#fe2c2d', marginLeft:'1rem', fontSize:'1.2rem' }}>{ item.ratio <= 0 ? <DownCircleFilled /> : < UpCircleFilled />}</span>
                                        <span style={{ color:item.ratio <= 0 ? '#afff72' : '#fe2c2d', fontSize:'1.2rem' }}>{ item.ratio + '%' } </span>
                                    </div>
                                    <div>
                                        <span className={style['tag']}>
                                            <img src={item.status ? warningIcon : normalIcon } style={{ marginRight:'4px' }} />
                                            <span style={{ color:item.status ? '#ffb766' : '#afff72'}}>{ item.statusText }</span>
                                        </span>
                                        <span className={style['tag']}>
                                            <BarChartOutlined style={{ marginRight:'4px' }} />
                                            <span>{ item.rank }</span>
                                            <span style={{ color:'rgba(255, 255, 255, 0.55)'}}>/15</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div style={{ height:'22%'}}>
                    <div className={IndexStyle['card-container']} style={{ padding:'1rem', overflow:'hidden' }}>
                        <div style={{ color:'#fff', marginBottom:'6px' }}>保养参数</div>
                        <div style={{ height:'80%' }}>
                            {
                                infoList2.map((item,index)=>(
                                    <div key={index} style={{ display:'inline-flex', alignItems:'center',  justifyContent:'space-around', width:'18%', height:'100%', background:'#28284a', marginRight:'1rem', borderRadius:'10px' }}>
                                        <div>
                                            <div className={style['unit']}>{ item.mach_name + '使用时间'}</div>
                                            <div>
                                                <span className={style['data']}>{ item.value }</span>
                                                <span className={style['unit']}>{ item.unit }</span>
                                            </div>
                                        </div>
                                        <div>
                                            <PieChart data={item} />
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <Drawer 
                    visible={visible}
                    width='52%'
                    className={IndexStyle['custom-drawer']}
                    placement="right" 
                    bodyStyle={{ padding:'24px' }}
                    onClose={()=>setVisible(false)} 
                >
                    <MachInfoDrawer data={detailInfo} />
                </Drawer>
            </div>
    )
}

export default connect(({ user, deviceModel })=>({ user, deviceModel }))(DeviceStatus);