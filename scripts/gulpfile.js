const {watch,parallel,src,dest} = require('gulp')
const {editorLess,editorLessWatch} = require('../packages/free-canvas-editor/gulpfile');
const {jsonLess,jsonLessWatch} = require('../packages/free-canvas-json-editor/gulpfile');
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
  jsonLessWatch()
}




exports.watch = parallel(editorLess,jsonLess,copyLess,watchAllLess)


exports.build = parallel(editorLess)
