const path = require('path')
const entry = require('./entry');
const baseConfigGen = require('./webpack.base');
const ExtractTextPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');




module.exports = function(){
    const config = baseConfigGen({
        mode: 'production',
    });
    config.plugins = config.plugins.concat([
        new CleanWebpackPlugin(),
        new ExtractTextPlugin({
            filename:'[name].bundle.css'
        })
    ],entry.map((item)=>{
        const {name} = item;
        return new HtmlWebpackPlugin({
            title: name,
            filename:`${name}.html`,
            chunks: [name],
            template:path.resolve(__dirname,`../template/${name}.html`)
        })
    }));
    return config
}




