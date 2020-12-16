import React from 'react'
// import {Button} from '@alife/next'

import {IconButtonProps,IconButtonState} from './type'
import s from './index.less';  




export default class IconButton extends React.Component<IconButtonProps,IconButtonState>{
    constructor(props:IconButtonProps){
        super(props);
        // const { data } = props;
        this.state = {
            // activeKey:props.activeKey || data[0].key
        }
    }
    // onChangeButton(data:IconButtongDataItem){ 
    //     const {onChange} = this.props;
    //     this.setState({
    //         activeKey:data.key
    //     })
    //     onChange && onChange(data.key);
    // }
    onClick=()=>{
        const {onClick,disable,type} = this.props;
        if(!disable && onClick){
            onClick(type)
        }
    }
    render(){
        // const {activeKey} = this.state;
        const { title,type,disable,active} = this.props;
        return <div className={`${s.iconButton} ${disable ? s.iconButtonDisable:''} ${active ? s.iconButtonActive:''}`} onClick={this.onClick}>
            <i className={`fc-editor-icon fc-editor-icon-${type}`}></i>
            <div>
                {title}
            </div>
        </div>
        // return <Button.Group>
        //     {
        //         data && data.map((item)=>{
        //             return <Button onClick={this.onChangeButton.bind(this,item)} type={activeKey === item.key ? 'primary': 'normal'} key={item.key}>{item.title}</Button>
        //         })
        //     }
        // </Button.Group>
    }
}