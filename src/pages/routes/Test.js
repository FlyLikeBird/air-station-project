import React, { useEffect, useRef } from 'react';
import mach1 from '../../../public/1.png';
import mach2 from '../../../public/2.png';
import mach3 from '../../../public/3.png';
import mach4 from '../../../public/4.png';
import mach5 from '../../../public/5.png';
import mach6 from '../../../public/6.png';
import arrow from '../../../public/arrow.png';
import arrowTop from '../../../public/arrow-top.png';
import arrowBottom from '../../../public/arrow-bottom.png';
import arrowLeft from '../../../public/arrow-left.png';
import arrowRight from '../../../public/arrow-right-2.png';

// 定义canvas中一个元素（即一个设备对象）的输入口和输出口的方向和位置,绘制线条通过输入口和输出口连接
let posMaps = {
    '1#空压机':{ img:mach1, title:'1#空压机', left:0, top:0, width:90, height:70, outPortDirec:'right', outPortOffset:35  },
    '2#空压机':{ img:mach2, title:'2#空压机', left:0, top:90, width:90, height:70, outPortDirec:'right', outPortOffset:35  },
    '3#空压机':{ img:mach3, title:'3#空压机', left:0, top:180, width:90, height:70, outPortDirec:'right', outPortOffset:35  },
    '4#空压机':{ img:mach4, title:'4#空压机', left:0, top:270, width:90, height:70, outPortDirec:'right', outPortOffset:35  },
    '5#空压机':{ img:mach5, title:'5#空压机', left:0, top:360, width:90, height:70, outPortDirec:'right', outPortOffset:35  },
    '3#储气罐':{ img:mach6, title:'3#储气罐', left:200, top:200, width:60, height:180, inPortDirec:'left', inPortOffset:30  },

}
let frameTimer;
let lineOffset = 50;
let lineWidth = 10;
let lineList = [
    { source:'1#空压机', target:'3#储气罐' },
    // { source:'2#空压机', target:'3#储气罐'},
    // { source:'3#空压机', target:'3#储气罐'},
    // { source:'4#空压机', target:'3#储气罐'},
    // { source:'5#空压机', target:'3#储气罐'},
]
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
        let canvas = document.getElementById('my-canvas');
        let ctx = canvas.getContext('2d');
        Object.keys(posMaps).forEach(key=>{
            let image = new Image();
            image.src = posMaps[key].img;
            image.onload = ()=>{
                console.log(ctx.drawImage(image, posMaps[key].left, posMaps[key].top ));
            }
        })
        // texture.onload = ()=>{
        //     var pattern = ctx.createPattern(texture,'repeat');
        //     lineList.forEach(item=>{
        //         ctx.beginPath();
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
                
        //         ctx.moveTo(startX, startY);
        //         ctx.lineTo(startX + lineOffset, startY );
        //         ctx.lineTo(startX + lineOffset, endY);
        //         ctx.lineTo(endX, endY);
        //         ctx.lineWidth = lineWidth;
        //         ctx.strokeStyle = pattern;
        //         ctx.stroke();
        //         ctx.closePath();
        //     })
        // }
        let offset = 0;
        function drawLines(offset){
            lineList.forEach(item=>{
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
                    :0;
                let endY = 
                    posMaps[item.target].inPortDirec === 'left' 
                    ?
                    posMaps[item.target].top + posMaps[item.target].inPortOffset
                    :
                    0;
                console.log(startX, startY);
                console.log(endX, endY);
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(startX + lineOffset, startY );
                ctx.lineTo(startX + lineOffset, endY);
                ctx.lineTo(endX, endY);
                ctx.lineWidth = lineWidth;
                ctx.strokeStyle = '#0c325a';
                ctx.stroke();
                // 绘制标明流向的渐变线段
                ctx.beginPath();
                console.log(offset);
                ctx.moveTo(startX + lineOffset, startY);
                ctx.lineTo(startX + lineOffset, startY);
                var gradient1 = ctx.createLinearGradient(startX + lineOffset, startY, startX + lineOffset, startY);
                // gradient1.addColorStop(0, 'transparent');
                gradient1.addColorStop(offset, '#04a3fe');
                gradient1.addColorStop(1, 'transparent');
                ctx.strokeStyle = gradient1;
                ctx.stroke();
                // ctx.stroke();
                // ctx.beginPath();
                // ctx.moveTo(startX + lineOffset, endY);
                // ctx.lineTo(endX, endY);
                // ctx.strokeStyle = patterns[2];
                // ctx.stroke();
                
            })
        }
        function render(){
            if ( offset >= 1){
                offset = 0;
            }
            drawLines(offset);
            offset += 0.01;
            frameTimer = requestAnimationFrame(render);
        }
        // render();
       
    },[])
    return (
        
        <canvas id='my-canvas' width='1000px' height='500px' style={{ border:'1px solid red', background:'#05050f' }}></canvas>
            
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