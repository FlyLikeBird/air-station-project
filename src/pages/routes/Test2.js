import React, { useEffect, useRef } from 'react';
import airMachBig from '../../../public/air-mach-big.png';
import airMachBlue from '../../../public/air-mach-blue.png';
import airMachGray from '../../../public/air-mach-gray.png';
import airMachYellow from '../../../public/air-mach-yellow.png';
import dryMachBig from '../../../public/dry-mach-big.png';
import dryMachBlue from '../../../public/dry-mach-blue.png';
import dryMachGreen from '../../../public/dry-mach-green.png';
import dryMachWhite from '../../../public/dry-mach-white.png';
import gasMach from '../../../public/gas-mach.png';

// 定义canvas中一个元素（即一个设备对象）的输入口和输出口的方向和位置,绘制线条通过输入口和输出口连接
let smallPadding = 20, largePadding = 40;
let posMaps = {
    '1#空压机':{ img:airMachBig, title:'1#空压机', left:0, top:0, width:125, height:97, inPortDirec:'right', inPortOffset:48, outPortDirec:'right', outPortOffset:48  },
    '4#空压机':{ img:airMachBlue, title:'4#空压机', left:0, top:97 + largePadding , width:90, height:76, outPortDirec:'right', outPortOffset:38  },
    '5#空压机':{ img:airMachYellow, title:'5#空压机', left:0, top: 97 + 76 + largePadding * 2, width:90, height:76, outPortDirec:'right', outPortOffset:38  },
    '2#空压机':{ img:airMachGray, title:'2#空压机', left:0, top:97 + largePadding + ( 76 + largePadding ) * 2, width:90, height:76, outPortDirec:'right', outPortOffset:38  },
    '3#空压机':{ img:airMachGray, title:'3#空压机', left:0, top:97 + largePadding + ( 76 + largePadding ) * 3, width:90, height:76, outPortDirec:'right', outPortOffset:38  },
    '1#储气罐':{ img:gasMach, title:'1#储气罐', left:260, top:20, width:64, height:172, inPortDirec:'left', inPortOffset:50, outPortDirec:'right', outPortOffset:120  },
    '2#储气罐':{ img:gasMach, title:'2#储气罐', left:380, top:20, width:64, height:172, inPortDirec:'left', inPortOffset:50, outPortDirec:'right', outPortOffset:120  },
    '3#储气罐':{ img:gasMach, title:'3#储气罐', left:300, top:300, width:64, height:172, inPortDirec:'left', inPortOffset:50, outPortDirec:'right', outPortOffset:120  },
    '干燥机':{ img:dryMachBig, title:'干燥机', left:560, top:40, width:107, height:179, inPortDirec:'top', inPortOffset:54, outPortDirec:'bottom', outPortOffset:54  },
    '1#冷煤干燥机':{ img:dryMachBlue, title:'1#冷煤干燥机', left:450, top:320, width:78, height:60, inPortDirec:'left', inPortOffset:30, outPortDirec:'right', outPortOffset:30  },
    '2#冷煤干燥机':{ img:dryMachGreen, title:'2#冷煤干燥机', left:450, top:320 + 60 + largePadding, width:78, height:60, inPortDirec:'left', inPortOffset:30, outPortDirec:'right', outPortOffset:30  },
    '3#冷煤干燥机':{ img:dryMachWhite, title:'3#冷煤干燥机', left:450, top:320 + ( 60 + largePadding ) * 2, width:78, height:60, inPortDirec:'left', inPortOffset:30, outPortDirec:'right', outPortOffset:30  },
    // '3#储气罐':{ img:mach6, title:'3#储气罐', left:200, top:200, width:60, height:180, inPortDirec:'left', inPortOffset:30  },
    // '1#干燥机':{ img:mach1, title:'1#空压机', left:380, top:0, width:90, height:70, outPortDirec:'right', outPortOffset:35  },
    // '2#干燥机':{ img:mach2, title:'2#空压机', left:380, top:90, width:90, height:70, outPortDirec:'right', outPortOffset:35  },
    // '3#干燥机':{ img:mach3, title:'3#空压机', left:380, top:180, width:90, height:70, outPortDirec:'right', outPortOffset:35  },
}
let lineWidth = 10;
let lineList = [
    { source:'2#空压机', target:'3#储气罐', point1:{ x:50, y:0 }},
    { source:'3#空压机', target:'3#储气罐', point1:{ x:50, y:0 } },
    { source:'4#空压机', target:'3#储气罐', point1:{ x:50, y:0 } },
    { source:'5#空压机', target:'3#储气罐', point1:{ x:50, y:0 } },
    { source:'3#储气罐', target:'1#冷煤干燥机', point1:{ x:50, y:0 } },
    { source:'3#储气罐', target:'2#冷煤干燥机', point1:{ x:50, y:0 } },
    { source:'3#储气罐', target:'3#冷煤干燥机', point1:{ x:50, y:0 } },
    { source:'1#空压机', target:'1#储气罐', point1:{ x:100, y:0 } },
    { source:'1#储气罐', target:'2#储气罐', point1:{ x:20, y:0 } },
    { source:'1#冷煤干燥机', target:'1#空压机', point1:{ x:50, y:0 }, point2:{ x:-390, y:-80 } },
    { source:'2#冷煤干燥机', target:'1#空压机', point1:{ x:50, y:0 }, point2:{ x:-390, y:-180 } },
    { source:'3#冷煤干燥机', target:'1#空压机', point1:{ x:50, y:0 }, point2:{ x:-390, y:-280 } },
    { source:'2#储气罐', target:'干燥机', point1:{ x:50, y:0 }, point2:{ x:120, y:-120 }}
];

function createPattern(img, xOffset=0, yOffset=0){
    var canvasCreated = document.createElement('canvas');
    canvasCreated.width = 10;
    canvasCreated.height = 10;
    let context = canvasCreated.getContext('2d');
    context.drawImage(img, 10, 0, 10, 10, 0, 0, 10, 10);
    
    return context.createPattern(canvasCreated, 'repeat');
    
}
function Test(){
    let containerRef = useRef();
    useEffect(()=>{
        let container = containerRef.current;
        let svg = document.getElementById('my-svg');
        Object.keys(posMaps).forEach(key=>{
            var g = document.createElementNS("http://www.w3.org/2000/svg",'g');
            var image = document.createElementNS("http://www.w3.org/2000/svg","image");
            var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            image.setAttribute('height',posMaps[key].height);
			image.setAttribute('width',posMaps[key].width);
			image.setAttribute('href', posMaps[key].img);
			image.setAttribute('x',posMaps[key].left);
			image.setAttribute('y',posMaps[key].top);
            text.setAttribute('x',posMaps[key].left + posMaps[key].width/2);
            text.setAttribute('y',posMaps[key].top + posMaps[key].height + 20 );
            text.setAttribute('text-anchor','middle');
            text.setAttribute('alignment-baseline','top');
            text.setAttribute('fill','#03a3fe');
            text.innerHTML = posMaps[key].title;
            g.appendChild(image);
            g.appendChild(text);
            svg.appendChild(g);

        })
        drawLines();
        function drawLines(offset){
            lineList.forEach((item,index)=>{
                let startX = 
                    posMaps[item.source].outPortDirec === 'right' 
                    ? 
                    posMaps[item.source].left + posMaps[item.source].width 
                    : 
                    0;
                let startY = 
                    posMaps[item.source].outPortDirec === 'right' 
                    ? 
                    posMaps[item.source].top + posMaps[item.source].outPortOffset 
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
                console.log(startX, startY);
                console.log(endX, endY);
                let lineLength;  
                let polyLine = document.createElementNS("http://www.w3.org/2000/svg","polyline");
                let path;
                if ( item.point2 ){
                    path = `${startX},${startY} ${startX + item.point1.x},${startY} ${startX + item.point1.x},${startY + item.point2.y} ${startX + item.point1.x + item.point2.x},${startY + item.point2.y} ${startX + item.point1.x + item.point2.x},${endY}`;
                    lineLength = Math.abs(item.point1.x) + Math.abs(item.point2.x) + Math.abs(item.point2.y) + Math.abs(endY - (startY + item.point2.y)); 
                } else if ( item.point1 ){
                    path = `${startX},${startY} ${startX + item.point1.x},${startY} ${startX + item.point1.x},${endY} ${endX},${endY}`;
                    lineLength = ( endX - startX ) + Math.abs( endY - startY );
                }
                polyLine.setAttribute('points', path);               
                polyLine.setAttribute('stroke-width',lineWidth);
                polyLine.setAttribute('stroke','#0c325a');
                polyLine.setAttribute('fill','none');
                svg.appendChild(polyLine);
                // 绘制标明流向的渐变线段
                let symbolPath = document.createElementNS("http://www.w3.org/2000/svg","polyline");
                symbolPath.setAttribute('points',path);
                symbolPath.setAttribute('fill','none');
                symbolPath.setAttribute('stroke-width','4');
                symbolPath.setAttribute('stroke','url(#linear)');
                symbolPath.setAttribute('stroke-dasharray',`${lineLength},${lineLength}`);
                symbolPath.setAttribute('style',`animation:flow-${index} 3s ease-in-out infinite`);
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
        
       
    },[])
    return (
        
        <svg xmlns="http://www.w3.org/2000/svg" id='my-svg' width='1000px' height='700px' style={{ border:'1px solid red', background:'#05050f' }}>
            <defs>
              <linearGradient id="linear" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stop-color="#05a" />
                <stop offset="100%" stop-color="#0a5"/>
              </linearGradient>
            </defs>
        </svg>
            
    )
}

export default Test;
// function getPromise(path){
//     return new Promise((resolve, reject)=>{
//         let image = new Image();
//         image.src = path;
//         image.onload = ()=>{
//             resolve(image);
//         }
//     })
// }
// let loadImages = [arrowTop, arrowBottom, arrowLeft, arrowRight].map(path=>{
//     return getPromise(path);
// });
// let patterns;
// Promise.all(loadImages)
// .then((images)=>{
//     console.log(images);
//     patterns = images.map(img=>createPattern(img));
//     // 查文档pattern的setTransform方法
//     drawLines();
// })
// function drawLines(offset){
//     lineList.forEach(item=>{
//         let startX = 
//             posMaps[item.source].outPortDirec === 'right' 
//             ? 
//             posMaps[item.source].left + posMaps[item.source].width 
//             : 
//             0;
//         let startY = 
//             posMaps[item.source].outPortDirec === 'right' 
//             ? 
//             posMaps[item.source].top + posMaps[item.source].outPortOffset 
//             : 
//             0;
//         let endX = 
//             posMaps[item.target].inPortDirec === 'left' 
//             ?
//             posMaps[item.target].left
//             :0;
//         let endY = 
//             posMaps[item.target].inPortDirec === 'left' 
//             ?
//             posMaps[item.target].top + posMaps[item.target].inPortOffset
//             :
//             0;
//         console.log(startX, startY);
//         console.log(endX, endY);
//         ctx.beginPath();
//         ctx.moveTo(startX, startY);
//         ctx.lineTo(startX + lineOffset, startY );
//         ctx.lineWidth = lineWidth;
//         console.log(patterns);
//         ctx.strokeStyle = patterns[3];
//         ctx.stroke();
//         ctx.beginPath();
//         ctx.moveTo(startX + lineOffset, startY);
//         ctx.lineTo(startX + lineOffset, endY);
//         ctx.strokeStyle = patterns[0];
//         ctx.stroke();
//         ctx.beginPath();
//         ctx.moveTo(startX + lineOffset, endY);
//         ctx.lineTo(endX, endY);
//         ctx.strokeStyle = patterns[2];
//         ctx.stroke();
//     })
// }
// let offset = 0;
// function render(){
//     if ( offset >= 1){
//         offset = 0;
//     }
//     drawLines(offset);
//     offset += 0.01;
//     frameTimer = requestAnimationFrame(render);
// }
// render();