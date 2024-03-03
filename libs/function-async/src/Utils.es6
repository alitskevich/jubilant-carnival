export function checkImmediateResult(result, cb) {
    // result by return
    if (result !== undefined) {

        const isPromise = result && result.then && (typeof result.then === 'function')

        if (isPromise) {

            result.then(r=>cb(null, r)).catch(cb);

        } else {

            cb(null, result);
        }
    }
}

export function wrapCb(callback, opts) {

    let alreadyCalledBack = false;

    return (err, ...results) => {

        if (!alreadyCalledBack) {

            alreadyCalledBack = true;

            if (err) {

                callback(opts.errorAdapter(err, opts));

            } else {

                callback(null, ...results);
            }

        }
    }
}