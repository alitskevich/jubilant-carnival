var assign = require('object-assign');
var path = require('path');
module.exports = function(config) {

    config.set({

        basePath: '.'
        ,
        frameworks: ['mocha', 'chai']
        ,
        files: [
            'test/main.js'
        ]
        ,
        preprocessors: {
            './test/main.js': ['webpack']
        }
        ,
        webpack: {

            resolve: {
                extensions: ['', '.js', '.coffee']
            }
            ,
            module: {
                loaders: [
                    { test: /\.coffee$/, loader: 'coffee-loader' },
                    { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader?experimental&optional=runtime"},
                    { test: /\.json$/, loader: 'json-loader'}
                ]
            }
            ,
            stats: {
                colors: true,
                reasons: true
            }
            ,
            debug: true
            ,
            devtool: false

        }
        ,
        webpackMiddleware: {
            noInfo: false
        }

        ,
        reporters: ['progress']
        ,
        autoWatch: false,

        browsers: ['Chrome'],//PhantomJS,Chrome

        singleRun: true,
        
        browserNoActivityTimeout: 60000

    });
};