
const path = require('path');
const ExtractTextPlugin = require('mini-css-extract-plugin');
exports.getCssLoader = function(isProd,noModel){
  console.log('noModel :',!noModel);
    const ret = [{
        loader: 'css-loader',
        options: {
          modules: !noModel
        }
    }];
    if(!isProd){
      ret.unshift({
        loader:ExtractTextPlugin.loader,
        options:{

        }
      })
    }
    return ret
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