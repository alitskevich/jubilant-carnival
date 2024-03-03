import {Plugin,event} from 'applugins';

/**
 * Web Server Plugin that emits events from request.
 *
 * @param showLogs turn show logs on
 */
export default class DispatcherPlugin extends Plugin {

    onServer_middleware() {

        return ::this.middleware;
    }

    /**
     * Emits event across Application.
     *
     * @param path {String} URI path
     * @param query {Object} extra params
     * @param body {Object} main request params
     * @param res {Object} Express response
     */
    middleware({path, query, body, method}, res, next) {

        if (!this.config.hideLogs) {
            this.log('<<', path, query);
        }

        const p = path.split('/');

        const ev = {channel: p[1] || '', target: p[2] || '', path: p.slice[3] || [], params: query, data: body, method};

        event(ev).emit((err, [result]) => {

            if (!this.config.hideLogs) {
                this.log('>>', path, query, (err ? err.message : 'success'), `${JSON.stringify(result || "")}`.slice(0, 50));
            }

            if (!err) return res.status(200).send({result});

            if (err.code === 404) return next();

            const {message = 'unknown: Unknown error', code = 500, errors} = err;

            res.status(code).send({error: {message, code, errors}});

        }, {singleResult: true});

    }
}