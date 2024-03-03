
/**
 * Axio: Web client remoting.
 */

// MIME type by extension registry. Used for XHR.
Object.MIME={
    'json': 'application/json',
    'js': 'application/json',
    'html': 'text/html',
    'txt': 'text/plain'            
};

// Parsers for given resource type
Object.parsers = {
    'js': Object.parse,
    'json': Object.parse,
    'uri': Object.parseUri
};

//## Remoting source with XMLHttpRequest
(function(_win) {
   
    var _newRequest = function() {
        try {
            return new _win['XMLHttpRequest']();
        } catch (e) {
            try {
                return new _win.ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {}
        }
    }
    ,
    _error = function (st,text) {
        return (!st || (st>=200 && st<300) || (st===304))? null : {
            reason: 'remote_error',
            message: text ||'Remote error',
            code:st
        };
    }
    ,
    _negotiateResultType = function (u) {
        var urlId  = Array.item(u.path, -1), p, r = 'js';
        if (urlId && (p = urlId.lastIndexOf('.')) > -1) {
            r = urlId.substring(p + 1);
        }
        return r;
    }
    ,
    _perform = function (ev) {
        try {
            var rq = _newRequest();
            var dataType = ev.dataType || _negotiateResultType(ev.uri);
            rq['open'](ev.method || (ev.payload?"POST":"GET"), ''+ev.uri, true);
            
            rq.onreadystatechange = function() {
                if ((this.readyState == 4) && (!ev.completed)) {
                    ev.completed = true;
                    this.onreadystatechange = Function.NONE;
                    ev.callback(
                        _error(this.status,this.statusText)
                        ,
                        (ev.unmarshaller || Object.parsers[dataType] || Function.NONE)(this.responseText)
                        );
                }
                return false;
            };

            var headers =Object.update({
                'Accept':Object.MIME[dataType]||"*",
                'Language': String.LANGUAGE
            }, ev.headers);
            
            for (var h in headers) {
                if (headers[h]) {
                    rq.setRequestHeader(h, headers[h]);                
                }
            }

            if (ev.payload) {
                if (typeof(ev.payload)==='object') {
                    rq.setRequestHeader('Content-Type','application/json;charset=UTF-8');
                    ev.payload = JSON.stringify(ev.payload);
                }
                rq.send(ev.payload);
            } else {
                rq.send(null);
            }
            
        } catch (ex) {
            ev.callback(Object.error('remote_error','Failed remote request:'+ev.uri,ex));
        }
    };
    
    // Performs http request, unmarshalls response and calls back.
    Object.entity.create({
        id:'EventHandler:default', 
        handleEventImpl: _perform
    });      
    Object.entity.create({
        id:'EventHandler:remote', 
        handleEventImpl: _perform
    });    
    Object.entity.create({
        id:'EventHandler:http', 
        handleEventImpl: _perform
    });    
    Object.entity.create({
        id:'EventHandler:https', 
        handleEventImpl: _perform
    });    

})(this);

//## Remoting source with <SCRIPT> tag
(function(global, registry, counter) {
    var _doc  =global.document, isIE8 =!! _doc.all;
    // IE8 hack: onload event for scripts
    function onloadjs(js,func, errfn)
    {
        if(isIE8){
            js.onreadystatechange = function() {
                if (js.readyState === 'loaded' || js.readyState === 'complete') {
                    js.onreadystatechange = "";
                    func();
                }
            }
        }
        else {
            // most browsers
            js.onload = func;
            js.onerror = errfn;
        }
    }
    var _handler = function(ev) {
        var script = _doc.createElement('script');
        script.type = 'text/javascript';
        script.charset = 'utf-8';
        if (!ev.noAsynMode) {
            script.async = 'async';
        }
        
        if (ev.scriptId) {
            script.id = ev.scriptId;
        }
        
        if (ev.scriptAttrs) {
            Object.update(script, ev.scriptAttrs);
        }

        var u = ev.uri;
        if (u.type==='script') {
            u.type='http';
        }
        if (ev.callback) {
            onloadjs(script
                ,function(){
                    ev.callback(null, null, this);
                }
                ,function(){
                    ev.callback({
                        reason:'script error:' +u
                    })
                });
        }
        script.src = ''+u;
        Object.dom.appendToHead(script);
    };
    
    var _handlerJSONP = function(ev) {
        var script = _doc.createElement('script');
        script.type = 'text/javascript';
        script.charset = 'utf-8';
        script.async = 'async';

        var u = ev.uri;
        if ((u.type==='jsonp') || (u.type==='jsonps')) {
            u.type=(u.type==='jsonp')?'http':'https';
        }
        var sid = 'n'+counter++;
        u.params[u.params.jsonp||'callback']=escape('window._JSONP.' + sid)
        registry[sid] = function(r) {
            ev.callback(null, r);
        };
        onloadjs(script
            ,function() {
                script.parentNode.removeChild(script);
                delete registry[sid];
            }
            ,function(){
                ev.callback(Object.error('remote_error','JSONP script error:' +u))
            }
            );
        script.src = ''+u;
        Object.dom.appendToHead(script);
    };
    
  
    Object.entity.create({
        id:'EventHandler:script', 
        handleEventImpl: _handler
    });    
    Object.entity.create({
        id:'EventHandler:jsonp', 
        handleEventImpl: _handlerJSONP
    });    
    Object.entity.create({
        id:'EventHandler:jsonps', 
        handleEventImpl: _handlerJSONP
    });    
   
})(this, this._JSONP = {}, 0);


