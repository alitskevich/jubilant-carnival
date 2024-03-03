var path = require('path');
var webpack = require('webpack');
var node_modules_dir = path.join(__dirname, 'node_modules');

/**
 * Devtool must be disabled when running into IE, because webpack calls every module for generating source map
 * @see http://webpack.github.io/docs/configuration.html#devtool
 * But core.js has modules which mustn't be invoked into IE
 * @see https://github.com/zloirock/core-js/issues/62
 */

module.exports = {
    entry: {
        //index: './index.js',
        test: './test/index.js'
    },
    cache: true,
    debug: true,
    output: {
        path: path.join(__dirname, "build"),
        pathinfo: true,
        publicPath: '/',
        filename: '[name].js',
        sourceMapFilename: '[name].map'
    },
    resolve: {
        extensions: ['', '.js']
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader?stage=0&optional=runtime"},
            { test: /\.json$/, loader: 'json-loader'}
        ]
    },
    stats: {
        colors: true,
        reasons: true
    },
    plugins: [
        //new webpack.HotModuleReplacementPlugin()
        // new webpack.DefinePlugin({
        //     'process.env': {NODE_ENV: 'production'}
        // }),
        //new webpack.optimize.DedupePlugin(),
        //new webpack.optimize.UglifyJsPlugin(),
        //new webpack.optimize.OccurenceOrderPlugin(),
        //new webpack.optimize.AggressiveMergingPlugin()
    ]
};
