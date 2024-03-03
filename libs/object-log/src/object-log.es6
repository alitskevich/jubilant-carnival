import IMPL_STUB from './impl-default.es6';

const LEVEL_NAMES = ['error', 'warn', 'info', 'debug', 'verbose'];

//name-> code
const LEVELS = LEVEL_NAMES.reduce((r,n,i)=>(r[n.toUpperCase()]=n,r),{});

//info level by default
const DEFAULT_LEVEL_NAME = LEVELS.INFO;

const NONE = ()=>'';

export default Object.assign(function(levelName=DEFAULT_LEVEL_NAME, opts={}) {
        
    const level = LEVEL_NAMES.indexOf(levelName.toLowerCase());
    
    const impl = opts.implementation || IMPL_STUB;
   
    const log = (name, ...args) => {
        
        impl.log(name, ...args);
        
        return  args[0];
    }

    LEVEL_NAMES.forEach((name, lvl) => {
        
        const levelEnabled = lvl <= level 

        log[name] = (!levelEnabled) ? NONE: (...args) => {
            
            impl.log(name, ...args);
            
            return  args[0];
        };
    });
    
    return log;
},{LEVEL_NAMES,LEVELS})