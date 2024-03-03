(function(global){
/* 
 * Logging.
 */

Object.log =  function() {
    var c = global.console, args = Array.prototype.slice.call(arguments,0);
    
    if (c && c.log) {
        
        if (c.log.apply) {
            c.log.apply(c,args);
        } else {
            // IE8
            c.log(args.join(', '));
        }
        
    }
};

})(typeof(global)==='undefined'?this:global);


