/**
 * Axio:Entity. Entity framework.
 * 
 *  It allows define property type:
 *      Object.property.define(id, meta, entityPatcher)
 * 
 */
(function(O) {
     
    var _undef;
    
    // property types
    var TYPES={}; 
    
    // all properties registry
    var ALL={};
    
    // applies methods over
    var _applyMethods = function (ftor, id)  {  
        
        if (ftor) {
            
            var _super = {}, methods = ftor(id, _super);
            
            for (var n in methods) {
                
                if ((typeof (methods[n]) === 'function')) {
                    _super[n] = this[n] || Function.NONE;
                }
                
                this[n] = methods[n];
                
            }
        } 
        
    };
    
    var defaultFactory = function(propId) {

        // async value adapter. used in setAsyncValue() callback by default.
        var _asyncAdapter = function(err, value) { 
            return value;
        }

        var OBJ_VALUE_NULL = {
            value:null
        };

        return {
            id: propId
            ,
            asyncTarget : (propId.substr(propId.length-3)==='Url') ? propId.substring(0, propId.length - 3) : null
            ,

            // invoked when property attached to entity type
            // by default applies patches to entity type
            attachToEntityCtor: function(ctor){

                ctor.applyMethods.call(ctor.prototype, this.entityPatcher);

            }
            ,
            // Property initialization for given entity
            // invoked at entity.init()
            // @param T  entity instance
            init : function(T) {

                var v = T[propId];

                // set initial value if any
                if (v !== _undef) {

                    delete T[propId];

                    T._set(propId,{
                        value:v
                    }, _undef, true);

                }

                // dynamically init async url if any
                if ((T[propId+'Url'] !== _undef) || (T[propId+'UrlExpression'] !== _undef)) {

                    O.property(propId+'Url').init(T);

                }

                //bind expression if any
                if ((v=T[propId+'Expression']) !== _undef) {

                    O.property.bind(T, propId, v);

                }

                T.addFinalizer(this.done);

            }
            ,
            // finalizer for given property
            // invoked at entity.done()
            // @param T  entity instance
            done : function(T) {

                delete T[propId];

            }
            ,
            // value comparator
            comparator : function(v1, v2) {

                return v1 === v2;

            }
            ,
            // value setter.
            // Indirect value persisting realization.
            // @this entity instance
            setter : function(value) {

                return this[propId] = value;

            }
            ,
            // @get property value.
            // @param T  entity instance
            getValue : function(T) {

                return T[propId];

            }
            ,
            // Callback used in Sets property value from async url.
            // used in Property.setAsyncValue() as callback
            // calls event adapters: from entity or default if none
            createAsyncValueCallback : function(T) { 

                return  function(err, value) {

                    !T._done && T._set(propId, (T[propId+"AsyncAdapter"] || _asyncAdapter).call(T,err, value));

                };

            }
            ,
            // @set async property value.
            setAsyncValue : function(T, url) {

                O.notify(url, this.createAsyncValueCallback(T));

            }
            ,
            // @set property value. 
            // invoked from entity.setProperty()
            // @param T  entity instance
            // @param ev event object containing value to set
            // @param url async listener target url to obtain value from
            // @param force forces value set flow regardless comparator
            setValue : function(T, ev, url, force) {

                var v = ev.value,  oldV, hook;

                if ((v !== _undef) && (force || !this.comparator(v, (oldV = this.getValue(T)))) ) {

                    ev.entity=T;

                    ev.oldValue = oldV;

                    // actually set
                    this.setter.call(T, v, ev);

                    // async set for target property
                    this.asyncTarget && v && T._set(this.asyncTarget, O.clone(ev, OBJ_VALUE_NULL), v);

                    // hook
                    (hook = T[propId+"Changed"]) && hook.call(T, ev, v);

                    // notify dependensies
                    T.notifyPropertyChanged(propId, ev);
                }

                url && this.setAsyncValue(T, url);

            }
        };
    }
    
    // property factory
    O.property = function (id, typeId) {
        
        if (!id) return null;
        
        typeId = typeId || "*";
        
        var prop = ALL[typeId+":"+id];
        
        if (prop) {
            return prop;
        }
      
        prop = defaultFactory(id);
        
        if (typeId!=='*') {
            
            var type = TYPES[typeId];
            
            if (!type) {
                throw new Error('ERROR: No such property type: '+typeId);
            }
             
            _applyMethods.call(prop, type.factory, id);
            
            prop.entityPatcher = type.entityPatcher;
        }
        
        return  (ALL[typeId+":"+id] = prop);
               
    };
    
    // @define a property type
    O.property.define = function(id, factory, entityPatcher) {
 
        TYPES[id] = {
            entityPatcher : entityPatcher, 
            factory : factory
        };
    } 

})(Object);


/* 
 * Axio: Entity property binding.
 */

// @bind property value with expression
Object.property.bind =  (function(O, _undef) {
    
    // parses and compile binding from expression
    var compileTemplate = function(s, tId){
        
        var  posB, posE = 0, src = [], path, p, prop, eId, opts, doublebind, req;
        
        while (	((posB = s.indexOf('${', posE)) > -1)&& ((posE = s.indexOf('}', posB)) > -1) ) {
            
            path = s.substring(posB + 2, posE);
            
            if ((p = path.lastIndexOf('|'))>-1) {
                opts = path.substring(p+1).split(',');
                path = path.substring(0,p);
            }

            req = (path[0]==='*');
            
            
            if ((path[0]===' ') || req) {

                path = path.substring(1);

            }

            if ((p = path.lastIndexOf('.'))==-1) {
                    
                eId  =path;
                path +='.value';
                prop = 'value';
                    
            } else {
                    
                eId = path.substring(0,p);
                prop = path.substring(p+1);
                    
            }
                
            if (eId==='@' || eId==='this') {
                    
                eId = tId;
                path = eId+'.'+prop;
                    
            }
            
            if (!Array.findByAttr(src,path,'id')) {
                
                var sItem = {
                    id: path,
                    required : req || opts && opts.indexOf('required')>-1,
                    entityId : eId ,
                    propName : prop
                };
                
                src.push(sItem);
                
                if (opts && opts.indexOf('doublebind')>-1) {
                    doublebind = sItem;
                }
            }
            
            s= s.substring(0, posB) + '$V["' + path + '"]' + s.substring(posE + 1)
        }
        
        return {
            sources:src,
            body : s,
            doublebind: doublebind
        };
    };

    // collect source values
    var collectValuesFromSources = (function (p)
    {
        
        if (this.__incomplete) {
            return;
        }
        
        var w = O.entity(p.entityId);
        if (!w) {
            
            // if not all sources ready - prevent binding
            this.__incomplete = true;
            
        } else {
            
            this[p.id] = w._get(p.propName);
        
            if ((this[p.id]===_undef) || (p.required && !(this[p.id]))) {
            
                this.__incomplete = true;
            
            }
        }
        
        
    }).iterator();
    
    // subscriber callback
    var subscriberCb = function (rec, obj) {
        
        this.addFinalizer(function() {
            O.unlisten._removeRecord(rec, obj);
        });
    };
        
    return function(T, propName, value) {
        
        var bind = null, fn;
            
        var compiled = compileTemplate(value, T.id);
        
        try {
                
            fn = new Function('$V', 'return ' + compiled.body + ';');
            
        } catch (ex) {
             
            fn = function() {
                O.error.log(O.error.BAD,'Wrong binding expression: '+ex.message, compiled.body);
                return ex.message;
            }
                
        }
        
        // event handler
        bind= function(ev){
                
            var values = collectValuesFromSources(compiled.sources, {});
                
            if (!values.__incomplete) {
                    
                //                if (ev && ev.entity && !values[ev.entity.id+'.'+ev.propId]){
                //                        
                //                    values[ev.entity.id+'.'+ev.propId] = ev.value;
                //                }
                    
                T.setProperty(propName,fn.call(T, values));
                

            }
            var db = compiled.doublebind;
            if (db && !db.bound){
                //var propKey  = (!opts.key || opts.key==='value')?'':String.capitalize(opts.key);
                var target = O.entity(db.entityId);
                if (target) {
                    Object.property.bind(target, db.propName, '${'+T.id+'.'+propName+'}');
                    db.bound = true;
                }
            }
                
        };
            
        // subscribe all
        for (var i=0, ps = compiled.sources, l= ps.length; i<l; O.listen(ps[i++].id, bind, T, subscriberCb)) {}
        

        
        // perform binding immediately!!!
        bind();
    };
})(Object);

