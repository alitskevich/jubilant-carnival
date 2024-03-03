//stub function
const STUB = (x)->x;

/*Strings.*/
// returns capitalized `s`
String.capitalize = (s) -> (s && s.length && (s[0].toUpperCase() + s.substring(1)) || ``);

// returns camelized `s`
String.camelize = (s, sep='_') -> (s && s.length && s.split(sep).map((t,i)->(i?String.capitalize(t):t)).join('') || ``);

// Returns string formatted by `s`-template filled with rest of arguments.
String.format = (s, ...args) -> (s && s.length && s.replace(/\{(\d+)\}/g, (s, d) -> (args[+d] || '')) || '') ;

// next tick lamdba
Function.isFunction = (f) -> (typeof f === 'function');

// next tick lamdba
Function.nextTick = (...a) -> (a.length === 1 ? setTimeout(a[0], 5) : setTimeout(a[1], a[0]));

// creates a new function from source `code`
Function.create = (code, params) -> (code && code.length && Object.parse(`function (${params && params.join(', ') || ''}){ return ${code}; }`) || null);

// log stub.
Object.log = Object.log || Object.assign(((x) -> x), {error: ((s, x) -> new Error(s))});

// returns object evaluated from given `s`.
Object.parse = (s, ctx, ...opts)-> {
   try {
        return s && s.length && Function.call(Function, `return ${s}`).apply(ctx,opts) || null
   }catch(ex){
        throw new Error(`internal: Can't parse: ${ex.message} in ${s.replace(/\s+/g,' ').substring(0,150)}`);
   }
};

//overrides methods with super.
Object.mixin = (target, fn, ...params) ->{
    const _super = {};
    const mix = fn && fn.apply(null, [_super].concat(params)) || {};
    Object.keys(mix).forEach((n)->{
        const fn = target[n];
        _super[n] = (ctx, ...args)=>(fn && fn.apply(ctx,args));
        target[n] = mix[n];
    });
    return target;
};
