const baseConfigGen = require('./webpack.base');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');




module.exports = function(){
    const config = baseConfigGen({
        mode: 'production',
    });
    config.plugins = config.plugins.concat([
        new CleanWebpackPlugin(),
    ]);
    return config
}




