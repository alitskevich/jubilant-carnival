/**
 * Axio: Infrastructure. 
 * Core functional over Function, Array, Object(including Uri, Events), String.
 */

(function ( _undef) {
    
    // strict mode on
    "use strict"; 

    // some internal shortcuts
    var F = Function, A = Array, O = Object, _ownProp = O.prototype.hasOwnProperty;

    /**
     *==========================================================================
     * I. Functions.
     *==========================================================================
     */
    
    /**
     * Function.NONE.
     * Widely used as a stub.
     * @return first argument
     */
    F.NONE = function(x) {
        
        return x;
    };
    
    /**
     * Function.FALSE.
     * Widely used as a stub.
     * @return false
     */
    F.FALSE = function() {

        return false; 
    }
    
    /**
     * @return non-empty {#notFoundValue} or {#ctx} otherwise.
     * That iterator call {#fn} for each entry of {#obj} on {#ctx} passing datum, index and {#opts}.
     */
    F.iterate = function(fn, obj, ctx, opts) {
       
        if (obj) {
            
            var i, l = obj.length;
           
            if (l === +l) {
                
                for (i = 0 ; i < l; i++) {
                    fn.call(ctx, obj[i], i, opts);
                }
                
            } else {
                    
                for (i in obj) {
                    if (_ownProp.call(obj, i)) {
                        fn.call(ctx, obj[i], i, opts);
                    }
                }
            }
        }
        
        return ctx;
        
    };
    
    F.prototype.iterator = function(_ctx, _opts) {
        
        var f = this;
        
        return function(obj, ctx, opts) {
            
            return F.iterate(f, obj
                , ctx===_undef ? _ctx : ctx
                , opts===_undef ? _opts : opts);
        }
    };
    
    (function(cache, mcache){
        
        String.prototype.iterate = function(arr,ctx,params){
            var s = this;
            var fn =(cache[s] || (cache[s] = F.call(F,'x','i','p','return ('+s.replace(/`/g,'\'')+');')));
            
            return F.iterate(fn,arr,ctx,params);
        }

        String.prototype.map = function(arr,ctx,params){
            var s = this;
            var fn = mcache[s];
            if (fn){
                return F.iterate(fn,arr,ctx,params);
            }
            
            s = s.replace(/`/g,'\'').split(' if ')
            fn = mcache[s] = F.call(F,'x','i','p',s[1]?('if ('+s[1]+') {this.push ('+s[0]+');}'):('this.push ('+s[0]+');'));
            return F.iterate(fn,arr,ctx||[],params);
        }

    })({},{});

    /**
     * Function.perform([list], args... OR list...)
     * 
     * Performs {#list} of asynchronous operations in order.
     * 
     * Invoke this() as callback inside each function.
     * Invoke this.cb() to obtain some more callbacks for parallel flow.
     * 
     * @see test/test-event.html for sample usages
     */
    F.perform = (function(){

        var __ok = function(e){
            
            return (!e) ? true : (this(e), false);
        };
            
        return function(operations, event) {
            
            var error;
            var pending =  1;
            var args = [];
             
            var tick = function(err, v, pos) {
            
                if (err) {
                    err = O.error(err);
                    err.next = error;
                    error =  err;
                }
                
                args[ pos || 0 ] = v || null;
            
                var op;
            
                if (((--pending) === 0) && (op = operations.shift())){
                    
                    // shift `err` argument for first operation.
                    var _args = (error===_undef?[]:[error]).concat(args);
                    
                    pending = 1;
                    error = null;
                    args = [null];
                    
                    try {
                    
                        if ((_args = op.apply(ctx, _args)) !== _undef) {
                            ctx(null, _args);
                        } 
                        
                    } catch (ex) {

                        O.error.log(O.error.BAD,''+ex,''+op);

                        if (operations.length) {
                            pending = 1; 
                            ctx(ex, null);
                        } else {
                    //throw ex;
                    }
                    }
                }
            };

            // default callback function passed as context for each operation
            var ctx = function(err, v) {
                tick(err, v);
            }
       
            // used to skip code if error
            ctx.ok = __ok;
        
            // used to create parallel callback
            ctx.cb = function() {
            
                var pos = args.length;
                
                // ensure size
                args[pos] = _undef;
                
                // increment pending
                pending++;
            
                return function(err, v) {
                    
                    // can affect only once!
                    (args[pos] === _undef) && tick(err, v, pos);
                    
                };
            };
            
            // start with first operation
            tick(null, event);
            
        };
    })();
    
    /**
     *==========================================================================
     * II. Working with Arrays.
     *==========================================================================
     */
    
    /**
     * makes array-like projection
     * @return slice of {#arr} or empty array.
     * @safe for no {#arr)
     */
    A.slice = function(arr, from, sz) {
        
        return arr ? A.prototype.slice.call(arr,from,sz) : [];
        
    };
    
    /**
     *@return item of {#arr} at {#p=0} position or null.
     * negative p sumed with array length
     * @safe for no {#arr)
     */
    A.item = function(arr, p) {
        
        return arr ? ( !p ? arr[0] : ((arr.length>(p=((p>0)?0:arr.length)+p))? arr[p] :  null)) : null;
        
    };

    /**
     * @find item of {#arr} with {#key='id'} attribute value matching {#val}.
     * @return item found or null if none
     */
    A.findByAttr = (function() {
        
        var _fn = function(val, key) {
            
            return function(e) {
            
                return (e[key]===val) ? e : null;
            
            };
            
        };
        
        return function(arr, val, key) {
            
            var r=null;
            if (arr) {
                var fn = (typeof(key) === 'function') ? key : _fn(val, key || 'id');
            
                for (var l = arr.length,i = 0; i < l; i++) {
                    if ((r = fn.call(arr, arr[i], i))) return r;
                }
            }
            return r;
            
        }
        
    })();
    
    /**
     * @sort given {#a}rray in {#dir}ection using {#getter} for criteria
     */
    A.sortBy = function(a, getter, dir) {
        
        getter = getter || F.NONE;
        
        if (!dir) {
            dir=1;
        }
        
        var rdir  = dir*-1;
        
        if (typeof(getter) === 'string') {
            var key = getter;
            getter = function(s) {
                return s && s[key]
            }
        }
        
        return a.sort( function(s1,s2,v1,v2){
            v1=getter(s1);
            v2=getter(s2);
            return v1>v2?dir:(v1<v2?rdir:0);
        }
        
        )
    }

    /**
     *==========================================================================
     * III. Working with Objects.
     *==========================================================================
     */

    /**
     * updates {#obj*} with own key/values from {#extra}.
     */
    O.update =  function(obj, extra) {
        
        if (obj && extra) {
            
            for(var n in extra) {
                if (_ownProp.call(extra, n)) {
                    obj[n] = extra[n];
                }
            }
        }
        
        return obj;
    };

    // @get value of {#obj} property by {#keys} in deep.
    O.get =  function(obj, key) {
        
        if (obj) {
            
            var  p=-1,p1;
            
            for (; obj && (p=key.indexOf('.',p1=p+1))>-1;obj = obj[key.substring(p1,p)] ) {}
            
            return obj ?  obj[key.substring(p1)] : _undef; 
                        
        }
        
        return null;
    };

    // @set value of {#obj} property by {#keys} in deep.
    O.set =  function(obj, key, val) {
        
        if (obj) {
            
            for(var  p=-1,p1=-1, k; (p=key.indexOf('.',p1=p+1))>-1; obj = (obj[k=key.substring(p1,p)]|| (obj[k]={}))) {}
            
            k=key.substring(p1);
            
            return (obj[k] = val);
        }
        
        return null;
    };
    
    // safely @clones {#obj}.
    O.clone =  function(obj, delta) {
        
        return obj ? O.update(O.update(new (obj.constructor)(), obj), delta) : null;
        
    };
    
    // @return object sliced from original by given keys
    O.slice = (function(f) {
        
        f = function(n, i, obj) {
            
            if ((i=obj[n]) !== _undef) {
                this[n] = i;
            }
            
        }
        
        return function(obj, keys) {
            
            return obj ? F.iterate(f, keys, {}, obj) : {};
        }
        
    })();
 
    // @return object evaluated from {#str*}.
    O.parse = function(s) {
        try {
            
            return s ? (F.call(F,"return " + s))() : null;
            
        } catch (ex) {
            
            O.error.log(O.error.BAD,'Object.parse: '+ex.message,s);
            
        }
        
        return null;
    };
  
    /**
     *==========================================================================
     * IV. Working with URI.
     *==========================================================================
     */


    // parses argument to URI object instance:
    // [kind]type://id?(p1=v1)*#hash
    // id also parsed into steps and authority
    O.parseUri =  (function() {
        
        var qFn=(function(v) {
            
            var p;
            if ((p = v.indexOf('=')) > -1) {
                this[v.substring(0, p)] = decodeURIComponent( v.substring(p + 1));
            }
            
        }).iterator();
        
        var Uri = function(s) {
            
            this.isUri =true;
            this.original = s;
            this.params = {};
            
        }
        
        Uri.prototype.constructor = Uri;
        
        Uri.prototype.toString = function() { 
            
            var q = '';
            for (var n in this.params) {
                q+=((q?'&':'?') + n + '=' + encodeURIComponent(this.params[n]));
            }
            
            return ((this.type ? (this.type + ':') : '') +  this.id + q + (this.hash ? ('#' + this.hash) : ''));
            
        };
        
        return function (s) {
            
            var r = new Uri(s), p;
            
            if (!s)  return r;
            
            if (!s.substring) {
                s = ''+s;
            }
            
            // extract hash:
            if ((p = s.indexOf('#')) > -1) {
                r.hash = s.substring(p + 1);
                s = s.substring(0, p);
            }
            // extract query:
            if ((p = s.indexOf('?')) > -1) {
                qFn(s.substring(p + 1).split('&'), r.params);
                s = s.substring(0, p);
            } 
            // extract kind:
            if ((s[0]=='[') && ((p = s.indexOf(']')) > -1)) {
                r.kind = s.substring(1, p);
                s = s.substring(p + 1);
            }
            // extract type:
            if ((p = s.indexOf('://')) > -1) {
                r.type = s.substring(0, p);
                s = s.substring(p + 1);
            }
            // work with path:
            r.id = s;
            r.host = '';
            r.path = p = s.split('/'); 
            
            if (s[0]==='/') {
                
                r.isAbsolutePath=true;
                if (s[1]==='/') {
                    
                    r.host = r.path[2];
                    r.path = r.path.slice(3);
                    
                } else {
                    
                    r.path.shift();
                    
                }
            }
            
            for (;(p[0]==='');p.shift()){}
            
            r.steps = p;
            r.authority = p[0];
            r.step = p[1];
            
            return r;
        }
    })();
    
    /**
     *==========================================================================
     * V. Working with Strings.
     *==========================================================================
     */

    (function() {
        
        // memoize Templates
        var TEMPLATES = {};
        
        // parses and compile binding from expression
        var compileTemplate = function(s){
            
            if (TEMPLATES[s]) {
                return TEMPLATES[s];
            }
            
            var  posB, posE = -27,  path, s0=s;
            
            s = s.replace(_RE_QUOTE,'"');
            
            while ( ((posB = s.indexOf('{', posE+27)) > -1)&& ((posE = s.indexOf('}', posB)) > -1) ) {
                
                path = s.substring(posB + 1, posE);
                
                if (path[0]===' '){
                    path = path.substring(1);
                }
                
                s= s.substring(0, posB) + "'+(Object.get(this,'" + path + "')||'')+'" + s.substring(posE + 1);
                
            }
            
            //O.debug(s);
            return TEMPLATES[s0] = (new Function("return '" + s + "';"));
        };
        
        // memoize regexps
        var _RE = (function($R){
            
            return function (key){
                return $R[key] || ($R[key]=new RegExp('\\{' + key + '\\}', 'gm'))
            }
            
        })({}), _RE_UNDERSCORE=new RegExp('_', 'gm'), _RE_QUOTE=new RegExp("'", 'gm');

        String.LANGUAGE = 'en';

        String.LANGUAGES = ['en'];
    
        // @returns localized {#s} or ''
        String.localize = function(s) {
            
            return String.capitalize(s).replace(_RE_UNDERSCORE,' ');
            
        };    
        // @returns capitalized {#s} or ''
        String.capitalize = function(s) {
            
            return s && s.length && (s.toString().charAt(0).toUpperCase() + s.substring(1)) || '';
            
        };
        // @returns camelize {#s} or ''
        String.camelize = function(s, sep) {
            
            if (!s || !s.length) return '';
            
            var arr = s.split(sep||'_'), r=arr[0];
            for (var i = 1, l = arr.length; i < l; r+=String.capitalize(arr[i++])) {}
            
            return r;
            
        };        
        // Returns string formatted by template filled with rest of arguments.
        // If template is a function, then it is invoked with rest of arguments passed
        // @return string result.
        String.format = function(s){
            
            var type = typeof(s);
            
            if (type==="string") {
                
                for (var i = arguments.length-1;i>0;i--) {
                    s = s.replace(_RE(i-1), arguments[i]);
                }
                
                return s;
                
            } else if (type==="function") {
                
                return s.apply(null, A.prototype.slice.call(arguments,1));
                
            }
            
            return null;
        };

        // @return string formatted by template and key/value map used for placeholder substitution.
        String.formatWithMap = function(s, map){
            
            return compileTemplate(s).call(map);
            
        };
    
    })();

    /* 
     *==========================================================================
     * VI. Logging.
     *==========================================================================
     */
    
    // Declare stub method.
    O.log = F.NONE;
    
    // debug
    O.debug =  function() {
        
        O.log.apply(O,['DEBUG:'].concat(A.prototype.slice.call(arguments,0)));
        
    };
    
    /* 
     *==========================================================================
     * VII. Error handling.
     *==========================================================================
     */

    // narrow error to reqular form: { reason:'', message:'', info:''}
    O.error = function(err, message, info) {
        
        if (!err) {
            return null;
        } 	   		
        
        if (typeof(err)==='string') {
            err = {
                reason: err
            };
        }
        
        if (!err.reason) {
            err.reason = O.error.UNKNOWN;
        }
    
        if (!err.message) {
            err.message = message || err.reason;
        }
    
        if (!err.info) {
            err.info = info;
        }
        
        return err;
    }

    // System-level error handler
    O.error.log =  function(err, message, info) {
        
        err = O.error(err, message, info);
        
        O.log.apply(O,['ERROR:', err]);
        
        return err;
    };
    
    O.error.UNKNOWN = 'unknown-error';
    O.error.NOT_FOUND = 'not-found';
    O.error.ACCESS_DENIED = 'access-denied';
    O.error.BAD = 'bad-code';


    /* 
     *==========================================================================
     * VIII. Code dependency.
     *==========================================================================
     */
    
    // Ensure all dependencies are resolved and invokes callback after..
    O.require = function(_cache) {
        
        var _eachItem = (function(x) {
        
            // skip empty 
            if (!x) return;
            
            var ctx = _cache[x] || (_cache[x]={
                q:[]
            });

            // skip already cached
            if (ctx.done) return;
 
            // normalize/create event
            var u = O.parseUri(x);
        
            // use [script] kind by default (or for http type)
            u.kind = u.kind || ((!u.type || (u.type === 'http')) ? 'script' : u.type );
         
            ctx.q.push(this.cb());
            
            // prevent duplicate notifications
            if (ctx.q.length === 1) {

                // create callback wrapper
                var callback = function(err){
                    if (err) {
                        O.error.log('Unreachable: '+x);
                    } else {
                        ctx.done = x;
                    }
                    
                    var cb;
                    while((cb=ctx.q.shift())) {
                        cb.apply(this, arguments);
                    }
                };
                
                // notify with event
                O.notify(u, callback);

            }
        
        }).iterator();
        
         
        var _starter = [function(list) {
                
            _eachItem(list, this);
            
            return true;
            
        }];

        return function(list, cb) {
            
            F.perform(_starter.concat(cb), list);
            
        };
        
    }({});

    /**
     *==========================================================================
     * IX. Event notifications.
     *==========================================================================
     */
    
    (function($R){
    

        var _opArgg0 = [function(args){
            this.apply(null, args);
        }];

        var _notify = function(obj, key, ev){
        
            if ((obj = (obj && obj[key]))) {
            
                // broadcast to all listeners
                for (var rec = obj._first; rec; (rec.fn.call(rec.target, ev), rec=rec.next)) {}
            
                return true;
            }
        
            // inform that event still not handled
            ev.callback && ev.callback(Object.error(Object.error.NOT_FOUND, ev.uri));
            return false;
        };
    
        /**
     * O.listen(key, handler) 
     * @register adds an event {#handler} for {#type}
     */
        O.listen = function(key, handler, target, cb) {
            
            var obj=$R, p=-1,p1=-1, k;
        
            for(; (p=key.indexOf('.',p1=p+1))>-1; obj = (obj[k=key.substring(p1,p)]|| (obj[k]={}))) {}
        
            obj = (obj[k=(p1?key.substring(p1):key)] || (obj[k]={}));
            
            var rec = {
                fn : handler,
                target : target || null
            };
        
            if (obj._last) {
            
                obj._last.next = rec;
                rec.prev = obj._last;
            
            } else {
            
                obj._first=rec;
            
            }
        
            obj._last = rec;
        
            cb &&  cb.call(rec.target, rec, obj);
        };

        /**
     * O.notify(event, type)
     * @notify broadcasts event to all handlers that listen appropriate event type
     */
        O.notify = function(ev, cb) {
            
            if ((typeof(ev)==='string') || ev.isUri) {
                ev = {
                    uri:ev
                };
            }
            
            if (typeof(ev.uri)==='string') {
                ev.uri = O.parseUri(ev.uri);
            }
            
            // negotiate key    
            var key = ev.uri.kind || ev.uri.type || 'default';
            
            // eliminate kind
            ev.uri.kind = null;

            // ensure callback
            ev.callback = cb || ev.callback || Function.NONE;

            // wrap array of callbacks with single one
            if (Array.isArray(ev.callback)){

                var cbs  = _opArgg0.concat(ev.callback);
            
                ev.callback = function() {
                    Function.perform(cbs, arguments);
                }
            }
            
            //search bundle
            for(var obj=$R, p=-1,p1=-1; obj && (p=key.indexOf('.',p1=p+1))>-1; obj = obj[key.substring(p1,p)]) {}
        
            if (p1) {
                key = key.substring(p1);
            }

            return _notify(obj, key, ev);
        };
        
        // @private do not use it in your code!!!
        O.notify2 = function(key1, key2, ev){
        
            _notify($R[key1], key2, ev);
        };
  
        /**
     * O.unlisten(key)
     * @unregister removes all handlers for given event type
     */
        O.unlisten = function(key) {
        
            for(var obj=$R, p=-1,p1=-1; obj && (p=key.indexOf('.',p1=p+1))>-1; obj = obj[key.substring(p1,p)]) {}
            
            if (p1) {
            
                key = key.substring(p1);
            }
            
            if (obj && obj[key]) {
            
                delete obj[key];
            }
        };
        
        /**
     * O.unlisten._all(key)
     * @private do not use it in your code!!!
     * @unregister all
     */
     O.unlisten._all = function() {
            return $R = {};
        
     };
        
        /**
     * O.unlisten._removeRecord(key)
     * @private do not use it in your code!!!
     * @unregister just one record from obj bundle
     */
     O.unlisten._removeRecord = function(rec, obj) {
        
            return (
                ((rec.next) ? (rec.next.prev = rec.prev) : (obj._last = rec.prev || null))
                ,
                ((rec.prev) ? (rec.prev.next = rec.next) : (obj._first = null))
                ,
                rec
                );
        };
 
    })({});

})();
