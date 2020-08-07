import {
    MOVABLE_CLASSNAME,
    OPERATION_CLASSNAME,
    OPERATION_SIZE_CLASSNAME,
    styleSizeSize,
    styleSizeColor,
    CONTAINER,
    DRAG_OVER,
    MOVABLE_HANDLER_CLASSNAME,
    REFRESH_BUTTON_CLASSNAME,
    ARTBOARD_HORIZONTAL_GUIDE,
    ARTBOARD_VERTICAL_GUIDE,
    CONTEXT_MEUNU,
    CONTEXT_MEUNU_ITEM,
    styleSizeHoverColor
} from '../utils/constant'

// .${MOVABLE_CLASSNAME}:hover{
//     outline:${styleSizeHoverColor} solid 1px;
// }
// border:1px solid ${styleSizeColor};
export default `
    body{
        width:100vw;
        height:100vh;
        margin:0;
        font-size:12px;
    }
    @font-face {
        font-family: 'iconfont';  /* project id 1991465 */
        src: url('//at.alicdn.com/t/font_1991465_apeud2i6o4j.eot');
        src: url('//at.alicdn.com/t/font_1991465_apeud2i6o4j.eot?#iefix') format('embedded-opentype'),
        url('//at.alicdn.com/t/font_1991465_apeud2i6o4j.woff2') format('woff2'),
        url('//at.alicdn.com/t/font_1991465_apeud2i6o4j.woff') format('woff'),
        url('//at.alicdn.com/t/font_1991465_apeud2i6o4j.ttf') format('truetype'),
        url('//at.alicdn.com/t/font_1991465_apeud2i6o4j.svg#iconfont') format('svg');
    }
    .icon{
        font-family:'iconfont'
    }
    .icon-restore{
        font-family:'iconfont'
    }
    .icon-restore:before{
        content:\E676;
    }
    .${REFRESH_BUTTON_CLASSNAME}{
        position:absolute;
        font-family:'iconfont';
        left:0;
        top:0;
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:14px;
        cursor:pointer;
        background-color: rgb(219 219 219);
        z-index:99999;
    }
    body *{
        user-select: none;
    }
    .${DRAG_OVER} *{
        pointer-events:none;
    }
    .${CONTAINER}{
        width:100%;
        height:100%;
        position:absolute;
        background-color:#F9F9F9;
        overflow: hidden;
    }
    .${MOVABLE_CLASSNAME}{
        box-sizing:border-box;
    }
    .${OPERATION_CLASSNAME}{
        z-index:10000;
        position:absolute;
        box-sizing:border-box;
        outline:${styleSizeColor} 1px solid ;
    }
    .${OPERATION_SIZE_CLASSNAME}{
        border:1px solid ${styleSizeColor};
        width: ${styleSizeSize}px;
        height: ${styleSizeSize}px;
        position:absolute;
        background-color:white;
        box-sizing:border-box;
        box-shadow:0 0 3px 1px ${styleSizeColor};
    }
    .${ARTBOARD_HORIZONTAL_GUIDE}{
        position:absolute;
        height:0;
        border-top:1px solid #EB5648;
        background-clip: content-box;
    }
    .${ARTBOARD_HORIZONTAL_GUIDE}:before{
        content:attr(data-value);
        position:absolute;
        color:#EB5648;
        transform: rotate(270deg) translate(100%, 0px);
        top:-1px;
    }
    .${ARTBOARD_VERTICAL_GUIDE}{
        position:absolute;
        width:0;
        border-left:1px solid #EB5648;
        background-clip: content-box;
    }
    .${ARTBOARD_VERTICAL_GUIDE}:before{
        content:attr(data-value);
        position:absolute;
        color:#EB5648;
    }
    .${CONTEXT_MEUNU}{
        box-shadow: rgba(39, 54, 78, 0.08) 0px 2px 10px 0px, rgba(39, 54, 78, 0.1) 0px 12px 40px 0px;
        z-index: 999;
        background: rgb(255, 255, 255);
    }
    .${CONTEXT_MEUNU_ITEM}{
        color: rgb(65, 80, 88);
        width: 100%;
        height: 26px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0px 12px;
    }
    .${CONTEXT_MEUNU_ITEM}:hover{
        cursor: pointer;
        color: rgb(41, 141, 248);
        background: rgb(242, 242, 242);
    }

    .${MOVABLE_HANDLER_CLASSNAME}{
        position:absolute;
        left:0;
        top:0;
        right:0;
        height:30px;
        cursor:pointer;
        color: rgb(169, 175, 184);
        display:flex;
        align-items: center;
        transform:translate(0,-100%);
    }
    .${MOVABLE_HANDLER_CLASSNAME}:hover{
        color: rgb(41, 141, 248);
    }
`