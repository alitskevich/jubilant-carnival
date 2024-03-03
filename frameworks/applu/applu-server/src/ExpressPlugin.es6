import {Plugin, event} from 'applugins';

import Express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

/**
 * The Express plugin.
 *
 *  - starts/stops a http server instance powered by Express.
 *  - adds Application.use() method
 *
 * @param viewsDir views Directory, 'views' by default.
 * @param viewEngine views Engine, 'jade' by default.
 * @param port http port, '8080' by default.
 * @param ipaddress http IP address, '127.0.0.1' by default.
 *
 */
export default class ExpressPlugin extends Plugin {

    /**
     * Creates Express application. Adds use() method to the Application that allows other plugins to
     * handle requests.
     */
    constructor(config, app) {

        super(config, app);

        this.express = this.createExpress();

    }

    /**
     * Initializes the plugin. Starts the HTTP server.
     */
    async init() {

        const middleware = await event('server://middleware').promise();

        middleware.forEach(mw=>this.express.use(mw));

        await this.startHttpServer();

        super.init();
    }

    /**
     * Finalizes the plugin. Stops the HTTP server.
     */
    done() {

        this.stopHttpServer();

        super.done();

    }

    /**
     * Creates and starts the HTTP server.
     */
    startHttpServer() {

        const {ipaddress, port = '8080'} = this.config;

        this.http = require("http").createServer(this.express);

        return new Promise((resolve) => {

            this.http.listen(port, ipaddress, () => {

                this.log(`HTTP server is started on port ${port}`);

                resolve();

            });

        });

    }

    /**
     * Stops the HTTP server.
     */
    stopHttpServer() {

        if (this.http) {

            this.http.removeAllListeners('connection');
            this.http.removeAllListeners('request');
            this.http.close();
            this.http = null;

            this.log(`HTTP server is stopped.`);

        }

    }

    /**
     * Creates Express application.
     *
     * @returns {*} Express application
     */
    createExpress() {

        var epp = Express();

        this.initViewsEngine(epp);

        if (this.config.showLogs) {

            epp.use(logger('dev'));

        }

        epp.use(cookieParser());

        epp.use(bodyParser.json({limit: 10 * 1024 * 1024}));

        epp.use(bodyParser.urlencoded({extended: true, limit: 1024 * 1024}));

        epp.use(function(req, res, next) {

            const {query, body} = req;
            const path = req.path.split('/');

            req.event = event({type: path[1] || '', target: path[2] || '', path: path.slice(3), params: query, data: body});

            next();

        });

        this.staticAssets(epp, this.config.staticDirs);

        return epp;

    }

    // publish static resources
    initViewsEngine(epp, viewsEngine = this.config.viewsEngine) {

        if (!viewsEngine) return;

        epp.set('views', viewsEngine.viewsDir || './views');
        epp.set('views engine', viewsEngine.templating || 'jade');

        if (viewsEngine.disableCache) epp.disable('view cache');

    }

    // publish static resources
    staticAssets(epp, dirs=[]) {

        dirs.forEach(dir => epp.use(Express.static(dir)));
    }

}