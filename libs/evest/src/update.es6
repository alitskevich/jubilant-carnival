import {parse} from './parse.es6';

export function assign(r, s) {
    
    Object.keys(s).forEach((key)=>{

        if (key=='path'){
            
            r.path = (r.path||[]).concat((typeof s.path === 'string') ? s.path.split('/') : Array.from(s.path));
            
        } else if (key=='params'){
            
            r.params = Object.assign({}, r.params, s.params);
            
        } else {
            
            r[key] = s[key];
        }
    })
    
}

export function update(r, s) {

    let type = typeof(s);

    if (type === 'function') {
        s = s();
        type = typeof(s);
    }

    if (type === 'string') {

        parse(r, s);

    } else if (type === 'object') {
        
        if(Array.isArray(s)){
            
            for(let ss of s) if (ss) {
                
                update(r, ss)
            }
            
        } else {
            assign(r, s);
        }

    } else{

        r.data = s;
    }
}
