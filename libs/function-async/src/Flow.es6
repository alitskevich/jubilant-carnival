import OPTS from './OptionsDefaults.es6';
import {serial} from './Serial.es6';

export default class Flow {

    constructor(operations, opts) {

        this._options = {...OPTS, opts};

        this._operations = [...operations];
    }

    addOperations(operations) {

        this._operations = [...this._operations, ...operations];

        return this;
    }

    options(options) {

        Object.assign(this._options, options);

        return this;
    }

    initialValue(initialValue) {

        this._initialValue = initialValue;

        return this;
    }

    start(callback) {

        //this._options.error = this._options.error || new Error();

        serial(this._operations, callback, this._initialValue, this._options);
    }
    
    promise() {

        return new Promise((resolve, reject)=>{
            
            this.start((err, result)=>{
                if (err) {
                    reject(err)
                } else {
                    resolve(result);
                }
            });
        });
    }

}