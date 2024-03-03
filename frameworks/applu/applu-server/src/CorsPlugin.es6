import {Plugin,event} from 'applugins';

/**
 * The Cors  plugin.
 *
 * @param origin.
 * @param methods.
 * @param port http port, '8080' by default.
 * @param headers.
 *
 */
export default class CorsPlugin extends Plugin {

    onServer_middleware() {

        return ::this.middleware;
    }
    
    middleware(req, res, next) {

        res.header('Access-Control-Allow-Origin', this.config.origin || '*');
        res.header('Access-Control-Allow-Methods', this.config.methods || 'GET,PUT,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', this.config.headers || 'X-Requested-With,Content-Type,Cache-Control,Cookie');

        if (req.method === 'OPTIONS') {

            // pre-flight request
            res.statusCode = 204;
            return res.end();

        } else {

            return next();
        }
    }
}