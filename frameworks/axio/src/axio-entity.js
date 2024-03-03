/**
 * Axio:Entity. Entity framework.
 * 
 *  It allows define types, create entity instances and get them by id:
 *      Object.entity('id')
 *      Object.entity.define(meta)
 *      Object.entity.create(meta)
 * 
 */
( function() {
    
    var O = Object;

    // entities registry
    var ALL={};
    
    // entity types registry
    var TYPES={};
    
    // entity counter used as guid
    var TOTAL=0;
    
    // unregisters entity
    var REMOVE_FROM_ALL = function(T){
        delete ALL[T.id];
    };
    
    // parses meta info for entity
    var _parseMeta =  function(url) {
        
        if (url[0]==='{') {
            return O.parse(url);
        }
        
        var u = O.parseUri(url), id= u.hash;
        
        var r = O.update({
            id : (u.type||"box") +(id?(':'+id):'')
        }, u.params);
        
        if (u.steps.length) {
            r.style =u.steps.join(' ');
        }
        
        if (u.kind) {
            r.domNodeType = u.kind;
        }
        
        return  r;
    };
    
    //overrides methods.
    var _applyMethods = function(ftor)  {  
        
        if (ftor) {
            
            var _super = {}, methods = ftor(_super);
            
            for (var n in methods) {
                
                _super[n] = this[n] || Function.NONE;
                this[n] = methods[n];
                
            }
        }  
        
    };
   
    //@get entity constructor or creates/register a new one.
    var _getType = function(t, superType) {
        
        if (!t || !(t = TYPES[t])) return null;
        
        if (!t.ctor && (!(superType = t.superTypeId) || (superType = _getType(superType)))) {
            t.ctor = _createCtor(t, superType) ;
        }
        
        return t;
    };
    
    //@creates a new one entity constructor.
    var _createCtor = function(type, superType)  {
        
        var ctor = function(){
            this.__finalizers = [];
        };
        var _proto = ctor.prototype =  {};
        var superCtor =  null;
        
        ctor.applyMethods = _applyMethods;
        ctor.propList = [];
        ctor.properties = {};
        
        if (superType) {
            
            superCtor = superType.ctor;
            O.update(_proto, superCtor.prototype);
            Array.prototype.push.apply(ctor.propList, superCtor.propList);
            O.update(ctor.properties, superCtor.properties);
            
        }
        if (type.properties) {
            
            for(var i=0, l=type.properties.length;i<l;i++) {
                
                var id = type.properties[i], ptype = "*", v = id.split(':');
                
                if (v.length>1){
                    ptype=v[0] || v[1];
                    id=v[1];
                }
                
                if (ctor.properties[id]) {
                    throw new Error('ERROR: Duplicate property in entity type: '+id);
                }
                
                var prop = O.property(id, ptype);
                ctor.propList.push(prop);
                ctor.properties[id] = prop;
                prop.attachToEntityCtor(ctor);
                
            }
        }
        
        // apply initial values
        O.update(_proto, type.initials);
        
        // apply methods 
        _applyMethods.call(_proto, type.methods);

        // explicit constructor
        ctor.prototype.constructor = ctor;
        
        return ctor;
    };
    
    // entity home
    var $ = O.entity = function(id) {
        
        return id ? (id._id? id : ALL[id]) : null;
        
    };
 
    // @define a new entity {#type}
    // @!just register at this time. Actual type constructor will be created on demand.
    $.define = function (id, meta) {
        
        if (!meta) {
            
            meta = id;
            id  = meta.id;
            
        }
        
        var type = {
            initials:meta,
            superTypeId:meta.superType||(id==='entity'?null:'entity'), 
            properties:meta.properties,
            methods:meta.methods
        };
        
        var p = id.lastIndexOf(' extends ');
        if (p !== -1) {
            type.superTypeId = id.substring(p+9);
            id = id.substring(0,p);
        } 
        
        delete meta.properties;
        delete meta.methods;
        delete meta.superType;
        delete meta.id;
        
        if (id) {
            TYPES[id] = type;
        }
        
        return type;
        
    };
   
    //@get entity constructor or creates/register a new one.
    var _resolveTypeAsync = function(type,  cb) {
        
        if (!$.ENTITY_TYPE_FACTORY_URL) {
            return false;
        }
                
        O.notify(String.format($.ENTITY_TYPE_FACTORY_URL, type), function(err) {
                
            var _type = _getType(type);
                    
            if (err || !(_type)){
                    
                cb && cb(err || O.error('ERROR: Can\'t resolve entity type: '+type));
                    
            } else {
                
                // check for super type recursively
                if (_type.superTypeId && !_getType(_type.superTypeId)) {
                    
                    _resolveTypeAsync(_type.superTypeId, cb);
                    
                } else {
                    
                    cb();
                    
                }
            }
                
        });
                
        return true;
            
    };

    // @create a new entity instance.
    // @param r - metainfo object for instance: 
    // ex.: {id:"Type:[id]", properties:['prop1',...], prop1: initialValue,prop1Changed:function(ev, value){} }
    $.create = function(r, cb)
    {
        // parse if string notation
        if (typeof(r)==='string') {
            r = _parseMeta(r);
        }
        // identity
        var ids = r.id.split(':'), obj, type = ids[0];
        
        var _type =  _getType(type);           
            
        if (!_type || !_getType(_type.superTypeId)) {
            
            // try to use type factory if defined
            if (!_resolveTypeAsync(!_type ? type : _type.superTypeId, function(err){
                if (err) {
                    O.error.log(err);
                } else {
                    $.create(r, cb);
                }
                
            })) {
                
                O.error.log('ERROR: No such entity type: '+type); 
                
            }
            
            return null;
        }

        // prepare type and instantiate
        if (r.properties || r.methods) {
            
            // inline type
            obj = new (_createCtor($.define(type + (++TOTAL),O.clone(r)), _type))();
            
        } else {
            
            // regular instance
            obj = O.update(new (_type.ctor)(),r); 
            
        }
        
        // unique identity
        obj.id = obj._id = (type + (++TOTAL));
        
        // register if has own id
        if (ids[1]) {
            
            ALL[obj.id = ids[1]] = obj;
            
        }
        
        // add unregister finalizer
        obj.addFinalizer(REMOVE_FROM_ALL);
        
        // initialize
        if (obj.requires) {
            
            // resolve dependencies
            Object.require(obj.requires, function(err){
                
                err ? Object.error.log(err) : obj.init();
                
                cb && cb(err, obj);
                
            });
            
        } else {
            
            // instant init 
            obj.init();

            cb && cb(null, obj);

        }
        
        return obj;
    };

    $.create.parseMeta = _parseMeta;

    // @define The basic [entity] entity type.
    $.define('entity', {
        methods : function () {
        
            var _undef;
            
            var _referrer = function(){
                
                var ref = this.referrer;
                if (ref) {
                    
                    ref = ref.split ? ref.split('.') : ref;
                    
                    var target = ((ref[0]==='parent') ? this.parentEntity : $(ref[0])), key = ref[1];
                    
                    target[key]  = (this._done ? null : this);
                    
                }
                
            };
            
            // prop init operator
            var PROP_INIT_OP = function(p) {
                p.init(this);
            };
                    
            return {
                // initializes entity
                init : function() {
                    
                    this.transaction = {keys:[], touch:1};
                    
                    // init all declared properties
                    Function.iterate(PROP_INIT_OP, this.constructor.propList, this);
                    
                    // assign this for other entities
                    _referrer.call(this);
                    
                    this.handleEvent && O.listen(this.id, this.handleEvent, this);
                    
                    this.transaction.touched--;
                    
                    this.commitProperties(null);
                }
                ,
                // done entity
                done : function() {
                    
                    // unlisten all
                    O.unlisten(this.id);
                    
                    // perform all finalizers
                    for (var fzs = this.__finalizers, i= fzs.length; i; fzs[--i](this)) {}
                    
                    delete this.__finalizers;
                    
                    // mark done
                    this._done = true;
                    
                    // un-assign this from other entities
                    _referrer.call(this);
                }
                ,
                // add a some finalizer function to be invoked at done();
                addFinalizer: function(f){
                    
                    !this._done && this.__finalizers.push(f);
                    
                }
                ,
                // get property value
                getProperty : function (key) {
                    
                    return this._get(key);
                    
                }            
                ,
                // set property value
                setProperty : function (key, val) {
                    
                    this._set(key, {
                        value:(val===_undef)?null:val
                    });
                    
                    return this;
                }
                ,
                // inc property value
                incrementProperty : function (key, inc, def) {
                    
                    return this.setProperty(key,(this.getProperty(key)||(def===_undef?0:def))+(inc||1));
                    
                }
                ,
                // internal get property value
                _get : function (key) {
                    
                    return this.constructor.properties[key] ? this._prop(key).getValue(this) : this[key];
                    
                }
                ,
                // get property instance by key
                // Creates new one if none exists yet.
                _prop : function (key) {
                    
                    return this.constructor.properties[key] || (this.constructor.properties[key] = Object.property(key,"*"));
                    
                }
                ,
                // internal set property value
                _set : function (key, val, asyncUrl, force) {
                    
                    // prevent execution for finalized entity
                    if (!this._done) {
                        
                        if (val && (val.value!==_undef)) {
				var s=1;
				//no
                        } else {
                            // wrap value into event instance
                            val = {
                                value:val
                            };
                        }
                        
                        this.transaction.touched++;
                        this.transaction.keys.push(key);
                        
                        this._prop(key).setValue(this, val, asyncUrl, force);
                        
                        this.transaction.touched--;
                        
                        if (this.transaction.touched===0){
                            this.commitProperties(this.transaction.keys);
                            this.transaction = {keys:[], touch:0}
                        }
                        
                    }
                    
                }
                ,
                // notifies about property changed in batch
                commitProperties : function(keys) {
                    
                }
                ,
                // notifies about its property changed
                notifyPropertyChanged : function(propId, ev) {
                    
                    ev.entity = this;
                    ev.propId = propId;
                    
                    Object.notify2(this.id, propId, ev);
                    
                }
                ,
                // toString
                toString : function() {
                    
                    return '[entity:'+(this.id)+']';
                    
                }
            }
        }
    });
    
})();