
const path = require('path');
exports.getCssLoader = function(isProd){
    return {
        loader: 'css-loader',
        options: {
          modules: false,
          minimize: isProd,
        }
    }
}

exports.getLessLoader = function(isProd){
    return {
        loader: 'less-loader'
    }
}


exports.getPostcssLoader = function(isProd){
    return {
        loader: 'postcss-loader',
        options: {
          config: {
            path: path.resolve(__dirname, 'postcss.config.js'),
          },
        },
      }
}