




export function drawLine(context:CanvasRenderingContext2D,x1:number,y1:number,x2:number,y2:number){
    context.beginPath();
    context.moveTo(x1,y1);
    context.lineTo(x2,y2);
    context.closePath(); 
    context.stroke(); 
}

export function drawTextMarker(context:CanvasRenderingContext2D,val:number,x:number,y:number,opt:{
    lineHeight:number,
    fontSize:number,
    padding?:number,
    radius?:number,
    background?:string
    color?:string
}){
    const {lineHeight,fontSize,padding = 4,radius = 8,background,color='#ffffff'} = opt || {};
    x = Math.round(x)
    y = Math.round(y)
    const displayVal = Math.abs(val) + ''
    const textWidth = context.measureText(displayVal).width
    context.fillStyle = this._lineStyle
    const rectWidth = textWidth + 2 * padding
    const rectHeight = fontSize + padding
    fillRoundRect(context,x - rectWidth / 2 ,y - rectHeight/2,rectWidth,rectHeight ,radius,background);
    color && (context.fillStyle = color)
    context.fillText(displayVal,Math.round(x - (textWidth) / 2) ,Math.round(y + lineHeight / 2));
}

export function fillRoundRect(cxt:CanvasRenderingContext2D, x:number, y:number, width:number, height:number, radius:number, /*optional*/ fillColor?:string) {
    //圆的直径必然要小于矩形的宽高       
    const doubleRadius = 2 * radius;   
    if (doubleRadius > width || doubleRadius > height) {
        radius = (width > height ? height : width)
    }

    cxt.save();
    cxt.translate(x, y);
    //绘制圆角矩形的各个边  
    drawRoundRectPath(cxt, width, height, radius);
    fillColor && (cxt.fillStyle = fillColor)
    cxt.fill();
    cxt.restore();
}

export function drawRoundRectPath(cxt:CanvasRenderingContext2D, width:number, height:number, radius:number) {
    cxt.beginPath();
    //从右下角顺时针绘制，弧度从0到1/2PI  
    cxt.arc(width - radius, height - radius, radius, 0, Math.PI / 2);

    //@ts-ignore矩形下边线  
    cxt._lineTo(radius, height);

    //左下角圆弧，弧度从1/2PI到PI  
    cxt.arc(radius, height - radius, radius, Math.PI / 2, Math.PI);

    //@ts-ignore矩形左边线  
    cxt._lineTo(0, radius);

    //左上角圆弧，弧度从PI到3/2PI  
    cxt.arc(radius, radius, radius, Math.PI, Math.PI * 3 / 2);

    //@ts-ignore上边线  
    cxt._lineTo(width - radius, 0);

    //右上角圆弧  
    cxt.arc(width - radius, radius, radius, Math.PI * 3 / 2, Math.PI * 2);

    //@ts-ignore右边线  
    cxt._lineTo(width, height - radius);
    cxt.closePath();
}