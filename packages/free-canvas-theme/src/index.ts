



// const TEXT_COLOR = '#83868E'
// const ACTIVE_TEXT_COLOR = '#EFEFF0'
// const BACKGROUND_1 = '#1A2233'
// const BACKGROUND_2 = '#242C38'
// const BACKGROUND_3 = '#2A3141'
// const BACKGROUND_4 = '#333B4E'
import {ThemeConfig} from './type'
import {createTheme,createVar} from './util'
import DefaultTheme from './base'
import Head from './head'
import Aside from './aside'
import Panel from './panel'
import Button from './button'
import Content from './content';
import Tree from './tree';

export {ITheme} from './type'
export {default as theme} from './base';
export * as themeConst from './constant'

export function initTheme(theme:ThemeConfig = DefaultTheme){
    // return {
    //     HEAD:createTheme(Head,theme,'head'),
    //     ASIDE:createTheme(Aside,theme,'aside'),
    //     PANEL:createTheme(Panel,theme,'panel'),
    //     BUTTON:createTheme(Button,theme,'button')
    // }
    // ALL_THEME.forEach((item)=>{
    //     createTheme(item.theme,theme,item.prefix);
    // })
    createTheme(theme);
}



// const ALL_THEME = [
//     {
//         theme:Head,
//         prefix:'head'
//     },{
//         theme:Aside,
//         prefix:'aside'
//     },{
//         theme:Panel,
//         prefix:'panel'
//     },{
//         theme:Button,
//         prefix:'button'
//     }
// ]
export const ThemeVar = {
    HEAD:createVar(Head),
    ASIDE:createVar(Aside),
    PANEL:createVar(Panel),
    BUTTON:createVar(Button),
    CONTENT:createVar(Content),
    TREE:createVar(Tree)
}

// export const ThemeVar = ALL_THEME.reduce((ret,item)=>{
//     ret[item.prefix.toUpperCase()] = createVar(item.theme,item.prefix);
//     return ret;
// },{} as any)



// const ASIDE_BG = BACKGROUND_2
// const PANEL_BG = BACKGROUND_1
