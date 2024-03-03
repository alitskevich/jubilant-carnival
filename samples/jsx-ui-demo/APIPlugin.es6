import {Plugin} from 'applugins';

export default class APIPlugin extends Plugin {

    onApi_any({target, path, params}, cb) {

        this.remote({path:[target].concat(path), params}, cb);
    }

    send(params, callback) {

        const extra = {auth: this.config.auth};

        super.send({...params, ...extra}, callback);
    }

    completed(error, res, cb) {

        let result = res && res.body;

        if (result && result.Error) {
            error = {...result, message: result.Error};
            result = null;
        }

        //this.log('WAPI request completed', error, result);

        cb(error, result);

    }

}