




export function drawLine(context:CanvasRenderingContext2D,x1:number,y1:number,x2:number,y2:number){
    context.beginPath();
    context.moveTo(x1,y1);
    context.lineTo(x2,y2);
    context.closePath(); 
    context.stroke(); 
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
    cxt.fillStyle = fillColor 
    cxt.fill();
    cxt.restore();
}

export function drawRoundRectPath(cxt:CanvasRenderingContext2D, width:number, height:number, radius:number) {
    cxt.beginPath();
    //从右下角顺时针绘制，弧度从0到1/2PI  
    cxt.arc(width - radius, height - radius, radius, 0, Math.PI / 2);

    //矩形下边线  
    cxt.lineTo(radius, height);

    //左下角圆弧，弧度从1/2PI到PI  
    cxt.arc(radius, height - radius, radius, Math.PI / 2, Math.PI);

    //矩形左边线  
    cxt.lineTo(0, radius);

    //左上角圆弧，弧度从PI到3/2PI  
    cxt.arc(radius, radius, radius, Math.PI, Math.PI * 3 / 2);

    //上边线  
    cxt.lineTo(width - radius, 0);

    //右上角圆弧  
    cxt.arc(width - radius, radius, radius, Math.PI * 3 / 2, Math.PI * 2);

    //右边线  
    cxt.lineTo(width, height - radius);
    cxt.closePath();
}