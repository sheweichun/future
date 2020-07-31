const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const baseConfigGen = require('./webpack.base');
const path = require('path');
const webpack = require('webpack');
const entry = require('./entry');


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
        new webpack.HotModuleReplacementPlugin()
    ],Object.keys(entry).map((name)=>{
        return new HtmlWebpackPlugin({
            title: name,
            filename:`${name}.html`,
            chunks: [name],
            template:path.resolve(__dirname,`../template/${name}.html`)
        })
    }));
    config.output.publicPath = '/';
    return config
}




