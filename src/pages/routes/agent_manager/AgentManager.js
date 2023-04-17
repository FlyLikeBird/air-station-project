import React, { useEffect, useState, useRef } from 'react';
import { history } from 'umi';
import { connect } from 'dva';
import { Spin, Select, Input, Tree } from 'antd';
import { RightOutlined, UpOutlined, DownOutlined, AimOutlined } from '@ant-design/icons';
import style from './AgentManager.css';
import IndexStyle from '@/pages/IndexPage.css';
import FullscreenHeader from '@/pages/components/FullscreenHeader';
import AgentMap from './AgentMap';
import LineChart from './LineChart';
import PieChart from './PieChart';
import ScrollTable from '@/pages/components/ScrollTable';
import NumberFormat from '../index_page/components/NumberFormat';
import MachImg from '../../../../public/mach_status_bg.png';
// import MultiLineChart from './MultiLineChart';
// import RegionBarChart from '../alarm_manager/AlarmSum/RegionBarChart';
const { Search } = Input;
const { Option } = Select;

function isFullscreen(){
    return document.fullscreenElement    ||
           document.msFullscreenElement  ||
           document.mozFullScreenElement ||
           document.webkitFullscreenElement || false;
}

function AgentManager({ dispatch, user, agent }){
    let { monitorInfo, treeLoading, treeData, currentNode, companyList } = agent;
    let { userInfo, msg, AMap, containerWidth, authorized } = user;
    let [toggle, setToggle] = useState('1');
    let containerRef = useRef();
    let inputRef = useRef();
    let loaded = Object.keys(monitorInfo).length ? true : false; 
    useEffect(()=>{
        return ()=>{
            dispatch({ type:'gateway/resetMonitorInfo'});
        }
    },[]);
    useEffect(()=>{
        if ( authorized ){
            dispatch({ type:'agent/fetchIndex'});
        }
    },[authorized]);
    return (
        
        <div className={style['container']}>
            
            <FullscreenHeader forAgent={true} />
            {
                authorized && loaded && !treeLoading
                ?
                <AgentMap companyList={monitorInfo.companyList} msg={msg} AMap={AMap} userId={userInfo.user_id} currentNode={currentNode} dispatch={dispatch} />
                :
                null
            }
            <div className={style['middle']}>
                <div>
                    <div style={{ color:'#4a8fd0'}}><AimOutlined style={{ marginRight:'4px' }} />项目数</div>
                    <div>
                        <span style={{ fontSize:'1.6rem', lineHeight:'1.6rem', color:'#fff', textShadow:'3px 2px 8px rgba(4, 158, 227, 0.8)'  }}>{ loaded ? monitorInfo.projectCnt : 0 }</span>
                        <span className={style['unit']} style={{ margin:'0 6px'}}>个</span>
                    </div>
                </div>
                <div>
                    <div style={{ color:'#4a8fd0'}}><AimOutlined style={{ marginRight:'4px' }} />空压站数量</div>
                    <div>
                        <span style={{ fontSize:'1.6rem', lineHeight:'1.6rem', color:'#fff', textShadow:'3px 2px 8px rgba(4, 158, 227, 0.8)' }}>{ loaded ? monitorInfo.stationCnt : 0 }</span>
                        <span className={style['unit']} style={{ margin:'0 6px'}}>个</span>
                    </div>
                </div>
                <div>
                    <div style={{ color:'#4a8fd0'}}><AimOutlined style={{ marginRight:'4px' }} />空压机数量</div>
                    <div>
                        <span style={{ fontSize:'1.6rem', lineHeight:'1.6rem', color:'#fff', textShadow:'3px 2px 8px rgba(4, 158, 227, 0.8)' }}>{ loaded ? monitorInfo.gasDeviceCnt : 0 }</span>
                        <span className={style['unit']} style={{ margin:'0 6px'}}>台</span>
                    </div>
                </div>
            </div>
            {
                userInfo.agent_id 
                ?
                <div className={style['left']}>
                    <Input ref={inputRef} value={!currentNode.type || currentNode.type === 'country' ? '全国' : currentNode.title } className={style['custom-input']} suffix={<DownOutlined />} onClick={()=>{
                        let container = containerRef.current;
                        if ( container ){
                            container.className = style['custom-tree-container'] + ' ' + style['show']
                        }
                    }} />
                    <div ref={containerRef} className={style['custom-tree-container']} onMouseLeave={()=>{
                        let container = containerRef.current;
                        if ( container ){
                            container.className = style['custom-tree-container'] + ' ' + style['hide']
                        }
                        if ( inputRef.current && inputRef.current.input ) inputRef.current.input.blur();
                    }}>                   
                        <div style={{ backgroundColor:'#1890ff', fontSize:'0.8rem', cursor:'pointer', textAlign:'center', padding:'4px 10px' }} onClick={()=>{
                            dispatch({ type:'gateway/toggleCurrentNode', payload:{ key:'zh', type:'country' }});
                        }}>重置</div>
                        {
                            treeLoading 
                            ?
                            null
                            :
                            <Search 
                                placeholder='可输入省/市/区/企业查询'
                                style={{ margin:'1rem 0 1rem 0', padding:'0 1.2rem' }} 
                                className={IndexStyle['custom-search-input']}
                                allowClear={true}
                                onSearch={value=>{
                                    dispatch({ type:'agent/setTree', payload:{ keyword:value }});
                                
                                }}
                            />
                        }
                        {
                            treeLoading 
                            ?
                            <Spin className={IndexStyle['spin']} />
                            :
                            <Tree
                                className={style['custom-tree']}
                                defaultExpandAll={true}
                                // expandedKeys={expandedKeys}
                                // onExpand={temp=>{
                                //     dispatch({ type:'fields/setExpandedKeys', payload:temp });
                                // }}
                                selectedKeys={[currentNode.key]}
                                treeData={treeData}
                                onSelect={(selectedKeys, {node})=>{ 
                                    dispatch({ type:'agent/toggleCurrentNode', payload:node });                                                                                        
                                }}
                            /> 
                        }
                         
                    </div>                   
                </div>
                :
                null
            }
            
            <div className={style['right']}>
                {/* 节省电费 */}
                <div className={style['card-container']} style={{ height:'14%' }}>
                    <div className={style['card-title']}>本月累计节省电费</div>
                    <div className={style['card-content']} style={{ paddingTop:'1rem' }}>
                        {
                            loaded 
                            ?
                            <NumberFormat data={monitorInfo.saveCost  || 0 } containerWidth={user.containerWidth} />
                            :
                            <Spin className={IndexStyle['spin']} />
                        }
                    </div>
                </div>
                {/* 空压机状态 */}
                <div className={style['card-container']} style={{ height:'22%'}}>
                    <div className={style['card-title']}>空压机状态</div>
                    <div className={style['card-content']} style={{ display:'flex', alignItems:'center', paddingTop:'1rem' }}>
                        <div style={{ width:'40%', padding:'1rem' }}><img src={MachImg} style={{ width:'100%' }} /></div>
                        <div className={style['flex-container']} style={{ width:'60%', alignItems:'center' }}>
                            {
                                monitorInfo.infoList 
                                ?
                                monitorInfo.infoList.map((item, index)=>(
                                    <div key={index} style={{ width:'50%' }}>
                                        <div className={style['unit']}>{ item.title }</div>
                                        <div>
                                            <span style={{ fontSize:'1.4rem', lineHeight:'1.4rem', color:item.color || '#fff' }}>{ item.value }</span>
                                            <span className={style['unit']} style={{ marginLeft:'4px' }}>{ item.unit }</span>
                                        </div>
                                    </div>
                                ))
                                :
                                <Spin className={style['spin']} />
                            }                            
                        </div> 
                    </div>
                </div>
                
                {/* 告警排名 */}
                <div className={style['card-container']} style={{ height:'34%' }}>
                    <div className={style['card-title']}>
                        <div>
                            <span className={style['btn'] + ' ' + ( toggle === '1' ? style['selected'] : '' )} onClick={()=>setToggle('1')}>实时告警</span>
                            <span className={style['btn'] + ' ' + ( toggle === '2' ? style['selected'] : '' )} onClick={()=>setToggle('2')}>告警占比</span>
                        </div>
                    </div>
                    <div className={style['card-content']}>
                        {
                            loaded 
                            ?
                            toggle === '1' 
                            ?
                            <ScrollTable 
                                thead={[
                                    { title:'位置', dataIndex:'position_name', width:'22%', collapse:true }, 
                                    { title:'设备', dataIndex:'mach_name', width:'32%', collapse:true }, 
                                    { title:'类型', dataIndex:'type_name', width:'30%', border:true, collapse:true }, 
                                    { title:'发生时间', dataIndex:'last_warning_time', width:'16%', type:'time' }
                                ]}
                                data={ monitorInfo.warningList || []} 
                                scrollNum={5}
                                forIndex={true}                            
                            />
                            :
                            <PieChart data={monitorInfo.warningRatio} />
                            :
                            <Spin className={IndexStyle['spin']} />
                        }
                        
                    </div>
                </div>
                {/* 告警趋势 */}
                <div className={style['card-container']} style={{ height:'30%' }}>
                    <div className={style['card-title']}>近7天告警趋势</div>
                    <div className={style['card-content']}>
                        {
                            loaded
                            ?
                            <LineChart data={monitorInfo.warningView}/>
                            :
                            <Spin className={style['spin']} />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default connect(({ user, agent })=>({ user, agent }))(AgentManager);