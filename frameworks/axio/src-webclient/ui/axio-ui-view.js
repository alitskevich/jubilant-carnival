/**
 * Definitions of [view] and [box] entity types 
 * and its properties: [domNode], [style], [hidden] and [children].
 */
(function(_undef) {

    //## @entity UI [view] entity type. 
    // This is root entity type for all other types of UI views.
    // It just attaches three core UI properties: [domNode], [style] and [hidden].
    Object.entity.define('view', {
        properties:[':domNode',':style',':hidden']
    });

    //## @entity UI [box] entity type. 
    // Simplest UI container. 
    // It just extend  [view] entity type with [children] property.
    Object.entity.define('box extends view', {
        properties:[':children']
    });

    //## @property The [domNode] property of view
    // related entity attributes:
    // @attr domNodeType - DOM node tag 
    // @attr domNodeAttrs - DOM node attributes
    // @attr alive - force DOM event listening
    Object.property.define('domNode', function(propId) { 
        var $D = Object.dom;
        return {
            // first value init
            init : function(T)
            {
                var node = T.domNode;
                // create if none
                if (!node) {
                    var attrs={}
                    if (T.id!==T._id) {
                        attrs.id=T.id;
                    }
                    node = T.domNode = $D.createElement(T.domNodeType, Object.update(attrs,T.domNodeAttrs));
                }
                // children appended to 
                T.contentNode =  node;
                // back reference
                node.entity = T;
                // make alive if needed
                if (T.alive){
                    $D.alive(T);
                }
                
                if (T.parentEntity && (!node.parentNode || !node.parentNode.parentNode)) {//!T.isDomNodeEmbedded &&  && 
                    T.parentEntity.contentNode.appendChild(node);
                }                

                T.addFinalizer(this.done);
            }
            ,
            // done property with entity instance
            done : function(T)
            {
                var e = T.domNode;
                
                if (e)
                {
                    $D.removeElement(e);
                    
                    e.entity = null;
                    
                    delete T.domNode;
                    delete T.contentNode;
                }
            }
        }
    }    
    ,
    function(_super) {
        return {
            // Sets UI style attributes
            init : function() {
                
                _super.init.call(this);
                
            }
        }
    });

    //## @property The [style] property of view
    // related entity attributes:
    // @attr css - custom DOM node style 
    Object.property.define('style', function(propId) { 
        return {

            // @init 
            init : function(T)
            {
                var r = T.domNode;
                
                if (T.css) {
                    r.style.cssText += T.css;
                }
                
                if (T.styleExpression) {
                    Object.property.bind(T, this.id, T.styleExpression);
                }
                
                T.updateDomNodeClass((T.style||'') +' '+(r.className||''));
                
            }
            ,
            //@get value getter.
            getValue : function(T) {
                
                return T.domNode.className;
                
            }
            ,
            //@setter value
            setter : function(v, ev) {
                
                if (typeof v === 'string') {
                    this.updateDomNodeClass(v);
                } else {
                    this.updateDomNodeStyle(v);
                }
                
            }
        }
    }
    ,
    function(_super) {
        return {
            // Sets UI style attributes
            domNodeStyle : function(delta) {
                var v,n, st = this.domNode.style;
                
                if (delta) {
                    for (n in delta) {
                        v = delta[n];
                        if (st[n]!==v) {
                            st[n] = v;
                        }
                    }
                }
                
                return st;
            }
            ,
            // Updates UI style class
            updateDomNodeClass : function(delta) {
                
                Object.dom.updateClass(this.domNode, delta);
                
            }
            ,
            // Sets/Unsets UI style class
            toggleDomNodeClass : function(cl, flag) {
                
                Object.dom.updateClass(this.domNode, (flag?cl:('!'+cl)));
                
            }
        }
    }
    );

    //## @property The [hidden] property of view
    // related entity attributes:
    // @attr displayType - type of display: 'inline', 'block', 'inline-block'
    Object.property.define('hidden', function(propId) { 
        return {
            setter : function(v) {
                
                this[propId] = v;
                
                this.domNode.style.display =  v ? "none" : (this.displayType||'');
                
            }
        }
    }
    ,
    function(_super) {
        return {
            // Sets an Element "display" flag.
            display : function(f,bForceParents) {
                
                this.setHidden(!f);
                
                if (f && bForceParents) {
                    
                    var p = this;
                    while ((p = p.parentEntity)) {
                        p.display(f);
                    }
                    
                }
            }
            ,
            // switches an Element "display" flag.
            switchDisplay : function() {
                
                this.setHidden(!this.hidden);
                
            }
            ,
            // sets an Element "visible" flag.
            setHidden : function(f) {
                
                this._set('hidden',f);
                
            }
        }
    }
    );


    //## @property UI [children] property
    // Used by [box] entity and its descendants.
    // @attr childrenAsyncAdapter - adapt result of async fetching
    // @attr childrenAdapter - adapt meta data before set
    Object.property.define('children'
        ,
        function(propId, _super) { 
            
            var _addOp  =function(T, e, ch){
                return function(){
                    
                    var cb = this.cb();
                    
                    T.createChild(e, function(err, e){
                        e && ch.push(e);
                        cb();
                    });
                                            
                    return true;
                }
            };
            
            return {
                
                // Callback used in Sets property value from async url.
                // used in Property.setAsyncValue() as callback
                // calls event adapters: from entity or default if none
                createAsyncValueCallback : function(T) { 
                    
                    return  function(err, value) {
                        if(!T._done) {
                            T.updateDomNodeClass('!ui-busy');
                            T._set(propId, T.childrenAsyncAdapter(err, value));
                        }
                    };
                    
                }
                ,
                // Sets property value from async url.
                setAsyncValue : function(T, url) {
                    
                    T.updateDomNodeClass('ui-busy');
                    
                    _super.setAsyncValue.call(this,T,url);
                    
                }
                ,
                // sets value
                setValue : function(T, ev, url)
                {
                    // checks if code dependencies specified
                    var requires  =ev.requires || T.childrenRequires;
                    
                    if (requires) {
                        
                        var p = this;
                        Object.require(requires, function (err) {
                            ev.requires = T.childrenRequires = null;
                            if (err) {
                                ev.value =['label://alert/alert-error?caption=no_required_scripts for content']
                            }
                            p.setValue(T,ev);
                        });
                        
                    } else {
                        
                        if (url) {
                            this.setAsyncValue(T, url);
                        } else {
                            
                            // removes all currently added
                            T.removeAllChildren();
                            var v = (T.childrenAdapter||Function.NONE).call(T, ev.value, ev);
                            //T.trace('set children',v);
                            
                            var ops = [];
                            
                            if (v && v.length > 0) {
                                var ch = T.getChildren();
                                for ( var i = 0, l = v.length,e; i < l; i++) {
                                    e = v[i];
                                    if (e) {
                                        ops.push(_addOp(T, e, ch));
                                    }
                                }
                            }
                            
                            // callback into entity if exists
                            ops.push(function(){
                                T.childrenChanged && T.childrenChanged(ev, v);
                            });
                            
                            Function.perform(ops);
                        }


                    }
                }
                ,
                done : function(T) {
                    
                    // cascade done
                    T.removeAllChildren();
                    _super.done.call(this, T);
                    
                }
            }
        }
        ,
        // @patch entity type
        function(_super) {
            return {
                // Creates a new child.
                createChild : function(r, cb){
                    if (Array.isArray(r)) {
                        var ch = (r.length>1)?Array.slice(r,1):null;
                        r = (typeof(r[0])==='string')?Object.entity.create.parseMeta(r[0]):r[0]
                        if (ch) {
                            r.children=ch;
                        }
                    } 

                    r = (typeof(r)==='string')?Object.entity.create.parseMeta(r):r;

                    if (!cb) {
                        var T = this;
                        cb = function(err, e) {
                            T.getChildren().push(e);
                            T.childrenChanged && T.childrenChanged({
                                value:[r]
                            });
                        }
                    }

                    var e = Object.entity.create(Object.update({
                        id:'box', 
                        parentEntity : this
                    },r), cb);
                    

                    return e;
                }
                ,
                // gets list of children
                getChildren : function() {
                    return this._children || (this._children=[]);
                }
                ,
                // invokes done() for each and then removes all children
                removeAllChildren : (function() {
                    
                    var _iterator_done = (function(v){
                        v.done();
                    }).iterator();
                    
                    return function()
                    {
                        this._children = _iterator_done(this._children, []);
                    }
                    
                })()
                ,
                // creates a set of children by given {#meta}
                setChildren : function(meta) {
                    
                    this._set('children', meta);
                    
                }
                ,
                // @adopt async value.
                childrenAsyncAdapter : function(err, value) {
                    
                    if (err) {
                        
                        value = [{
                            id:'html',
                            html:String.localize(err.reason||'unknown_error')
                        }];
                    
                    }
                    return value;
                }
            }
        });
})();
