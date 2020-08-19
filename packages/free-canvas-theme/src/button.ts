

import {BACKGROUND_4_VAR, BACKGROUND_1_VAR,PADDING_3_VAR,PADDING_1_VAR,TEXT_COLOR_VAR} from './constant'
import {ThemeAttr} from './type'

// export default {
//     BACKGROUND:{
//         name:BACKGROUND,
//         identification:BACKGROUND_4_VAR
//     },
//     ACTIVE_BACKGROUND:{
//         name:`${ACTIVE}-${BACKGROUND}`,
//         identification:BACKGROUND_1_VAR
//     }
// }
export default {
    backgroundColor:BACKGROUND_4_VAR,
    activeBackgroundColor:BACKGROUND_1_VAR,
    padding:`${PADDING_1_VAR} ${PADDING_3_VAR}`,
    color:TEXT_COLOR_VAR
}  as ThemeAttr