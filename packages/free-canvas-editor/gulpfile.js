const path = require('path')
const {watch,src,dest} = require('gulp');
const less = require('gulp-less');
const concat = require('gulp-concat');
const cssmin = require('gulp-minify-css');
const rename = require('gulp-rename');
const pump   = require('pump');


const lessSource = path.resolve(__dirname,'src/**/*.less')
const lessDist = path.resolve(__dirname,'dist')

exports.editorLess = function editorLess(cb) {
  return pump([
    src([lessSource]),
    less(),
    concat('editor.css'),
    cssmin({}),
    rename({suffix:'.min'}),
    dest(lessDist)
  ],cb)
}


function buildLess(cb){
  return pump([
    src([lessSource]),
    less(),
    concat('editor.css'),
    dest(lessDist)
  ],cb)
}

exports.editorLessWatch = function editorLessWatch() {
  watch(lessSource,buildLess)
}