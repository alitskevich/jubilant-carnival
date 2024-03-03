import SuperAgent  from 'superagent';
import Url from 'evest';

const URL_REDUCER={method:null, data: null, auth:null};

/**
 * Create and perform superagent request.
 */
export default function (ref, callback) {

    const url = Url(ref);

    console.log('remote: '+url);

    const method = (url.method || (url.data ? 'post' : 'get')).toLowerCase();

    const req = SuperAgent[method](''+Url(url, URL_REDUCER));

    if (url.headers) {
        req.set(url.headers);
    }

    if (url.auth) {
        req.auth(url.auth);
    }

    if (url.withCredentials && req.withCredentials) {
        req.withCredentials();
    }

    const data = url.data;
    if (data) {
        if (url.dataType==='form') {
    
            req.type('form');
            
            Object.keys(data).forEach(key => {
                const value = data[key];
                if (value._is_attachment){
                    req.attach(value.name, value.content);
                } else {
                    req.field(key, value)
                }
            })
            
        } else {
            
            req.send(data);
        }
        
    } else {

        req.send();
    }

    req.end(callback);

}