const VALUE_MAP = {
    'true': true,
    'false': false,
    'undefined': undefined
};

export function decodeValue(val) {

    const value = decodeURIComponent(val);

    if ('{['.indexOf(value[0]) > -1) {

        return JSON.parse(value);
    }

    const num = +value;

    if (num == value) return num;

    return VALUE_MAP[value] || value;
}

export function parse(r, s) {

    let p;

    // extract method:
    if ((p = s.indexOf('!')) > -1) {
        r.method = s.slice(0, p);
        s = s.slice(p + 1);
    }

    // extract channel:
    if ((p = s.indexOf('://')) > -1) {
        r.channel = s.slice(0, p);
        s = s.slice(p + 1);
    }


    // extract data:
    if ((p = s.indexOf('#')) > -1) {
        
        r.data = decodeValue(s.slice(p + 1));
        s = s.slice(0, p);

    }

    // extract query params:
    if ((p = s.indexOf('?')) > -1) {
        
        r.params = {};
        for (let param of s.slice(p + 1).split('&')) {

            let [key, value] = param.split('=');
            r.params[key] = value ? decodeValue(value) : true;
        }

        s = s.slice(0, p);
    }

    if (s === '') return;

    // work with target and path:
    let path = r.path = s.split('/');
    if (path[0] === '') {
        path.shift();
        if (path[0] === '') {
            
            path.shift();
            
            r.target = s = path.shift();
            
            // extract auth:
            if ((p = s.indexOf('@')) > -1) {
                r.auth = s.slice(0, p);
                r.target = s = s.slice(p + 1);
            }
            
            // extract index:
            if ((p = s.indexOf(':')) > -1) {
                r.index = s.slice(p+1);
                r.target = s.slice(0, p);
            }
        }
    }

}
