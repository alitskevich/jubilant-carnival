
export function encodeValue(value) {

    return encodeURIComponent((typeof value ==='object')? JSON.stringify(value) : `${value}`);
}

// represent as string
export function stringify(r) {

    let result = '';

    if (r.target) {

        if (r.method) {
            result += r.method + '!';
        }

        if (r.channel) {
            result += r.channel + ':';
        }

        result += '//';
        
        if (r.auth) {
            result += r.auth + '@';
        }
        
        result += r.target;
        
        if (r.index) {
            result += ':' + r.index;
        }

    }
    
    if (r.path){

        result += '/'+r.path.join('/');
    }
    
    const params = r.params;
    if (params) {
        
        const keys = Object.keys(params).filter((key)=>(params[key]!=null));
    
        if (keys.length) {
    
            result += '?' + keys.map((key) => (key + '=' + encodeValue(params[key]))).join('&');
        }
    }

    if (r.data) {
        
        result += '#' + encodeValue(r.data);
    }

    return result;
}