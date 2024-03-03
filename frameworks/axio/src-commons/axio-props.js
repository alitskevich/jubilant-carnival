/* 
 * Axio: Basic property types.
 */
        
// @property [nonequal].
Object.property.define('nonequal', function(propId) { 
    
    return {
        // value comparator
        comparator : Function.FALSE
    };
    
});

// @property [boolean].
Object.property.define('boolean', function(propId) { 
    
    return {
        // setter
        setter : function(v) {
            
            return this[propId] = !!v;// narrow to boolean
            
        }
        ,
        // value comparator
        comparator : function(a, b) {
            
            return (!a)==(!b); // compares as boolean
            
        }
    }
    
});

// @property [number].
Object.property.define('number', function(propId) { 
    
    return {

        // setter
        setter : function(v) {
            
            // narrow to number or 0 by default
            return this[propId] = v && Number(v) || 0;
            
        }
        ,
        // value comparator
        comparator : function(a, b) {
            
            return Number(a)===Number(b);
            
        }
    };
    
});

// @property [date].
Object.property.define('date', function(propId) { 
    
    return {

        // value comparator
        comparator : function(a, b) {
            
            return Date.compare(a, b)==0;
            
        }
    };
    
});

// @property [value].
Object.property.define('value', null, function(_super) {
    
    return {
            
        // @get value 
        getValue : function() {
                
            return this.getProperty('value');
                
        }
        ,
        // @set value 
        setValue : function(v) {
                
            this._set('value', v);
                
        }
        ,
        // @check if value is empty
        isEmptyValue : function(e) {
                
            return !this.getValue();
                
        }
        ,
        // @check if value equals to 
        hasValue : function(v){
                
            return v && (this.getValue()===(''+v));
                
        }
    }
});
        
        
/* 
 * Axio: Complex property types.
 */
  
// @property [valueRange].
// It provides value range logic.
Object.property.define('valueRange'
    ,
    function(propId) {
        
        return {

            //patch entity type with some related methods.
            init: Function.NONE
            ,
            // value setter
            setter : function(v) {
                
                var v0 = this.valueRangePartAdapter(v[0]);
                var v1 = this.valueRangePartAdapter(v[1]);
                
                this._valueRangeLocked = (this._valueRangeLocked||0)+1;
                
                this.setProperty('valueMin', v0);
                this.setProperty('valueMax', v1);
                this.setProperty('value', this.valueFromParts(v0, v1));
                
                this._valueRangeLocked--;
                
                this[propId] = [v0, v1];
                
                return v;
            }
            ,
            // value comparator
            comparator : function(a,b) {
                
                return (!a && !b) || (a && b && a.length>1 && (a.length===b.length) && (a[0]===b[0]) && (a[1]===b[1]));
                
            }
        }
    }
    ,
    // patch entity type attached to
    function(_super) {
        
        return {
        
            //@hook on [value] value is changed
            valueChanged : function(ev,v) {
                
                if (!this._valueRangeLocked) {
                    
                    this._valueRangeLocked = (this._valueRangeLocked||0)+1;
                    
                    this.setProperty('valueRange', (v && v.split && (v=v.split('-')) && (v.length>1)) ? v : [null,null] );
                    
                    _super.valueChanged.call(this, ev, v);
                    
                    this._valueRangeLocked--;
                    
                }
            }
            ,
            //@hook on [valueMin] value is changed
            valueMinChanged : function(ev, v) {
                
                if (!this._valueRangeLocked) {
                    
                    this.setProperty('value', this.valueFromParts(v,this.valueMax));
                }
            }
            ,
            //@hook on [valueMax] value is changed
            valueMaxChanged : function(ev, v) {
                
                if (!this._valueRangeLocked) {
                    
                    this.setProperty('value', this.valueFromParts(this.valueMin,v) );
                }
            }
            ,
            // @adapt part of value 
            valueRangePartAdapter : Function.NONE
            ,
            // @get value from parts
            valueFromParts : function(min,max) {
                
                return ''+(min||'') + '-' + (max||'');
                
            }
        }
    });


// @property [multiValue].
// It provides value multiset logic.
Object.property.define('multiValue'
    , 
    null
    , 
    // patch entity type attached to
    function(_super) {
        
        return {
            
            valueChanged : function(ev, v) {
                
                this.setProperty('mvalue',  v ? ((v.split && v.length) ? v.split(this.mvalueSeparator||",") : [''+v]) : []);
                
                _super.valueChanged.call(this, ev, v);
                
            }
            ,
            getMultiValue : function(){
                
                return this.mvalue || [];
                
            }
            ,
            hasValue : function(v){
                
                return v && (this.getMultiValue().indexOf(''+v) != -1);
                
            }
            ,
            putIntoMultiValue : function(pk, v){
                
                if (!pk) {
                    return;
                }
                
                var mv = this.getMultiValue();
                
                pk = '' + pk;
                
                var contained = (mv.indexOf(pk) != -1);
                var changed = false;
                
                if (v === -1){
                    
                    v = contained ? 0 : 1;
                    
                }
                
                if ((v) && !contained){
                    
                    mv.push(pk);
                    changed = true;
                    
                }
                
                if ((!v) && contained){
                    
                    for ( var i = 0, l = mv.length; i < l; i++){
                        
                        if (pk === mv[i]){
                            
                            mv.splice(i, 1);
                            changed = true;
                            
                            break;
                            
                        }
                    }
                }
                
                changed && this.setValue(mv.sort().join(this.mvalueSeparator));
                
            }
        }
    });

// @property [batchedProperties].
// It patches entity type with ability to property changes in batch.
Object.property.define('batchedProperties'
    ,
    null
    ,
    // patch entity type attached to
    function(_super) { 
        var _undef;
        return  {
            init : function() {
                
                this._changeEvent = {
                    entity:this, 
                    counter:0, 
                    delta : {}
                };
                
                _super.init.call(this);
                
            }
            ,
            // do something inside batch
            batch : function (fn) {
                
                this._touch.counter++;
                fn&& fn.apply(this, Array.prototype.slice.call(arguments,1));
                
                if (!(--this._touch.counter)) {
                    this.changed();
                }
            }
            ,
            // @hook on touch ended
            changed : function () {
                
                this.notifyPropertyChanged('changed',this._changeEvent);
                this._changeEvent.delta = {};
                
            }
            ,
            // @set property value
            _set : function (key, val, asyncUrl, force) {
                
                // prevent execution for finalized entity
                if (!this._done) {
                    if (val && (val.value!==_undef || val.asyncUrl)) {
                        // extract asyncUrl if any
                        if (val.asyncUrl) {
                            asyncUrl = val.asyncUrl;
                            delete val.asyncUrl;
                        } 
                    } else {
                        // wrap value into event instance
                        val = {
                            value:val
                        };
                    }
                    
                    var che = this._changeEvent;
                    che.delta[key]=val.value;
                    che.counter++;
                    
                    this._prop(key).setValue(this, val, asyncUrl, force);
                    
                    if (!(--che.counter)) {
                        
                        this.changed();
                        
                    }
                }
            }
        }
    }
    );


// @property [valueBundle].
// It manage a set of dynamic properties as part of [value] property bundle.
Object.property.define('valueBundle'
    ,
    null
    ,
    // patch entity type attached to
    function(_super) { 
        
        var     
        __allKeys = function(obj) {
            
            var r={};
            for (var key in obj) {
                r[key] = null;
            } 
            return r;
        }
        ,
        __actualDelta = function(obj,oldV) {
            var r = [];  
            for(var n in obj) {
                if (obj.hasOwnProperty(n) && (oldV[n]!==obj[n])) {
                    r.push({
                        id:n,
                        value:obj[n]
                    });
                }
            }
            return r;
        }
        ;
        
        return  {
            
            setValue : function(d) {
                
                this._set('value', d||__allKeys(this.value));
                
            }
            ,
            _get : function (key) {
                
                return (key==='value')?this.value:(this.value?this.value[key]:null);
                
            }
            ,
            _set : function (key, v) {
                
                var _undef;
                if (!this._done) {
                    
                    if (!(v && (v.value!==_undef))) {
                        v = {
                            value:v
                        };
                    }
                    
                    if (!this.write_counter) {
                        
                        this.write_counter=1;
                        var delta;
                        
                        if (key!=='value')
                        {
                            delta = {}
                            delta[key] = v.value;
                        } else {
                            delta = v.value; 
                        }
                        
                        this.update(delta);
                        this.write_counter--;
                        
                    } else {
                        
                        this.delayedDelta = this.delayedDelta||{}
                        this.delayedDelta[key] = v.value;
                        
                    }            
                }
            }
            ,
            update : function(dd) {
                
                var T=this, v = Object.clone(dd), oldV = Object.clone(T.value||{});
                var deltaArr = __actualDelta(v, oldV);
                
                if (deltaArr.length) {
                    
                    if (this.__update(v, false, oldV)) {
                        
                        var ev1 = {
                            entity:T, 
                            oldValue:oldV,  
                            value: T.value
                        }
                        
                        // hook
                        var hook = T.valueChanged;
                        hook && hook.call(T, ev1, ev1.value);
                        
                        // notify
                        T.notifyPropertyChanged( 'value', ev1);
                    }
                }
            }
            ,
            __update : function(delta, hasChanges, oldV) {
                
                this.value = this.value||{};
                var T=this, deltaArr = __actualDelta(delta, oldV);
                
                for (var i=0;i<deltaArr.length;i++) {
                    var e=deltaArr[i], id=e.id;
                    var ev0 = {
                        entity:T, 
                        oldValue:oldV[id],  
                        value: e.value
                    }
                    T.value[id] = e.value;
                    //Object.debug('Update::'+T.id+'.'+id+'=', e.value);
                    // hook
                    var hook = T[id+"Changed"];
                    hook && hook.call(T, ev0, ev0.value);
                    // notify
                    T.notifyPropertyChanged(id, ev0);
                    hasChanges = true;
                }
                
                if (this.delayedDelta) {
                    delta = T.delayedDelta;
                    T.delayedDelta = null;
                    return T.__update(delta, hasChanges, oldV);
                }
                
                return hasChanges;
            }
        }
    });

/**
 * Axio:Entity. Entity framework.
 * Define [EventHandlerReady] property type
 * 
 */
Object.property.define('EventHandlerReady'
    ,
    null
    ,
    function(_super) {
        
        var hIterator = (function (ev) {
            
            this.handleEventImpl(ev);
            
        }).iterator();
        
        // no handler stub
        var HANDLER_STUB = function(ev) {
            ev.callback(Object.error.BAD, 'No operation defined: '+this.id+'.'+ev.uri.host)
        }; 
            
        return {
            // handles Event 
            handleEvent : function(ev){
                
                if (!this.isReady(ev)) {
                    
                    // The execution stack is to buffer up events.
                    (this.deferedEvents || (this.deferedEvents=[])).push(ev);
                    
                } else {
                    
                    this.handleEventImpl(ev);
                    
                }
            }
            ,
            // @return true if handler is ready to perform events
            isReady:function(ev) {
                
                return this.ready;
                
            }
            ,
            // @set ready flag to true
            setReady:function() {
                
                this.setProperty('ready', true);
            }
            ,
            // @set ready flag to true
            unsetReady:function() {
                
                this.setProperty('ready', false);
            }
            ,
            // evaluate defered events
            readyChanged:function(_ev, ready) {
                
                if (ready) {
                    
                    var evs = this.deferedEvents;
                    this.deferedEvents = null;
                    hIterator(evs, this);
                    
                }
            }
            ,
            // handles Event implementation
            handleEventImpl: function(ev) {
                
                ((this.eventHandlers||this)[ev.uri.host] || HANDLER_STUB).call(this, ev);
                
                this.incrementProperty('eventCounter');
                
            }
        }
    });
    
// @define The basic [EventHandler] entity type.
Object.entity.define('EventHandler', {
        
    properties:['EventHandlerReady:ready']
    ,
    ready: true // ready by default
});

