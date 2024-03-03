const NONE = ()=>0;

const OUT = typeof console === 'undefined' ? {} : console;

export default {
    log: function log(level, ...args) {
        
        const fn = OUT[level] || OUT.log || NONE;
        
        fn.apply(OUT, args);
    }
};
