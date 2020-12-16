const {watch,parallel,src,dest} = require('gulp')
const {editorLess,editorLessWatch} = require('../packages/free-canvas-editor/gulpfile');
const path = require('path')
const pump   = require('pump');

const sourceLess = path.resolve(__dirname,'../src/**/*.less')
const distLess = path.resolve(__dirname,'../lib') 


function copyLess(cb){
  return pump([ 
    src([sourceLess]),
    dest(distLess)
  ],cb)
}

function watchAllLess(){
  watch(sourceLess,copyLess)
  editorLessWatch()
}




exports.watch = parallel(editorLess,copyLess,watchAllLess)


exports.build = parallel(editorLess)
