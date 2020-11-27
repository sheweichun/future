// import React,{useRef,useLayoutEffect}  from 'react';
// import {Market,Header,Panel} from '@pkg/free-canvas-editor'
// import {IPlugin} from '@pkg/free-canvas-shared'
// import {ThemeVar} from '@pkg/free-canvas-theme'
// import s from '../../styles/editor/editor.less';



// interface EditorProps {
//     runTask(plugin:IPlugin):void
// }

// interface EditorState{  

// }

// const {ASIDE} = ThemeVar

// export function Editor(props:EditorProps){
//     const {runTask} = props;
//     const iframeRef = useRef();
//     const canvasContainerRef = useRef();
//     const asideRef = useRef();
//     let market:Market;
//     useLayoutEffect(()=>{
//         const iframe = iframeRef.current as HTMLFrameElement
//         // market = new Market(asideRef.current,{
//         //     canvasEl:canvasContainerRef.current,
//         //     getCanvasElement:function(id:string){
//         //         return iframe.contentDocument.getElementById(id)
//         //     }
//         // })
//         runTask(market)
//     },[]);
//     return <div className={s.editorRoot}>
//         <Header></Header>
//         <div className={s.content}>
//             <aside ref={asideRef} style={{width:ASIDE.width,backgroundColor:ASIDE.backgroundColor,color:ASIDE.color}}>

//             </aside>
//             <div className={s.canvasContent} ref={canvasContainerRef}>
//                 <iframe ref={iframeRef} src="./canvas.html"></iframe>
//             </div>
//             <Panel className={s.panel}>
//             </Panel>
//         </div>
//     </div>
// }

