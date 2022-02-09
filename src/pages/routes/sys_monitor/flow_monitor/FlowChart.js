import React, { useEffect, useRef, useState } from 'react';
import airMach from '../../../../../public/air_mach.png';
import dryMachBig from '../../../../../public/dry_mach_big.png';
import dryMachSmall from '../../../../../public/dry_mach_small.png';
import gasMach from '../../../../../public/gas_mach.png';
import arrow from '../../../../../public/arrow.png';
import onImg from '../../../../../public/status_on.png';
import offImg from '../../../../../public/status_off.png';


let airMachMaps = {
    '01#英格索兰200HP':'ACSUB0752XWS01',
    '02#巨风100HP':'ACSUB0752XWS02',
    '03#巨风50HP':'ACSUB0752XWS03',
    '04#阿特拉斯50HP':'ACSUB0752XWS04',
    '05#阿特拉斯50HP':'ACSUB0752XWS05'
};

let eleMachMaps = {
    '01#英格索兰200HP':'2037000303',
    '02#巨风100HP':'310810305701',
    '03#巨风50HP':'310810305702',
    '04#阿特拉斯50HP':'310810305703',
    '05#阿特拉斯50HP':' 310810305704'
}

// 定义canvas中一个元素（即一个设备对象）的输入口和输出口的方向和位置,绘制线条通过输入口和输出口连接
let smallPadding = 20, largePadding = 40;
let posMaps = {
    '01#英格索兰200HP':{ img:airMach, title:'01#英格索兰200HP', left:0, top:0, width:84, height:84, inPortDirec:'right', inPortOffset:42, outPortDirec:'right', outPortOffset:48  },
    '04#阿特拉斯50HP':{ img:airMach, title:'04#阿特拉斯50HP', left:0, top:84 + largePadding + ( 84 + largePadding ) * 2, width:84, height:84, outPortDirec:'right', outPortOffset:42  },
    '05#阿特拉斯50HP':{ img:airMach, title:'05#阿特拉斯50HP', left:0, top:84 + largePadding + ( 84 + largePadding ) * 3, width:84, height:84, outPortDirec:'right', outPortOffset:42  },
    '03#巨风50HP':{ img:airMach, title:'03#巨风50HP', left:0, top: 84 + 84 + largePadding * 2, width:84, height:84, outPortDirec:'right', outPortOffset:42  },
    '02#巨风100HP':{ img:airMach, title:'02#巨风100HP', left:0, top:84 + largePadding , width:84, height:84, outPortDirec:'right', outPortOffset:42  },
    '1#储气罐':{ img:gasMach, title:'1#储气罐', left:260, top:20, width:64, height:202, inPortDirec:'left', inPortOffset:50, outPortDirec:'right', outPortOffset:120  },
    '2#储气罐':{ img:gasMach, title:'2#储气罐', left:380, top:20, width:64, height:202, inPortDirec:'left', inPortOffset:50, outPortDirec:'right', outPortOffset:120  },
    '3#储气罐':{ img:gasMach, title:'3#储气罐', left:300, top:300, width:64, height:202, inPortDirec:'left', inPortOffset:50, outPortDirec:'right', outPortOffset:120  },
    '离心干燥机':{ img:dryMachBig, title:'离心干燥机', left:560, top:40, width:136, height:180, inPortDirec:'top', inPortOffset:68, outPortDirec:'bottom', outPortOffset:68  },
    '1#冷煤干燥机':{ img:dryMachSmall, title:'1#冷煤干燥机', left:450, top:320, width:84, height:84, inPortDirec:'left', inPortOffset:42, outPortDirec:'right', outPortOffset:42  },
    '2#冷煤干燥机':{ img:dryMachSmall, title:'2#冷煤干燥机', left:450, top:320 + 84 + largePadding, width:84, height:84, inPortDirec:'left', inPortOffset:42, outPortDirec:'right', outPortOffset:42  },
    '3#冷煤干燥机':{ img:dryMachSmall, title:'3#冷煤干燥机', left:450, top:320 + ( 84 + largePadding ) * 2, width:84, height:84, inPortDirec:'left', inPortOffset:42, outPortDirec:'right', outPortOffset:42  },
    '母管':{ img:arrow, title:'', left:920, top:120, width:30, height:30, inPortDirec:'left', inPortOffset:15 }
    // '3#储气罐':{ img:mach6, title:'3#储气罐', left:200, top:200, width:60, height:180, inPortDirec:'left', inPortOffset:30  },
    // '1#干燥机':{ img:mach1, title:'1#空压机', left:380, top:0, width:90, height:70, outPortDirec:'right', outPortOffset:35  },
    // '2#干燥机':{ img:mach2, title:'2#空压机', left:380, top:90, width:90, height:70, outPortDirec:'right', outPortOffset:35  },
    // '3#干燥机':{ img:mach3, title:'3#空压机', left:380, top:180, width:90, height:70, outPortDirec:'right', outPortOffset:35  },
}
let lineWidth = 8;
let lineList = [
    { delay:0, source:'02#巨风100HP', target:'3#储气罐', point1:{ x:50, y:0 }},
    { delay:0, source:'03#巨风50HP', target:'3#储气罐', point1:{ x:50, y:0 } },
    { delay:0, source:'04#阿特拉斯50HP', target:'3#储气罐', point1:{ x:50, y:0 } },
    { delay:0, source:'05#阿特拉斯50HP', target:'3#储气罐', point1:{ x:50, y:0 } },
    { delay:3, source:'3#储气罐', target:'1#冷煤干燥机', point1:{ x:50, y:0 } },
    { delay:3, source:'3#储气罐', target:'2#冷煤干燥机', point1:{ x:50, y:0 } },
    { delay:3, source:'3#储气罐', target:'3#冷煤干燥机', point1:{ x:50, y:0 } },
    { delay:0, source:'01#英格索兰200HP', target:'1#储气罐', point1:{ x:100, y:0 } },
    { delay:3, source:'1#储气罐', target:'2#储气罐', point1:{ x:20, y:0 } },
    { delay:6, source:'1#冷煤干燥机', target:'01#英格索兰200HP', point1:{ x:50, y:0 }, point2:{ x:-420, y:-80 } },
    { delay:6, source:'2#冷煤干燥机', target:'01#英格索兰200HP', point1:{ x:50, y:0 }, point2:{ x:-420, y:-205 } }, 
    { delay:6, source:'3#冷煤干燥机', target:'01#英格索兰200HP', point1:{ x:50, y:0 }, point2:{ x:-420, y:-330 } },
    { delay:6, source:'2#储气罐', target:'离心干燥机', point1:{ x:50, y:0 }, point2:{ x:140, y:-120 }},
    { source:'离心干燥机', target:'母管', point1:{ x:0, y:50}, point2:{ x:100, y:-120 }}
];

function createPattern(img, xOffset=0, yOffset=0){
    var canvasCreated = document.createElement('canvas');
    canvasCreated.width = 10;
    canvasCreated.height = 10;
    let context = canvasCreated.getContext('2d');
    context.drawImage(img, 10, 0, 10, 10, 0, 0, 10, 10);
    
    return context.createPattern(canvasCreated, 'repeat');
    
}
function FlowChart({ dispatch, sumInfo, statusMaps, theme }){
    let containerRef = useRef();
    let [info, setInfo] = useState({});
    useEffect(()=>{
        let container = containerRef.current;
        let svg = document.getElementById('my-svg');
        function handleMouseOver(e){
            if ( !Object.keys(info).length ) {
                let name = e.target.getAttribute('name'); 
                Promise.all([
                    new Promise((resolve, reject)=>{
                        dispatch({ type:'home/fetchAirMachData', payload:{ mach_type:'gas', register_code:airMachMaps[name], resolve, reject }})
                    }),
                    new Promise((resolve, reject)=>{
                        dispatch({ type:'home/fetchAirMachData', payload:{ mach_type:'ele', register_code:eleMachMaps[name], resolve, reject }})
                    })
                ])
                .then(([airData, eleData])=>{
                    
                    let obj = { 
                        title:name,
                        runningStatus:airData.is_running === 0 ? '停机' : '运行',
                        loadingStatus:airData.is_loading === 0 ? '卸载' : '加载',
                        pressure:Math.round(airData.grp_air_out/10).toFixed(1),
                        temp:Math.round(airData.main_tmp_out/10),
                        runningTime:airData.run_time,
                        current:(+eleData.Iavb).toFixed(2)
                    }
                    setInfo(obj);
                })
            }
            
        }
        function handleMouseOut(){
            setInfo({});
        }
        drawLines();
        function drawLines(offset){
            lineList.forEach((item,index)=>{
                let startX = 
                    posMaps[item.source].outPortDirec === 'right' 
                    ? 
                    posMaps[item.source].left + posMaps[item.source].width 
                    : 
                    posMaps[item.source].outPortDirec === 'top' || posMaps[item.source].outPortDirec === 'bottom'
                    ?
                    posMaps[item.source].left + posMaps[item.source].width/2
                    :
                    0;
                let startY = 
                    posMaps[item.source].outPortDirec === 'right' 
                    ? 
                    posMaps[item.source].top + posMaps[item.source].outPortOffset 
                    : 
                    posMaps[item.source].outPortDirec === 'bottom'
                    ?
                    posMaps[item.source].top + posMaps[item.source].height
                    :
                    0;
                let endX = 
                    posMaps[item.target].inPortDirec === 'left' 
                    ?
                    posMaps[item.target].left
                    :
                    posMaps[item.target].inPortDirec === 'top' || posMaps[item.target].inPortDirec === 'bottom'
                    ?
                    posMaps[item.target].left + posMaps[item.target].inPortOffset
                    :0;
                let endY = 
                    posMaps[item.target].inPortDirec === 'left' || posMaps[item.target].inPortDirec === 'right'
                    ?
                    posMaps[item.target].top + posMaps[item.target].inPortOffset
                    :
                    posMaps[item.target].inPortDirec === 'top' 
                    ?
                    posMaps[item.target].top 
                    :
                    posMaps[item.target].inPortDirec === 'bottom' 
                    ?
                    posMaps[item.target].top + posMaps[item.target].height
                    :                                    
                    0;
               
                let lineLength;  
                let polyLine = document.createElementNS("http://www.w3.org/2000/svg","polyline");
                let path;
                if ( item.point2 ){
                    // 
                    if ( posMaps[item.source].outPortDirec === 'right' ) {
                        path = `${startX},${startY} ${startX + item.point1.x},${startY + item.point1.y} ${startX + item.point1.x},${startY + item.point2.y} ${startX + item.point1.x + item.point2.x},${startY + item.point2.y} ${startX + item.point1.x + item.point2.x},${endY + lineWidth}`;
                        lineLength = Math.abs(item.point1.x) + Math.abs(item.point2.x) + Math.abs(item.point2.y) + Math.abs(endY - (startY + item.point2.y)); 
                    } else if ( posMaps[item.source].outPortDirec === 'bottom' ) {
                        path = `${startX},${startY} ${startX + item.point1.x},${startY + item.point1.y} ${startX + item.point2.x},${startY + item.point1.y} ${startX + item.point1.x + item.point2.x},${endY} ${endX},${endY}`;
                        lineLength = Math.abs(item.point1.y) + Math.abs(endY) + Math.abs(item.point2.x) + Math.abs(endX - (startX + item.point2.x)); 
                    }
                } else if ( item.point1 ){
                    path = `${startX},${startY} ${startX + item.point1.x},${startY} ${startX + item.point1.x},${endY} ${endX},${endY}`;
                    lineLength = ( endX - startX ) + Math.abs( endY - startY );
                }
                polyLine.setAttribute('points', path);               
                polyLine.setAttribute('stroke-width',lineWidth);
                polyLine.setAttribute('stroke', theme === 'dark' ? '#0c325a' : '#ddd');
                polyLine.setAttribute('fill','none');
                svg.appendChild(polyLine);
                // 绘制标明流向的渐变线段
                let symbolPath = document.createElementNS("http://www.w3.org/2000/svg","polyline");
                symbolPath.setAttribute('points',path);
                symbolPath.setAttribute('fill','none');
                symbolPath.setAttribute('stroke-width','4');
                symbolPath.setAttribute('stroke','url(#linear)');
                symbolPath.setAttribute('stroke-dashoffset', lineLength);
                symbolPath.setAttribute('stroke-dasharray',`${lineLength},${lineLength}`);
                symbolPath.setAttribute('style',`animation:flow-${index} 3s ease-in-out  infinite`);
                var style = document.createElement('style');
                style.type = 'text/css';
                var keyFrames = 
                   `@keyframes flow-${index}{
                       0% {
                           stroke-dashoffset:${lineLength};
                       }
                       100%{
                           stroke-dashoffset:0;
                       }
                   }`
                style.innerHTML = keyFrames;
                svg.appendChild(symbolPath);
                document.getElementsByTagName('head')[0].appendChild(style);
            })
        }
        Object.keys(posMaps).forEach(key=>{
            var g = document.createElementNS("http://www.w3.org/2000/svg",'g');
            var image = document.createElementNS("http://www.w3.org/2000/svg","image");
            var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            image.setAttribute('height',posMaps[key].height);
			image.setAttribute('width',posMaps[key].width);
			image.setAttribute('href', posMaps[key].img);
			image.setAttribute('x',posMaps[key].left);
			image.setAttribute('y',posMaps[key].top);
            image.setAttribute('name', key);
            g.appendChild(image);
            text.setAttribute('x',posMaps[key].left + posMaps[key].width/2);
            text.setAttribute('y',posMaps[key].top + posMaps[key].height + 20 );
            text.setAttribute('text-anchor','middle');
            text.setAttribute('alignment-baseline','top');
            text.setAttribute('fill','#03a3fe');
            if ( posMaps[key].title ){
                text.innerHTML = posMaps[key].title;
            }
            if ( posMaps[key].title.includes('HP')){
                var statusImg = document.createElementNS("http://www.w3.org/2000/svg","image");
                var label = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                var innerText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                // 绘制状态图像
                // console.log(statusMaps);
                // console.log(posMaps[key]);
                statusImg.setAttribute('height',28);
			    statusImg.setAttribute('width',28);
			    statusImg.setAttribute('href', statusMaps[posMaps[key].title].is_running ? onImg : offImg);
			    statusImg.setAttribute('x',posMaps[key].left + posMaps[key].width / 2);
			    statusImg.setAttribute('y',posMaps[key].top + posMaps[key].height / 2 - 14);
                
                label.setAttribute('x', posMaps[key].left + posMaps[key].width - 20 );
                label.setAttribute('y', posMaps[key].top );
                label.setAttribute('width', 40);
                label.setAttribute('height',20);
                label.setAttribute('rx', 4);
                label.setAttribute('ry', 4);
                label.setAttribute('fill','#059af1');
                
                innerText.setAttribute('x', posMaps[key].left + posMaps[key].width );
                innerText.setAttribute('y', posMaps[key].top + 14);
                innerText.setAttribute('text-anchor','middle');
                innerText.setAttribute('fill', '#fff');
                innerText.innerHTML = statusMaps[posMaps[key].title].is_auto ? '自动' : '手动';
                g.appendChild(statusImg);
                g.appendChild(label);
                g.appendChild(innerText);
                image.setAttribute('class','air-mach');
                image.addEventListener('mouseover', handleMouseOver);
                image.addEventListener('mouseout', handleMouseOut);
            }
            // window.addEventListener('onmouse')
            g.appendChild(text);
            svg.appendChild(g);

        })
        return ()=>{
            let images = svg.getElementsByClassName('air-mach');
            if ( images && images.length ){
                images.forEach((item)=>{
                    item.removeEventListener('mouseover', handleMouseOver);
                    item.removeEventListener('mouseout', handleMouseOut);
                })
            }
        }
       
    },[])
    let infoStyle = {
        display:'flex',
        alignItems:'center',
        color: theme === 'dark' ? '#fff' : 'rgba(0, 0, 0, 0.8)',
        padding:'0.5rem 1rem'
    }
    return (
        <div style={{ width:'80%', height:'96%', margin:'0 auto' }} >
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                id='my-svg' 
                width='100%'
                height='100%' 
                viewBox='0 0 950 680' 
                preserveAspectRatio='xMidYMid meet'
            >
                <defs>
                  <linearGradient id="linear" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%"   stop-color="#059af1" />
                    <stop offset="100%" stop-color="#1e83bd"/>
                  </linearGradient>
                </defs>
            </svg>
            <div style={{ fontSize:'0.8rem', width:'240px', position:'absolute', display:Object.keys(info).length ? 'block':'none', top:'50%', left:'1rem', transform:'translateY(-50%)', backgroundColor: theme === 'dark' ? '#191932' : '#fff', border: theme === 'dark' ? '2px solid #03a3fe' : '2px solid #ddd', borderRadius:'4px' }}>
                <div style={{ fontSize:'1rem', height:'2rem', lineHeight:'2rem', backgroundColor: theme === 'dark' ? '#03a3fe' : '#ddd', textAlign:'center', color: theme ==='dark' ? '#fff' : 'rgba(0, 0, 0, 0.8)' }}>{ info.title }</div>
                <div style={infoStyle}>
                    <div>运行状态</div>
                    <div style={{ flex:'1', height:'1px', backgroundColor:'rgba(0, 0, 0, 0.2)', margin:'0px 6px' }}></div>
                    <div>{ info.runningStatus }</div>
                </div>
                <div style={infoStyle}>
                    <div>加载状态</div>
                    <div style={{ flex:'1', height:'1px', backgroundColor:'rgba(0, 0, 0, 0.2)', margin:'0px 6px' }}></div>
                    <div>{ info.loadingStatus }</div>
                </div>
                <div style={infoStyle}>
                    <div>排气压力</div>
                    <div style={{ flex:'1', height:'1px', backgroundColor:'rgba(0, 0, 0, 0.2)', margin:'0px 6px' }}></div>
                    <div>{ info.pressure + ' ' + 'bar' }</div>
                </div>
                <div style={infoStyle}>
                    <div>排气温度</div>
                    <div style={{ flex:'1', height:'1px', backgroundColor:'rgba(0, 0, 0, 0.2)', margin:'0px 6px' }}></div>
                    <div>{ info.temp + ' ' + '℃' }</div>
                </div>
                <div style={infoStyle}>
                    <div>运行时间</div>
                    <div style={{ flex:'1', height:'1px', backgroundColor:'rgba(0, 0, 0, 0.2)', margin:'0px 6px' }}></div>
                    <div>{ ( info.runningTime || '--' ) + ' ' + '小时' }</div>
                </div>
                <div style={infoStyle}>
                    <div>实时电流</div>
                    <div style={{ flex:'1', height:'1px', backgroundColor:'rgba(0, 0, 0, 0.2)', margin:'0px 6px' }}></div>
                    <div>{ info.current +' ' + 'A' }</div>
                </div>
            </div>
            {/* 母管状态 */}
            <div style={{ fontSize:'0.8rem', width:'240px', position:'absolute', display:'block', top:'162px', right:'60px', transform:'translateY(-50%)', backgroundColor: theme === 'dark' ? '#191932' : '#fff', border: theme === 'dark' ? '2px solid #03a3fe' : '2px solid #ddd', borderRadius:'4px' }}>
                <div style={{ fontSize:'1rem', height:'2rem', lineHeight:'2rem', backgroundColor: theme === 'dark' ? '#03a3fe' : '#ddd', textAlign:'center', color: theme ==='dark' ? '#fff' : 'rgba(0, 0, 0, 0.8)' }}>母管状态</div>
                <div style={infoStyle}>
                    <div>瞬时流量</div>
                    <div style={{ flex:'1', height:'1px', backgroundColor:'rgba(0, 0, 0, 0.2)', margin:'0px 6px' }}></div>
                    <div>{ sumInfo.speed }</div>
                </div>
                <div style={infoStyle}>
                    <div>气体压力</div>
                    <div style={{ flex:'1', height:'1px', backgroundColor:'rgba(0, 0, 0, 0.2)', margin:'0px 6px' }}></div>
                    <div>{ sumInfo.pressure }</div>
                </div>
                <div style={infoStyle}>
                    <div>露点温度</div>
                    <div style={{ flex:'1', height:'1px', backgroundColor:'rgba(0, 0, 0, 0.2)', margin:'0px 6px' }}></div>
                    <div>-- --</div>
                </div>
            </div>
        </div>
            
    )
}

function areEqual(prevProps, nextProps){
    if ( prevProps.sumInfo !== nextProps.sumInfo ) {
        return false;
    } else {
        return true;
    }
}

export default React.memo(FlowChart, areEqual);
