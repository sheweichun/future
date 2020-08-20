
import {ThemeConfig,ThemeAttr} from './type';

const docStyle = document.body.style
// export function createTheme(data:ThemeItemData,theme:ThemeConfig,prefix:string):ThemeItem{
//     return Object.keys(data).reduce((ret,key)=>{
//         const item = data[key]
//         const label = `--${prefix}-${item.name}`
//         const value = theme[item.identification]
//         ret[key] = {
//             label,
//             value,
//             var:`var(${label})`
//         }
//         docStyle.setProperty(label,value);
//         return ret;
//     },{} as ThemeItem)
// }
export function createVar(data:ThemeAttr){
    return Object.keys(data).reduce((ret,key:string)=>{
        //@ts-ignore
        const item = data[key] as string;
        const itemArr = item.split(/\s/);
        ret[key] = itemArr.map((el)=>{
            if(/^[A-Z]/.test(el)){
                return `var(--${el})`
            }
            return el;
        }).join(' ')
        return ret;
    },{} as ThemeConfig)
}

export function createTheme(theme:ThemeConfig){
    return Object.keys(theme).forEach((key)=>{
        const item = theme[key]
        const label = `--${key}`
        docStyle.setProperty(label,item);
    })
}