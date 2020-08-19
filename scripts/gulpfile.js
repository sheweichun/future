const {parallel} = require('gulp')
const {editorLess,editorLessWatch} = require('../packages/free-canvas-editor/gulpfile');




exports.watch = parallel(editorLessWatch)


exports.build = parallel(editorLess)
