import {
    MOVABLE_CLASSNAME,
    MOVABLE_ITERATOR_CLASSNAME,
    MOVABLE_ITERATOR_HOVER_CLASSNAME,
    OPERATION_CLASSNAME,
    OPERATION_SIZE_CLASSNAME,
    styleSizeSize,
    styleSizeColor,
    OPERATION_TAGNAME_CLASSNAME,
    CONTAINER,
    WRAPPER,
    DRAG_OVER,
    MOVABLE_HANDLER_CLASSNAME,
    REFRESH_BUTTON_CLASSNAME,
    ARTBOARD_HORIZONTAL_GUIDE,
    ARTBOARD_VERTICAL_GUIDE,
    CONTEXT_MEUNU,
    CONTEXT_MEUNU_ITEM,
    CONTEXT_MEUNU_ITEM_SECTION,
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
        overflow: hidden;
    }
    @font-face {
        font-family: 'iconfont';  /* project id 1991465 */
        src: url('//at.alicdn.com/t/font_1991465_almejotxmju.eot');
        src: url('//at.alicdn.com/t/font_1991465_almejotxmju.eot?#iefix') format('embedded-opentype'),
        url('//at.alicdn.com/t/font_1991465_almejotxmju.woff2') format('woff2'),
        url('//at.alicdn.com/t/font_1991465_almejotxmju.woff') format('woff'),
        url('//at.alicdn.com/t/font_1991465_almejotxmju.ttf') format('truetype'),
        url('//at.alicdn.com/t/font_1991465_almejotxmju.svg#iconfont') format('svg');
    }
    .icon{
        font-family:'iconfont'
    }
    .icon-restore{
        font-family:'iconfont'
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
    }
    .${WRAPPER}{
        width:100%;
        height:100%;
    }
    .${WRAPPER}:focus{
        outline:none;
    }
    .${MOVABLE_CLASSNAME}{
        box-sizing:border-box;
 
    }
    .${MOVABLE_ITERATOR_CLASSNAME}{
        cursor: not-allowed;
    }
    .${MOVABLE_ITERATOR_CLASSNAME}:hover:after{
        content:'';
        display:block;
        position:absolute;
        width:100%;
        height:100%;
        left:0;
        top:0;
        background: #efefef91;
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

        box-shadow: rgb(8 8 8 / 44%) 0px 4px 6px 1px;
        z-index: 999;
        background: var(--BACKGROUND_3);
        border-radius:4px;
        overflow:hidden;
        padding:0 0;
    }
    .${CONTEXT_MEUNU_ITEM_SECTION}{
        border-bottom:1px solid #737373;
        padding:4px 0;
    }
    .${CONTEXT_MEUNU_ITEM_SECTION}:last-child{
        border-bottom:0;
    }
    .${CONTEXT_MEUNU_ITEM}{
        color: var(--ACTIVE_TEXT_COLOR);
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 6px 12px;
    }
    .${OPERATION_TAGNAME_CLASSNAME}{
        position:absolute;
        transform:translate3d(0,-100%,0);
        color:var(--NEGTIVE_TEXT_COLOR);
        padding:1px 4px;
        background-color:var(--HIGHLIGHT_BORDER_COLOR);
    }
    .${CONTEXT_MEUNU_ITEM}:hover{
        cursor: pointer;
        color:var(--HIGHTLIGHT_TEXT_COLOR);
        background: var(--HIGHTLIGHT_COLOR);
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

        //box-shadow: rgba(39, 54, 78, 0.08) 0px 2px 10px 0px, rgba(39, 54, 78, 0.1) 0px 12px 40px 0px;