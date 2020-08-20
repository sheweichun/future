const baseConfigGen = require('./webpack.base');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');




module.exports = function(){
    const config = baseConfigGen({
        mode: 'production',
    });
    config.plugins = config.plugins.concat([
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'index.html',
            template:path.resolve(__dirname,'../demo/index.html')
        }),
        new HtmlWebpackPlugin({
            title: 'canvas.html',
            template:path.resolve(__dirname,'../demo/canvas.html')
        }),
    ]);
    return config
}




