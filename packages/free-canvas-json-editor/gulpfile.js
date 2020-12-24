const path = require('path')
const {watch,src,dest} = require('gulp');
const less = require('gulp-less');
const concat = require('gulp-concat');
const cssmin = require('gulp-minify-css');
const rename = require('gulp-rename');
const pump   = require('pump');


const lessSource = path.resolve(__dirname,'src/**/*.less')
const lessDist = path.resolve(__dirname,'dist')

exports.jsonLess = function jsonLess(cb) {
  return pump([
    src([lessSource]),
    less(),
    concat('editor.css'),
    cssmin({}),
    rename({suffix:'.min'}),
    dest(lessDist)
  ],cb)
}


function buildJSONLess(cb){
  return pump([
    src([lessSource]),
    less(),
    concat('editor.css'),
    dest(lessDist)
  ],cb)
}

exports.jsonLessWatch = function jsonLessWatch() {
  watch(lessSource,buildJSONLess)
}