import remoteImpl from './impl/Remote.es6';

function remoteResponseCompleted(err, res, callback) {

    const top = res ? (res.body || {text: res.text}) : {};

    const error = top.error || err;

    const result = top.error ? top.result : (top.result || top);

    callback(error, result, res);
}

function remote(url, callback) {

    if (!callback){

        return new Promise((resolved, rejected)=> {

            remoteImpl(url, (err, res)=>this.remoteResponseCompleted(err, res, (err, r)=> {
                if (err) {
                    rejected(err)
                } else {
                    resolved(r)
                }
            }))
        });
    }

    return remote(url, (err, res)=>this.remoteResponseCompleted(err, res, callback));
}

/**
 * Plugin that provides logging feature
 */
export default class EventingPlugin {

    constructor(config, app) {

        this.init = function() {

            app.each((p)=>Object.assign(p, {
                    remote
                    ,
                    remoteResponseCompleted: p.remoteResponseCompleted || remoteResponseCompleted
                })
            )
        };
    }

}