
const path = require('path');
const entry = require('./entry');

const {getCssLoader,getPostcssLoader,getLessLoader} = require('./util') 

module.exports = function(mergeConfig){
    const isProd = mergeConfig.mode === 'production'
    return Object.assign({},{
        entry:entry.reduce((ret,item)=>{
          ret[item.name] = item.path
          return ret;
        },{}),
        module: {
          rules: [
            {
              test: /\.jsx?$/,
              use: [
                {
                  loader:'babel-loader',
                  options:{
                    plugins:["@babel/plugin-proposal-class-properties"],
                    presets: [
                        "@babel/preset-react",
                        "@babel/preset-env"
                    ]
                  }
                }
              ],
              exclude: /node_modules/
            },
            {
              test: /\.css$/,
              use: [...getCssLoader(isProd,true)],
              include: /node_modules|packages/
            },
            {
              test: /\.css$/,
              use: [...getCssLoader(isProd)],
              exclude: /node_modules|packages/
            },
            {
              test: /\.less$/,
              use: [...getCssLoader(isProd), getPostcssLoader(isProd), getLessLoader(isProd)],
              exclude: /node_modules/
            }
          ],
        },
        plugins:[

        ],
        externals:{
          'react':'React',
          'react-dom':'ReactDOM',
          "@alife/next":'Next'
        },
        resolve: {
          extensions: [ '.tsx', '.ts', '.js' ],
          alias:{
            '@pkg':path.resolve(__dirname,'../packages')
          }
        },
        output: {
          filename: '[name].js',
          path: path.resolve(__dirname, '../build'),
        },
    },mergeConfig)
}