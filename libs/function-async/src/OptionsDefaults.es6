export default {

    timeout: 6 * 1000
    ,
    errorAdapter (err, opts) {

        const error = opts.error || err;

        //error.message = (err.message || err);

        console.error(error);

        return error;
    }

};