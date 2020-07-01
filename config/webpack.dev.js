const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const baseConfigGen = require('./webpack.base');
const path = require('path');
const webpack = require('webpack');



module.exports = function(){
    const config = baseConfigGen({
        mode: 'development',
        // devServer: {
        //     contentBase: './dist',
        //     hot: true,
        // }
    });
    config.plugins = config.plugins.concat([
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Hot Module Replacement',
            template:path.resolve(__dirname,'../demo/index.html')
        }),
        new webpack.HotModuleReplacementPlugin()
    ]);
    config.output.publicPath = '/';
    return config
}




