/**
 *==========================================================================
 * Axio: Localization resources.
 *==========================================================================
 */
    
// @returns localized (or at least normalized) version of [s]
String.localize = (function(_cache, fn) {
    
    var _undef, RE = new RegExp('_','g')
    ,
    normalize= function(s){
        
        return String.capitalize(s).replace(RE, ' ')
        
    }
    ,
    extractVal = function(v, id, lng){
        
        v = v.value || v.name || v;
        return (typeof(v)==='string')? v : (v[lng] || normalize(id));
        
    }
    ,
    _getArr = (function(v, i , lng){
        
        if (v.id!='_array'){
            this.push(Object.update(Object.clone(v),{
                name:extractVal(v, v.id, lng)
            }));
        }
        
    }).iterator()
    ,
    _getArr2 = function(obj , lng){
        
        var r = [];
        
        for (var id in obj ) {
            
            if (id!='_array'){
                
                var value = obj[id];
                r.push(Object.update(Object.clone(value),{
                    id:id, 
                    name:extractVal(value, id, lng)
                }))
            }
        }
        
        return r;
    }
    ,
    _localize = function(l, s, q) {
        
        var c = _lcache(l),r;
        return ((r = (c[s] || normalize(s)), (q!==_undef) ? (c[s + "." + q] || String.format(r, q)): r));
        
    }
    ,
    _lcache = function(l) {
        
        return _cache[l] || (_cache[l]={});
        
    };
            
    fn = function(s, q) {
        
        return !s ? '' : _localize(String.LANGUAGE,s,q);
        
    };
    fn.all = _cache;
        
    // localize with {#language} in first arg
    fn.withLanguage = _localize;
        
    // used to add localization bundle
    fn.addBundle = (function() {
        
        return function(obj, _lng) {
            
            var lngs = _lng ? [_lng] : String.LANGUAGES;
            
            for (var id in obj ) {
                var val = obj[id];
                
                for ( var j = 0, l = lngs.length; j < l; j++) {
                    
                    var lng = lngs[j];
                    (_lcache(lng))[id] = (val && val._array) ? _getArr2(val, lng) : (Array.isArray(val)?_getArr(val,[], lng):extractVal(val,id,lng));
                }
            }
            
            return obj;
        };
    })();
        
    fn.put = function(key, value, lang) {
        
        (_lcache(lang || String.LANGUAGE))[key] = value;
        
    }
    
    // async string localization handler
    Object.entity.create({
        id:'EventHandler:string'
        , 
        handleEventImpl:function(ev) {
            
            ev.callback(null, fn(ev.uri.host))
            
        }
        
    });
    
    return fn;
    
})({});
    

