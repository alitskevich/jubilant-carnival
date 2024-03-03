/* 
 * Axio Web client: local caching.
 */

// creates Channel handler that enables data cache in localStorage by versions.
Object.createVersionedCacheSource = function (config) { 
    var  _cache = {}
    ,
    _lstorage = window[(config.scope||'local')+'Storage']
    ,
    _ver = config.version || '0'
    ,
    _cacheDeserializer = config.cacheDeserializer || Object.parse
    , 
    _urlTemplate = config.urlTemplate || "{0}"
    ,
    _unmarshaller = config.unmarshaller || Function.NONE; // force plain result


    if (typeof(_ver)=='function') {
        _ver = _ver(config);
        
    }

    if ((_ver==-1) || !_lstorage){
        return config.noVersionHandler || function(ev){
            var u = ev.uri, id = u.id.substring(2);
            var cb = function(err, data) {
                var rr = null;
                if (!err && data){
                    rr = _cacheDeserializer.call(id, data);
                } 
                ev.callback(err, rr);
            };
            Object.notify({
                uri:String.format(_urlTemplate,id)
                ,
                callback:cb
                ,
                unmarshaller: _unmarshaller
            });           
        }
    }

    return function(ev){
        var u = ev.uri, id = u.id.substring(2), key=u.type+':'+id, r = _cache[id];
           
        // try local storage
        if (!r && (r = _lstorage[key]) && (r.indexOf(_ver+":")===0) && (r = r.substring(_ver.length+1)) ) {
            r = _cache[id] = _cacheDeserializer.call(id, r);
        } else {
            r = null;
        }
           
        if (r) {
            ev.callback(null, r);
        } else {
            var cb = function(err, data) {
                var rr = null;
                if (err) {
                    Object.error.log('fetch data for versioned cache',id , err);
                } else if (data) {
                    rr = _cache[id] = (typeof(data)==='object')?data:_cacheDeserializer.call(id, data);
                    try {
                        _lstorage.setItem(key, (_ver+":"+((typeof(data)==='object')?JSON.stringify(data):data)));
                    }
                    catch (e) {
                    // Object.log('set item of versioned cache', id,  e);
                    }
                } 
                ev.callback(err, rr);
            };
            
            Object.notify({
                uri:String.format(_urlTemplate, id)
                ,
                callback:cb
                ,
                unmarshaller: _unmarshaller
            });           
        }
    };
};

Object.cache = {
    createSource : Object.createVersionedCacheSource
    ,
    createJSSource: function(version, urlTemplate, key) {
        // register async listener for cached js
        urlTemplate = urlTemplate|| ('/js/{0}.js?v='+version);
        Object.entity.create({
            id:'EventHandler:'+(key||'js')
            ,
            handleEvent: this.createSource({
                version: version, 
                urlTemplate: '[remote]'+urlTemplate,
                cacheDeserializer: function(s) {
                    try {
                        (Function.call(Function, s))()
                        return true;
                    } catch (ex) {
                        Object.error.log(Object.error.BAD, 'JS syntax: '+ex.message,s);
                    }
                    return null;
                }
                ,
                noVersionHandler:function(ev) {
                    var u = ev.uri;
                    Object.require(['[script]'+String.format(urlTemplate, u.id.substring(2))], ev.callback);
                }
            })
        });
    }
    ,
    createL10NSource: function(version, urlTemplate, key) {
        // register async listener for L10N API calls
        Object.entity.create({
            id:'EventHandler:'+(key||'l10n')
            ,
            handleEvent: this.createSource({
                version: version, 
                urlTemplate: '[remote]'+(urlTemplate || ('/l10n/l10n-{0}.js?v='+version)),
                cacheDeserializer:  function(str) {
                    try {
                        String.localize.addBundle((Function.call(Function, str))());
                        return true;
                    } catch (e) {
                        Object.error.log('Object.parse', str, e);
                    }
                    return null;
                }
            })
        });
    }
};



//## [CachedResourceProvider] component:
Object.entity.define('CachedResourceProvider extends EventHandler', {
    urlTemplate : "{0}"
    ,
    version:-1
    ,
    scope : 'local'
    ,
    methods : function (_super) {
        return {
            init : function() {
                _super.init.call(this);
                
                this.handleEventImpl = Object.createVersionedCacheSource({
                    version: this.version, 
                    urlTemplate: this.urlTemplate,
                    cacheDeserializer : this.cacheDeserializer,
                    scope: this.scope
                });
            }
        }
    }
});
    
