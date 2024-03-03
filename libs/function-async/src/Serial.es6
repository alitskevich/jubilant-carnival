import {wrapCb, checkImmediateResult} from './Utils.es6';
import {normalizeOp} from './Parallel.es6';
import Expiration from './Expiration.es6';

export function serial(operations, callback0, initialResult, opts) {

    const last = operations.length - 1;

    if (last<0) {

        callback0(null, initialResult);
        return;
    }

    const callback = wrapCb(callback0, opts);

    function createNextCb(step) {

        let isAlreadyCalled = false;

        if (step && opts.timeout) {

            Expiration.register(function () {
                if (!isAlreadyCalled) {
                    callback(`504: Timeout exceeded: #[${step}] in ${opts.displayName || operations}`);
                }
            }, opts.timeout);
        }


        return function (err, previousResult) {

            if (isAlreadyCalled) {

                return;
            }

            isAlreadyCalled = true;

            if (step > last) {

                callback(err, previousResult);
                return;
            }

            if (err) {

                callback(err);

            } else {

                try {

                    const op = normalizeOp(operations[step], opts);

                    const next =  createNextCb(step + 1);

                    //invoke current operation
                    const result = op(previousResult, next);

                    checkImmediateResult(result, next);
                    //console.log(step, result);

                } catch (ex) {

                    callback(ex);
                }
            }
        }
    }

    createNextCb(0)(null, initialResult);
}