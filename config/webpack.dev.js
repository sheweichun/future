const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const baseConfigGen = require('./webpack.base');
const ExtractTextPlugin = require('mini-css-extract-plugin');
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
        new ExtractTextPlugin({
            filename:'[name].bundle.css'
        }),
        new webpack.HotModuleReplacementPlugin()
    ],entry.map((item)=>{
        const {name} = item;
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




