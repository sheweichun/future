

import {CanvasEvent} from 'free-canvas-shared'
export * from './market/index';

function preventDragOver(e:DragEvent){
    e.preventDefault();
}

export function setup(){
    document.body.addEventListener(CanvasEvent.DRAGOVER,preventDragOver)
}