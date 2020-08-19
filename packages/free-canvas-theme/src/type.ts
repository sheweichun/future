


export interface IThemeVar{
    [key:string]:ThemeConfig
}

export interface ThemeAttr {
    backgroundColor?:string
    activeBackgroundColor?:string
    color?:string
    activeColor?:string
    borderColor?:string
    activeBorderColor?:string
}


export interface ThemeConfig{
    [key:string]:string
}

export interface ThemeItem{
    [key:string]:{
        value:string,
        label:string,
        var:string
    }
}


export interface ThemeItemData{
    [key:string]:{
        identification:string,
        name:string
    }
}

export interface ITheme{
    [key:string]:ThemeItem
}