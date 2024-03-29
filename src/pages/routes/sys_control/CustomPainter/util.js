import img1 from '../../../../../public/flow-chart/1.png';
import img2 from '../../../../../public/flow-chart/2.png';
import img3 from '../../../../../public/flow-chart/3.png';
import img4 from '../../../../../public/flow-chart/4.png';
import rectImg from '../../../../../public/flow-chart/graph_rect.png';
import circleImg from '../../../../../public/flow-chart/graph_circle.png';
import ellipseImg from '../../../../../public/flow-chart/graph_ellipse.png';
import triangleImg from '../../../../../public/flow-chart/graph_triangle.png';

export let airMachList = [
    { key:'mach1', type:'Image', title:'空压机1', path:img1, attrs:[{ attrKey:'width', attrName:'模型宽度', attrValue:0 }, { attrKey:'height', attrName:'模型高度', attrValue:0 }] },
    { key:'mach2', type:'Image', title:'空压机2', path:img2, attrs:[{ attrKey:'width', attrName:'模型宽度', attrValue:0 }, { attrKey:'height', attrName:'模型高度', attrValue:0 }] },
    { key:'mach3', type:'Image', title:'空压机3', path:img3, attrs:[{ attrKey:'width', attrName:'模型宽度', attrValue:0 }, { attrKey:'height', attrName:'模型高度', attrValue:0 }] },
    { key:'mach4', type:'Image', title:'空压机4', path:img4, attrs:[{ attrKey:'width', attrName:'模型宽度', attrValue:0 }, { attrKey:'height', attrName:'模型高度', attrValue:0 }] },
];
export let basicGraphs = [
    // width,height 描述边界框的范围
    { key:'Rect', type:'Rect', title:'矩形', path:rectImg, width:200, height:150, attrs:[{ attrKey:'width', attrName:'宽度', attrValue:200 }, { attrKey:'height', attrName:'高度', attrValue:150 }]},
    { key:'Circle', type:'Circle', title:'圆形', path:circleImg, width:100, height:100, attrs:[{ attrKey:'radius', attrName:'半径', attrValue:50 }] },
    { key:'Ellipse', type:'Ellipse', title:'椭圆形', path:ellipseImg, width:240, height:160, attrs:[{ attrKey:'rx', attrName:'横向轴', attrValue:120}, { attrKey:'ry', attrName:'纵向轴', attrValue:80 }]},
    { key:'Triangle', type:'Triangle', title:'三角形', path:triangleImg, width:200, height:150, attrs:[{ attrKey:'width', attrName:'宽度', attrValue:200 }, { attrKey:'height', attrName:'高度', attrValue:150 }]},
];
export let graphs = [
    ...basicGraphs,
    ...airMachList
];
export let graphTypes = graphs.map(i=>i.type.toLowerCase());
export let initMachList = [];
for ( let i=0;i<10;i++ ){
    initMachList.push({ 
        title:`测试电表${i+1}`, 
        key:i+1, 
        subs:[ 
            { title:'电压', key:'u', value:10 + i * 10, unit:'V'}, 
            { title:'电流', key:'ele', value:10 + i * 10, unit:'A'}, 
            { title:'功率', key:'p', value:10 + i* 10, unit:'kw'}
        ]
    })
}
let pathObj = null;
let currentIndex = 1;
let objId = 1;

export function getId(){
    return ++objId;
}

export function wrapperEvents(obj, machList=[]){
    function handleTransform({ e, pointer, transform }){
        let { target } = transform;
        let boundingRect = target.getBoundingRect();
        if ( target.childNode ){
            target.childNode.set({
                left:boundingRect.left + boundingRect.width/2 - target.childNode.width/2,
                top:boundingRect.top + boundingRect.height + 10 
            })
        }
        // 如果有绑定信息框对象，则对象变换时更新信息框的状态
    }
    function handleMouseOver({ e, target }){
        if ( target && target.machId ) {
            let info = machList.filter(i=>i.key === target.machId)[0];
            if ( info ){
                createTooltip(target, info);
            }
        }
    }
    function handleMouseOut({ e, target }){
        if ( target && target.machId ) {
            let infoGroup = target.canvas.getObjects().filter(i=>i.type === 'group' && i.objId === target.objId )[0];
            target.canvas.remove(infoGroup);
        }
    }
    obj.on('moving', handleTransform);
    obj.on('scaling', handleTransform);
    obj.on('rotating', handleTransform);
    obj.on('mouseover', handleMouseOver);
    obj.on('mouseout', handleMouseOut);
}
export function initExports(obj){
    // 扩展对象自身的导出方法
    obj.toObject = (function(toObject){
        return function(){
            let extendObj = 
                this.type === 'polyline' 
                ?
                { objId:this.objId, direc:this.direc, start:this.start ? this.start.objId : null, end:this.end ? this.end.objId : null, strokeLength:this.strokeLength  }
                :
                this.type === 'text' 
                ? 
                { objId:this.objId }
                :
                { objId:this.objId, sourcePath:this.sourcePath, flowArr:this.flowArr && this.flowArr.length ? this.flowArr.map(i=>i.objId) : null } 
            return fabric.util.object.extend(toObject.call(this), extendObj);
        }
    })(obj.toObject)
}
// 线段水平和竖直方向转折点的偏移距离
let horizonOffset = 40;
let verticalOffset = 100;
let direcMaps = {
    'left':{ x:0, y:0.5 },
    'right':{ x:1, y:0.5 },
    'top':{ x:0.5, y:0 },
    'bottom':{ x:0.5, y:1 }
};
export function connectModels( canvas, sourceObj, targetObj, direc, flowId ){
    _connectFromSourceToTarget(canvas, sourceObj, targetObj, direc, flowId);
}

function _connectFromSourceToTarget(canvas, sourceObj, targetObj, direc, flowId){
    let sourceRect = sourceObj.getBoundingRect();
    let targetRect = targetObj.getBoundingRect();
    if ( sourceObj.group ){
        // 将组合中模型对象的相对定位转换成绝对定位
        let groupRect = sourceObj.group.getBoundingRect();
        sourceRect.left = groupRect.left + groupRect.width / 2 + sourceRect.left;
        sourceRect.top = groupRect.top + groupRect.height / 2 + sourceRect.top;
    }
    let points = [];
    let strokeLength = 0;
    let startPoint = { x:sourceRect.left + sourceRect.width, y:sourceRect.top + sourceRect.height / 2 };
    let endPoint = { x:targetRect.left + targetRect.width * direcMaps[direc].x, y:targetRect.top + targetRect.height * direcMaps[direc].y };
    // console.log(startPoint);
    // console.log(endPoint);
    if ( startPoint.x < endPoint.x ){
        if ( direc === 'left' ) {
            strokeLength = endPoint.x - startPoint.x + Math.abs(endPoint.y - startPoint.y);
            points.push(startPoint, { x:endPoint.x - horizonOffset, y:startPoint.y }, { x:endPoint.x - horizonOffset, y:endPoint.y }, endPoint );
        } else if ( direc === 'right' ) {
            strokeLength = endPoint.x - startPoint.x + horizonOffset * 2 + Math.abs(endPoint.y - startPoint.y);
            points.push(startPoint, { x:endPoint.x + horizonOffset, y:startPoint.y }, { x:endPoint.x + horizonOffset, y:endPoint.y }, endPoint );
        } else if ( direc === 'top') {
            strokeLength = Math.abs(endPoint.x - startPoint.x) + Math.abs(endPoint.y - startPoint.y) + horizonOffset * 2;
            points.push(startPoint, { x:startPoint.x + horizonOffset, y:startPoint.y }, { x:startPoint.x + horizonOffset, y:endPoint.y - horizonOffset }, { x:endPoint.x, y:endPoint.y - horizonOffset }, endPoint);
        } else if ( direc === 'bottom') {
            strokeLength = Math.abs(endPoint.x - startPoint.x) + Math.abs(endPoint.y - startPoint.y) + horizonOffset * 2;
            points.push(startPoint, { x:startPoint.x + horizonOffset, y:startPoint.y }, { x:startPoint.x + horizonOffset, y:endPoint.y + horizonOffset }, { x:endPoint.x, y:endPoint.y + horizonOffset }, endPoint);
        }
    } else {
        if ( direc === 'left') {
            strokeLength = Math.abs(endPoint.x - startPoint.x) + horizonOffset * 4 + Math.abs(endPoint.y - startPoint.y) + verticalOffset * 2;
            points.push(startPoint, { x:startPoint.x + horizonOffset, y:startPoint.y }, { x:startPoint.x + horizonOffset, y:endPoint.y - verticalOffset }, { x:endPoint.x - horizonOffset, y:endPoint.y - verticalOffset }, { x:endPoint.x - horizonOffset, y:endPoint.y }, endPoint);
        } else if ( direc === 'right') {
            strokeLength = Math.abs(endPoint.x - startPoint.x) + horizonOffset * 2 + Math.abs(endPoint.y - startPoint.y) + verticalOffset * 2;
            points.push(startPoint, { x:startPoint.x + horizonOffset, y:startPoint.y }, { x:startPoint.x + horizonOffset, y:endPoint.y - verticalOffset }, { x:endPoint.x + horizonOffset, y:endPoint.y -verticalOffset }, { x:endPoint.x + horizonOffset, y:endPoint.y }, endPoint);
        } else if ( direc === 'top') {
            strokeLength = Math.abs(endPoint.x - startPoint.x) + horizonOffset * 2 + Math.abs(endPoint.y - startPoint.y) + horizonOffset * 2;
            points.push(startPoint, { x:startPoint.x + horizonOffset, y:startPoint.y }, { x:startPoint.x + horizonOffset, y:endPoint.y - horizonOffset }, { x:endPoint.x, y:endPoint.y - horizonOffset }, endPoint);
        } else if ( direc === 'bottom') {
            strokeLength = Math.abs(endPoint.x - startPoint.x) + horizonOffset * 2 + Math.abs(endPoint.y - startPoint.y) + horizonOffset * 2 ;
            points.push(startPoint, { x:startPoint.x + horizonOffset, y:startPoint.y }, { x:startPoint.x + horizonOffset, y:endPoint.y + horizonOffset }, { x:endPoint.x, y:endPoint.y + horizonOffset }, endPoint );
        }
    }
    let prevFlowPath = flowId ? sourceObj.flowArr.filter(i=>i.objId === flowId )[0] : null ;
    // 渲染管道，分为两部分，外部的管道对象和内部表示流向的对象
    let id = getId();
    let pipePath = new fabric.Polyline(points,{
        stroke: prevFlowPath ? prevFlowPath.pipePath.stroke : '#cccccc',
        strokeWidth: prevFlowPath ? prevFlowPath.pipePath.strokeWidth : 14,
        fill:'transparent',
        originX:'center',
        originY:'center',
        objId:id,
        hasControls:false
    });
    let flowPath = new fabric.Polyline(points, {
        stroke:prevFlowPath ? prevFlowPath.stroke : '#0000ff',
        fill:'transparent',
        strokeWidth: prevFlowPath ? prevFlowPath.strokeWidth : 8,
        strokeDashArray:[strokeLength, strokeLength],
        originX:'center',
        originY:'center',
        objId:id,
        hasControls:false
    });
    flowPath.direc = direc;
    flowPath.pipePath = pipePath;
    flowPath.start = sourceObj;
    flowPath.end = targetObj;
    flowPath.strokeLength = strokeLength;
    flowPath.lockMovementX = true;
    flowPath.lockMovementY = true;
    pipePath.lockMovementX = true;
    pipePath.lockMovementY = true;
    initExports(pipePath);
    initExports(flowPath);
    startMotion(canvas, flowPath);
    // 将表达流向的状态值保存在源对象和目标对象上，可以一对多
    if ( !sourceObj.flowArr  ) {
        sourceObj.flowArr = [];
    } 
    if ( !targetObj.flowArr ) {
        targetObj.flowArr = [];
    }
    if ( prevFlowPath ) {
        // 如果是流向同一个目标对象，则更新流向
        canvas.remove(prevFlowPath.pipePath);
        canvas.remove(prevFlowPath);
        // 各个对象的流向数组不统一，分别处理
        let sourceNewArr = sourceObj.flowArr.map(i=>{
            if ( i.objId === flowId ) {
                return flowPath;
            } else {
                return i;
            }
        });
        let targetNewArr = targetObj.flowArr.map(i=>{
            if ( i.objId === flowId ) {
                return flowPath;
            } else {
                return i;
            }
        })
        sourceObj.flowArr = sourceNewArr;
        targetObj.flowArr = targetNewArr;
    } else {
        // 如果是流向新的目标对象,则添加新的流向
        sourceObj.flowArr.push(flowPath);
        targetObj.flowArr.push(flowPath);
    } 
    canvas.add(pipePath);
    canvas.add(flowPath);
    // 将管道的渲染层级降至最底层，避免覆盖模型对象
    flowPath.sendToBack();
    pipePath.sendToBack();
}
function startMotion(canvas, flowPath){
    flowPath.set({ strokeDashOffset:flowPath.strokeLength });
    flowPath.animate({ strokeDashOffset:0 }, {
        duration:3000,
        easing: fabric.util.ease.easeOutCubic,
        onChange:canvas.renderAll.bind(canvas),
        onComplete:()=>startMotion(canvas, flowPath)
    });
}
// export function createPath({ canvas, pointer }){
//     if ( !pathObj ){
//         // pathObj临时存储鼠标绘制的points, 等所有点都绘制完毕最后再生成Polyline对象                     
//         pathObj = new fabric.Polyline([{ x, y }],{
//             stroke:'#000',
//             strokeWidth:1,
//             fill:'transparent',
//             objectCaching:false
//         });
//         canvas.add(pathObj);
//     } else {
//         // Polyline添加新的定位点
//         currentIndex++; 
//     }
//     canvas.on('mouse:move', option=>{
//         let { e, pointer:{ x, y }} = option;
//         // console.log(option);
//         if ( pathObj ){
//             let temp = [...pathObj.points];
//             let lastPointPos = temp[currentIndex-1];
//             // console.log(lastPointPos);
//             let k = ( lastPointPos.y - y ) / (x - lastPointPos.x);
//             if ( e.shiftKey ){                          
//                 // console.log(k);
//                 // console.log(x,y);
//                 // 任意角度绘制连接线，当按住Shift键时，只能绘制0,45,90度的连接线
//                 if ( Math.abs((Math.abs(k) - Math.tan(Math.PI/4))) <= 0.3 ) {
//                     let offsetY = Math.abs(( x - lastPointPos.x )) * Math.tan(Math.PI/4);
//                     let newY = y <= lastPointPos.y ? lastPointPos.y - offsetY : lastPointPos.y + offsetY; 
//                     temp[currentIndex] = { x, y: newY };
//                 } else if ( Math.abs(k) < Math.tan(Math.PI/4)) {
//                     temp[currentIndex] = { x, y:lastPointPos.y };
//                 } else {                      
//                     temp[currentIndex] = { x:lastPointPos.x, y };
//                 } 
//             } else {                        
//                 temp[currentIndex] = { x, y };
//             }
//             pathObj.set({
//                 points:temp
//             });
//             canvas.renderAll();
//         }
//     });
// }
// function handlePosition(dim, finalMatrix, fabricObject){
//     let objX = fabricObject.points[this.pointIndex].x - fabricObject.pathOffset.x;
//     let objY = fabricObject.points[this.pointIndex].y - fabricObject.pathOffset.y;
//     let result = fabric.util.transformPoint(
//         { x:objX, y:objY },
//         fabric.util.multiplyTransformMatrices(
//             fabricObject.canvas.viewportTransform,
//             fabricObject.calcTransformMatrix()
//         )
//     )
//     return result;
// }
// function handleAction(evt, transform, x, y){
//     console.log(transform);
//     let target = transform.target;
//     // 视窗坐标系下拖动点和图形对象中心点的距离
//     let center = target.getCenterPoint();
//     let currentControl = target.controls[target.__corner];
//     let absoluteX = x - center.x ;
//     let absoluteY = y - center.y;
//     // 图形坐标系下拖动点和图形对象中心点距离
//     let mouseLocalPosition = target.toLocalPoint(new fabric.Point(x, y), 'center', 'center')
//     console.log('-----');
//     console.log(mouseLocalPosition);
//     let finalPoint = {
//         x:absoluteX + target.pathOffset.x,
//         y:absoluteY + target.pathOffset.y
//     };
//     return true;
// }
// 复制图形对象
let activeObj = null;

export function cloneModel(canvas, target, pointer, onChangeTarget, onCloneFinish){
    // canvas.discardActiveObject();
    target.lockMovementX = true;
    target.lockMovementY = true;    
    if ( target.type === 'activeSelection' ) {
        // clone方法是异步过程，后续操作必须放在回调函数
        // let allPromise = [];
        // target.forEachObject(obj=>{
        //     allPromise.push(new Promise((resolve, reject)=>{
        //         obj.clone((clonedObj)=>{
        //             canvas.add(clonedObj);
        //             resolve(clonedObj);
        //         });
        //     }))          
        // });
        // Promise.all(allPromise).then(([...children])=>{
        //     activeObj = new fabric.ActiveSelection(children, { left:target.left, top:target.top });
        //     activeObj.canvas = canvas;     
        //     activeObj.opacity = 0.5;         
        //     activeObj.initLeft = activeObj.left;
        //     activeObj.initTop = activeObj.top;
        //     canvas.setActiveObject(activeObj);
        // })  
    } else {
        target.clone((clonedObj)=>{
            let newId = getId();
            let textObj = canvas.getObjects().filter(i=>i.type === 'text' && i.objId === clonedObj.objId )[0];
            textObj.clone((clonedText)=>{
                activeObj = clonedObj;
                activeObj.lockRotation = true;
                activeObj.opacity = 0.5;
                clonedText.opacity = 0.5;
                activeObj.flowArr = null;
                activeObj.machId = null;
                activeObj.objId = newId;
                clonedText.objId = newId;
                clonedText.text = clonedText.text + '-副本'; 
                activeObj.initLeft = activeObj.left;
                activeObj.initTop = activeObj.top;
                activeObj.childNode = clonedText;
                canvas.add(clonedText);
                canvas.add(activeObj);
                initExports(activeObj);
                initExports(clonedText);
                canvas.setActiveObject(activeObj);
                if ( onChangeTarget ) onChangeTarget(activeObj);
            })   
        });
    };
    function handleMouseMove({ e }){
        if ( activeObj ){
            let offsetX = e.offsetX - pointer.x;
            let offsetY = e.offsetY - pointer.y;
            activeObj.set({
                left:activeObj.initLeft + offsetX,
                top:activeObj.initTop + offsetY,
            });
            if ( activeObj.childNode ){
                activeObj.childNode.set({
                    left:activeObj.initLeft + offsetX - activeObj.childNode.width / 2,
                    top:activeObj.initTop + offsetY + activeObj.height / 2 + 10
                })
            }
            canvas.renderAll();
        }
    }
    function handleMouseUp(e){
        if ( activeObj ){
            activeObj.opacity = 1;
            if ( activeObj.childNode ){
                activeObj.childNode.opacity = 1;
            }
            wrapperEvents(activeObj);
            canvas.renderAll();
            let temp = canvas.getObjects().filter(i=> graphTypes.includes(i.type) && i.objId !== activeObj.objId);
            if ( onCloneFinish ) onCloneFinish(temp);
        }
        activeObj = null;
        canvas.off('mouse:move', handleMouseMove);
        canvas.off('mouse:up', handleMouseUp);
    }
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);
} 
// 更新管道对象的属性
export function updatePipeAttr(canvas, target, attrName, value, isPipe){
    let pipePath = target.pipePath;
    if ( isPipe && pipePath ){
        pipePath.set({ [attrName]:value });
        canvas.renderAll();
    } else {
        target.set({ [attrName]:value });
        canvas.renderAll();
    }
}
// 更新文本对象的某项属性
export function updateTextAttr(canvas, target, attrName, value ){
    if ( target.childNode ){
        target.childNode.set({
            [attrName === 'fontColor' ? 'fill' : attrName]:value
        });
        if ( attrName === 'text' || attrName === 'fontSize' ) {
            let boundingRect = target.getBoundingRect();
            target.childNode.set({
                left:boundingRect.left + boundingRect.width/2 - target.childNode.width/2,
                top:boundingRect.top + boundingRect.height + 10
            }); 
        }    
        canvas.renderAll();
    }
}
// 更新图形对象的某项属性
export function updateTargetAttr(canvas, target, attrName, value ){
    if ( target ) {
        target.set({
            [attrName]:value
        });
        canvas.renderAll();
        let boundingRect = target.getBoundingRect();
        if ( target.childNode ){
            target.childNode.set({
                left:boundingRect.left + boundingRect.width/2 - target.childNode.width/2,
                top:boundingRect.top + boundingRect.height + 10
            });
            canvas.renderAll();
        }
    } 
}

function _delSingleTarget(canvas, target){
    if ( target.childNode ) {
        canvas.remove(target.childNode);
    }
    if ( target.type === 'polyline' ) {
        // 清除管道和管道相关联的模型对象
        canvas.remove(target.pipePath);
        if ( target.start && target.start.flowArr ) {
            target.start.flowArr = target.start.flowArr.filter(i=>i.objId !== target.objId );
        }
        if ( target.end && target.end.flowArr ){
            target.end.flowArr = target.end.flowArr.filter(i=>i.objId !== target.objId );
        }
    }
    if ( target.flowArr ) {
        // 清除挂载在模型上的所有关联管道
        target.flowArr.forEach(obj=>{
            if ( obj.start && obj.start.flowArr ) {
                obj.start.flowArr = obj.start.flowArr.filter(i=>i.objId !== obj.objId );
            }
            if ( obj.end && obj.end.flowArr ){
                obj.end.flowArr = obj.end.flowArr.filter(i=>i.objId !== obj.objId );
            }
            canvas.remove(obj.pipePath);
            canvas.remove(obj);
        });
        target.flowArr = null;
    } 
    canvas.remove(target);
}
export function delTarget(canvas, currentTarget){
    if ( currentTarget ){
        if ( currentTarget.type === 'activeSelection' || currentTarget.type === 'group' ) {
            currentTarget.forEachObject(obj=>{
                _delSingleTarget(canvas, obj);
            })
        } else {
            _delSingleTarget(canvas, currentTarget);
        }
        canvas.discardActiveObject();
        canvas.renderAll();
    }
}
export let initGraphAttr = { text:'', fontSize:14, fontColor:'#000000', width:0, height:0, radius:0, rx:0, ry:0, scaleX:1, scaleY:1, angle:0, fill:'#cccccc', stroke:'#000000', strokeWidth:1 }
export function getBasicAttrs(target){
    let textObj = target.childNode, text = '', fontSize = 14, fontColor = '#000000';
    let width = target.get('width');
    let height = target.get('height');
    if ( textObj ) {
        text = textObj.get('text');
        fontSize = textObj.get('fontSize');
        fontColor = textObj.get('fill');
    }   
    let radius = target.get('radius');
    let rx = target.get('rx');
    let ry = target.get('ry');
    let scaleX = target.get('scaleX');
    let scaleY = target.get('scaleY');
    let angle = target.get('angle');
    let fill = target.get('fill');
    let stroke = target.get('stroke');
    let strokeWidth = target.get('strokeWidth');
    return { width, height, text, fontSize, fontColor, radius:Math.round(radius), rx:Math.round(rx), ry:Math.round(ry), scaleX:scaleX.toFixed(1), scaleY:scaleY.toFixed(1), angle:angle.toFixed(1), fill, stroke, strokeWidth };
}

// 创建信息框对象
let infoWidth = 160, infoHeight = 70, infoPadding = 20;
export function createTooltip(target, info){
    let infoPos;
    let boundingRect = target.getBoundingRect();
    let topPos = boundingRect.top, 
        leftPos = boundingRect.left;  
    if ( topPos <= infoHeight ) {
        // 默认渲染在对象底部
        infoPos = { left:leftPos + boundingRect.width / 2 - infoWidth / 2, top:boundingRect.top + boundingRect.height + infoPadding };
    } else if ( leftPos <= infoWidth ) {
        // 渲染在对象右侧
        infoPos = { left:leftPos + boundingRect.width + infoPadding, top:boundingRect.top + boundingRect.height / 2 - infoHeight/2 };
    } else if ( leftPos > infoWidth ) {
        // 渲染在对象左侧
        infoPos = { left:leftPos - infoWidth - infoPadding, top:boundingRect.top + boundingRect.height/2 - infoHeight/2 };
    } 
    let infoBg = new fabric.Rect({
        fill:'#cccccc',
        stroke:'#000000',
        strokeWidth:1,
        width:infoWidth,
        height:infoHeight,
    });
    let str1 = '', str2 = '';
    info.subs.forEach(item=>{
        str1 += item.title + '\n';
        str2 += item.value + ' ' + item.unit + '\n'; 
    });
    let textObj1 = new fabric.Text(str1, { fontSize:14, lineHeight:1.5, left:8, top:4 });
    let textObj2 = new fabric.Text(str2, { fontSize:14, lineHeight:1.5, originX:'right', top:4, left:152, textAlign:'right' });
    let infoGroup = new fabric.Group([infoBg, textObj1, textObj2], { ...infoPos, objId:target.objId });
    target.canvas.add(infoGroup);
}
// 保存画布状态
let json = '';
export function savePaint(canvas){
    let obj = canvas.toObject();
    json = JSON.stringify(obj);    
}

export function load(canvas){
    canvas.clear();
    canvas.loadFromJSON(json, function(){
        let textObjs = [], pipeObjs = [], models = [];
        canvas.getObjects().forEach(obj=>{
            initExports(obj);
            if ( obj.type === 'text') {
                textObjs.push(obj);
            } else if ( obj.type === 'polyline' ) {
                pipeObjs.push(obj);
            } else {
                models.push(obj);
            }
        });
        let textIds = textObjs.map(i=>i.objId);
        let pipeIds = pipeObjs.map(i=>i.objId);
        pipeObjs.forEach(obj=>{
            if ( obj.start && obj.end ){
                // 初始化管道的配置信息
                obj.start = models.filter(i=>i.objId === obj.start)[0];
                obj.end = models.filter(i=>i.objId === obj.end)[0];
                obj.pipePath = pipeObjs.filter(i=>i.objId === obj.objId && !i.start )[0];
                startMotion(canvas, obj);
            }
        })
        models.forEach(obj=>{
            wrapperEvents(obj);
            let textIndex = textIds.indexOf(obj.objId);
            if ( textIndex !== -1 ) {
                obj.childNode = textObjs[textIndex];
            }
            if ( obj.type === 'image' ) {
                obj.lockRotation = true;
            }
            obj.flowArr = obj.flowArr && obj.flowArr.length ? obj.flowArr.map(i=>pipeObjs.filter(j=>j.objId === i && j.start )[0]) : null            
        });
    });
}

export function createGrid(canvas){
    let options = {
        distance: 20,
        width: canvas.width,
        height: canvas.height,
        param: {
            stroke: 'rgba(255, 255, 255, 0.1)',
            strokeWidth: 1,
            selectable: false,
            hasControls:false,
            excludeFromExport:true
        }
    };
	let gridLen = ( options.width > options.height ? options.width : options.height) / options.distance;
    for (var i = 0; i < gridLen; i++) {
        var distance   = i * options.distance;
        var horizontal = new fabric.Line([ distance, 0, distance, options.height], options.param);
        var vertical   = new fabric.Line([ 0, distance, options.width, distance], options.param);
        canvas.add(horizontal);
        canvas.add(vertical);
        if(i%5 === 0){
          horizontal.set({stroke: 'rgba(255, 255, 255, 0.2)'});
          vertical.set({stroke: 'rgba(255, 255, 255, 0.2)'});
        };
    }
}
