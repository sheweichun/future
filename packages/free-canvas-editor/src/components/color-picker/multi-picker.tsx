// import React,{CSSProperties} from 'react'
// import reactCSS from 'reactcss'
// import {Sketch} from './picker'
// import Alpha from './alpha'
// import {OffsetColorData} from './color-model';
// import {HSLData} from './type'

// export interface MultiPickerProps{
//     data:OffsetColorData[]
// }

// export interface MultiPickerState{
//     data:OffsetColorData[]
//     curIndex:number
// }


// export class MultiPicker extends React.Component<MultiPickerProps,MultiPickerState>{
//     static defaultProps:MultiPickerProps = {
//         data:[{
//             offset:0,
//             color:'#22194D'
//         },{
//             offset:100,
//             color:'#ff0000'
//         }]
//     }
//     constructor(props:MultiPickerProps){
//         super(props)
        
//     }
//     static getDerivedStateFromProps(nextProps:MultiPickerProps, state:MultiPickerState) {
//         const {color} = nextProps
//         if(color !== state.propColor){
//           return {
//             ...Color.toState(color, state.oldHue),
//             propColor:color
//           }
//         }
//       }
//     render(){
//         const styles = reactCSS({
//             default: {
//                 container:{

//                 },
//                 section:{
//                     border:'1px solid var(--BOARDER_COLOR)'
//                 }
//             }
//           }, {
//           })
//         return <div style={styles.container}>
//             <div style={styles.section}>
//                 <Alpha rgb={ rgb } hsl={ hsl }></Alpha>
//             </div>
//             <Sketch></Sketch>
//         </div>
//     }
// }