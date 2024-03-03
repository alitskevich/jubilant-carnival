import {wrapCb, checkImmediateResult} from './Utils.es6';

const DEF_FUNCTOR = (fn, cb, params)=>fn(params, cb);

export function normalizeOp(op, opts) {

    if (typeof op === 'function') {
        return op;
    }

    if (Array.isArray(op)) {

        return function (previousResult, doNext) {

            const functor = op.functor || DEF_FUNCTOR;

            const cb = (err, results)=>{doNext(err, results)};

            parallel(op, functor, cb, previousResult, opts);
        }

    } else if (typeof op === 'object') {

        return function (previousResult, doNext) {

            const cb = (err, results)=>{doNext(err, results)};

            parallel(op.list, op.functor, cb, previousResult, opts);
        }
    }

    throw new Error('Operation should be function, array or object: '+op);
}

export function parallel(arr, functor, callback0, params, opts) {

    const total = arr && arr.length;

    if (!total) {
        callback0(null, []);
        return;
    }

    const results = Array(total);

    const callback = wrapCb(callback0, opts);

    let counter = 0;

    const createCb = function (pos) {

        let isAlreadyCalled = false;

        return function (err, result) {

            if (err) {

                callback(err);

                return;
            }

            if (isAlreadyCalled) {

                return;
            }

            isAlreadyCalled = true;

            results[pos] = result;

            counter++;

            // check if all successful done
            if (counter === total) {

                callback(null, results);
            }

        }
    };

    arr.forEach((datum, index)=> {

        try {

            let cb = createCb(index);

            checkImmediateResult(functor(datum, cb, params), cb);

        } catch (ex) {

            callback(ex);
        }
    });
}