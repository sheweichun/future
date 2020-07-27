import {
    MOVABLE_CLASSNAME,
    OPERATION_CLASSNAME,
    OPERATION_SIZE_CLASSNAME,
    styleSizeSize,
    styleSizeColor,
    styleSizeHoverColor
} from '../utils/constant'

// .${MOVABLE_CLASSNAME}:hover{
//     outline:${styleSizeHoverColor} solid 1px;
// }
// border:1px solid ${styleSizeColor};
export default `
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
`