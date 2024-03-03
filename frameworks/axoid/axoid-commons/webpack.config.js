var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {
        index: [
	    './src/index.js'
        ]
    },
    //cache: true,
    //debug: true,
    //devtool: 'eval',
    output: {
        path: path.join(__dirname, "build"),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['', '.js', '.coffee']
    },
    module: {
        loaders: [
            { test: /\.coffee$/, loader: 'coffee-loader' },
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader?experimental&optional=runtime"},
            { test: /\.json$/, loader: 'json-loader'}
        ]
    },
    stats: {
        colors: true,
        reasons: true
    },
    plugins: [
        //new webpack.optimize.CommonsChunkPlugin('commons.chunk.js'),
        // new webpack.DefinePlugin({
        //     'process.env': {NODE_ENV: 'production'}
        // }),
        //new webpack.optimize.DedupePlugin(),
        //new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        //new webpack.optimize.AggressiveMergingPlugin()
    ]
};
