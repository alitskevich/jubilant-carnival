# object-log

Yet another Logger facade for JavaScript.

Default implementation based on `console`.
 
Default log level is `INFO`
 
# Usage

    log = require('object-log');
    
    // set level
    log.LEVEL = log.LEVELS.DEBUG;
    
    // simple log
    log('some log', 'other message');
    
    // direct call implementation 
    log.invoke('info', ['some log', 'other message']);
   
    // By levels
    log.error('e');
    log.warn('w');
    log.info('i');
    log.debug('d');
    log.verbose('v');

    // grouped
    log.groupCollapsed('g1');
    log.groupEnd('g2');

    // measure time
    log.time('t1');
    log.timeEnd('t2');

    // replace implementation    
    log._impl = { log: (...args)=> {...}, error}
