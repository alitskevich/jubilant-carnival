import {getBundle} from './All.es6';

const CB = (e,r)=>r;

export function emit(ev, callback) {

    const bundle = getBundle(ev);
    const total = bundle ? bundle.size : 0;
    const results = new Array(total);
    
    // silent notification mode
    if(!callback){
        
        if (total) {
            let err;
            
            for(let handler of bundle.values()) try {
        
                handler(ev, CB);
    
            } catch (ex) {
    
                err = ex;
            }
            
            if (err) {
                
                throw err;
            }
        }
        return;
    }
    
    if (!total) {
        
        callback(null, results);
        
    } else {

        let done = false;
    
        const callbackW = (err) => {
    
            if (!done) {
    
                done = true;
    
                callback(err, results);
    
            }
        };
        
        if (ev.timeout){

            setTimeout(()=>callbackW(new Error(`504: timeout: ${ev}`)), ev.timeout);
        }
    
        let counter = 0;
    
        const createCb = function (pos) {
    
            let isAlreadyCalled = 0;
    
            return function (err, result) {
    
                if (isAlreadyCalled++) return;
    
                if (err) {
    
                    callbackW(err);
                    
                } else {
    
                    results[pos] = result;
        
                    counter++;
        
                    // check if all successful done
                    if (counter === total) {
        
                        callbackW();
                    }                
                }
            }
        };
        
        let index=0;
        for(let handler of bundle.values()) {
    
            try {
    
                let cb = createCb(index++);
    
                const result = handler(ev, cb);
                
                // result by return
                if (typeof(result) !== 'undefined') {
            
                    const isPromise = result && result.then && (typeof result.then === 'function');
            
                    if (isPromise) {
            
                        result.then((r)=>cb(null, r), cb);
            
                    } else {
            
                        cb(null, result);
                    }

                }
                
            } catch (ex) {
    
                callbackW(ex);
                
                throw ex;
            }
        }
    }
    
    return results;
}