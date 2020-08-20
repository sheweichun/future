const minimist = require('minimist');
const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');

const argv = minimist(process.argv.slice(2));



if(argv.dev){
    const app = require('express')();
    const options = {
        contentBase: './dist',
        hot: true,
        host: '0.0.0.0',
        stats: 'errors-only',
        index: 'editor.html',
        open:true
    };
    const devConfig = require('../config/webpack.dev')();
    const compiler = webpack(devConfig);
    webpackDevServer.addDevServerEntrypoints(devConfig, options);
    const server = new webpackDevServer(compiler, options);
    server.listen(5000, '0.0.0.0', () => {
        console.log('dev server listening on port 5000');
    });
}else{
    const devConfig = require('../config/webpack.prod')();
    const compiler = webpack(devConfig);
    compiler.run((info)=>{
        if(info){
            console.error(info);
        }
    })
}