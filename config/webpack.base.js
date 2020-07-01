
const path = require('path');
module.exports = function(mergeConfig){
    return Object.assign({},{
        entry: './demo/index.js',
        module: {
        //   rules: [
        //     {
        //       test: /\.tsx?$/,
        //       use: 'ts-loader',
        //       exclude: /node_modules/,
        //     },
        //   ],
        },
        plugins:[

        ],
        resolve: {
          extensions: [ '.tsx', '.ts', '.js' ],
        },
        output: {
          filename: '[name].js',
          path: path.resolve(__dirname, '../dist'),
        },
    },mergeConfig)
}