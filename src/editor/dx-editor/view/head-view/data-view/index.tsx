import React from 'react'
import s from './index.less';
import {DataViewProps,DataViewState} from './type'




export default class DataView extends React.Component<DataViewProps,DataViewState>{
    constructor(props:DataViewProps){
        super(props);
        const {  } = props;
        this.state = {
        }
    }

    render(){
        const {} = this.state;
        const {  } = this.props;
        return <div className={s.dataView}>
            dataview234
        </div>
    }
}