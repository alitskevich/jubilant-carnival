import {stringify} from './stringify.es6';
import {count} from './All.es6';
import {emit} from './Emitter.es6';
import {update} from './update.es6';

const CB = (e,r)=>r;

export function createEvest (source) {

    if (source && source.constructor === Evest){
        return source;
    }

    const r = new Evest();

    update(r, source);

    r.params = Object.freeze(r.params || {});

    r.path = Object.freeze(r.path || []);

    r.id = (r.target ? `${r.channel?`${r.channel}:`:''}//${r.target}/` : '/') +
        (r.path ? r.path.join('/') : '');

    return Object.freeze(r);
}

export function isEvest(obj) {

    return obj && obj.constructor === Evest;
};

/**
 * Evest class.
 *
 */
class Evest {

    /**
     * Passes optional callback to multiple handlers.
     * Results array passed to callback
     * @param cb
     * optional callback function
     * options object
     */
    emit(cb) {

        if (cb===Promise){

            return new Promise((resolve, reject) => {

                emit(this, (err, results)=> {
                    if (err) {
                        reject(err);
                    } else {
                        resolve([].concat(...results));
                    }
                });
            })
        }
        
        return emit(this, cb);
    }

    /**
     * Emit for single handler
     * Immediately invokes single result
     * @param cb  optional callback function or null

     * @returns Promise|immediate result if no callback provided.
     */
    action(cb) {

        if (cb===Promise){

            return new Promise((resolve, reject) => {

                this.action((err, result) => {
                    if (err) {

                        reject(err);

                    } else {

                        resolve(result);

                    }
                });
            });
        }

        const cnt = count(this);
        if (cnt!==1){
            const error = new Error(`${cnt?'500: Too many':'404: No'} handlers: ${this}`);
            if (cb){
                cb(error);
                return;
            } else {
                throw error;
            }
        }

        const results = emit(this, (err, results2)=>{
            
            //console.log('action '+this, err, results2);
            (cb||CB)(err, results2[0]);
            
        });
        
        if (!cb && Array.from(results).reduce((r,e)=>(typeof e === 'undefined'?r+1:r), 0)){

            throw new Error(`500: Result is not evaluated immediately: ${this}`);
        }
        
        return results[0];
    }

    toString() {

        return stringify(this);
    }
}