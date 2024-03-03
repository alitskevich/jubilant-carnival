//TODO refactor it with es6
module.exports = {
    //devtool: 'source-map',
    cache: false,
    //debug: true,
    entry:  {
        app: ['./src/main.es6']
    },
    output: {
        path:'dist',
        filename: '[name].js'
    }
    ,
    devServer: {
        /**
         * CORS for api requests
         *
         * @see https://webpack.github.io/docs/webpack-dev-server.html#proxy
         * @see http://peterashwell.com/webpack,/proxy,/api,/development/2015/06/05/webpack-as-proxy.html
         */
        proxy: {
            '/api/*': 'http://localhost:8080'
        }
    }
    ,
    resolve: {
        /**
         * @see https://webpack.github.io/docs/configuration.html#resolve-extensions
         */
        extensions: ['', '.js', '.ts', '.es6', '.jsx'],
        modulesDirectories: ['node_modules', 'git_modules', 'modules']
    }
    ,
    module: {
        loaders: [
            {
                test: /\.es6$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015-ie', 'stage-0']
                    // ,
                    // plugins:[
                    //     //'transform-flow-strip-types'
                    // ]
                }
            }
            ,
            {
                test: /\.jsx$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'stage-0', 'react']
                    ,
                    plugins: [
                        [
                            'transform-react-jsx'
                            ,
                            {
                                pragma: 'Array'
                            }
                        ]
                        // ,
                        //'transform-flow-strip-types'
                    ]
                }
            }
        ]
    }
};