/**
 * Axio UI views and properties basics.
 */

// @define The [caption] property.
Object.property.define('caption'
    ,
    function(propId) { 
        return {
            // setter
            setter : function(v, ev) {
                this[propId] = v = v || '';
                var e=this.getCaptionElt(), hidden = (v === 'none');
                if (e) {
                    e.display(!(e.hidden || hidden));
                    v = this.getCaptionHtml(v, ev);
                    try {
                        e.domNode.innerHTML = (hidden || !v)? '' :v;
                    } catch (e) {
                        Object.error.log('Caption set error',e);
                    }
            
                }
            }
            ,
            // value comparator
            comparator : Function.FALSE
        }
    }
    ,
    // patches entity type attached to
    function(_super) {
        return {
            getCaptionElt : function(v, ev){
                return this.captionElt || this;
            }
            ,
            getCaptionHtml : function(v, ev){
                return (this.icon?'<i class="icon-'+this.icon+'"></i> ':'')+String.localize(v,ev.quantity);
            }
        }
    }
    );

// @define The [html] property.
Object.property.define('html'
    ,
    function(propId, _super) { 
        return {
            // Sets property value asyncly.
            setAsyncValue : function(T, ev, asyncUrl) {
                this.setter.call(T, null, ev);
                _super.setAsyncValue.call(this, T, ev, asyncUrl);
            }
            ,
            getValue : function(T) {
                return Object.get(T,'contentNode.innerHTML');
            }
            ,
            // setter
            setter : function(v, ev) {
                var node = this.contentNode;
                if (node) {
                    try {
                        node.innerHTML = v || "<div>&nbsp;&nbsp;</div>";
                    } catch(err) {
                        node.innerHTML = String.format('<div>{0}</div>', String.localize('html_content_error'));
                    }
            
                }
            }
            ,
            // value comparator
            comparator : Function.FALSE
        }
    }
    );

// @define UI [disabled] Property
Object.property.define('disabled'
    ,
    function(propId) { 

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

    }
    ,
    // patches entity type attached to
    function(_super) {
        return {
            disabledChanged : function(ev, v) {
                this.domNode.disabled = v?'disabled':'';
                this.toggleDomNodeClass('disabled', v);
            }
        }
    }
    );

// @define UI html view.
Object.entity.define('html extends view', {
    properties:['html:html']
});
// @define UI [dhtml] entity
Object.entity.define('dhtml extends html', {
    methods: function(_super) {
        return {
            htmlChanged : function() {
                Object.dom.init(this);
            }
        }
    }
});

// @define UI label view.
Object.entity.define('label extends view', {
    properties:['caption:caption']
    ,
    domNodeType:'span'
});

// @define UI button view.
Object.entity.define('button extends view',{
    properties:['disabled:disabled', 'caption:caption', 'html:html']
    ,
    domNodeType:'button'
    ,
    alive:true
    ,
    style:'btn'
    ,
    tapped : function(ev){
        if (this.async) {
            var asyncEv = this.async();
            if (asyncEv) {
                this.setProperty('disabled', true);
                this.updateDomNodeClass('ui-busy');
                if (this.busyCaption) {
                    this.savedCaption = this.caption;
                    this.setProperty('caption',this.busyCaption);
                }
                var T = this;
                var _cb = asyncEv.callback;
                asyncEv.callback = function(ev){
                    _cb && _cb.apply(T, arguments);
                    T.updateDomNodeClass('!ui-busy');
                    T.setProperty('disabled', false);
                    if (T.savedCaption) {
                        T.setProperty('caption',T.savedCaption);
                        T.savedCaption = null;
                    }
                };
                Object.notify(asyncEv);
            }
        } else if (this.action) {
            this.setProperty('disabled', true);
            this.updateDomNodeClass('ui-busy');
            this.action(ev);
            this.updateDomNodeClass('!ui-busy');
            this.setProperty('disabled', false);
        }
    }
});


/**
 * UI List view.
 */

// ## Item list view:
Object.entity.define('List extends box',{
    properties:['data','selection',':value']
    ,
    domNodeType:"ul"
    ,
    itemTemplate:'<a href="#">{name}</a>'
    ,
    dataIdKey:'id'
    ,
    itemDomNodeType : 'li'
    ,
    alive: true
    ,
    methods : function (_super) {
        var _childrenAdapterIterator = (function(datum, i, T) {
            this.push(T.childrenItemAdapter(datum, i));            
        }).iterator()
        ,
        _findItemByValueIterator = (function(w) {
            if (w.value && (w.value === this.value)) {
                this.setProperty('selection', w);
            }
        }).iterator();
        
        return {
            valueChanged : function(ev) {
                this.syncSelection();
            }
            ,
            dataChanged : function(ev) {
                this.setChildren(ev);
                this.syncSelection();
            }
            ,
            tapped : function(ev) {
                for (var w = ev.entity; w && (w!==this); w = w.parentEntity) {
                    if ((w.domNodeType===this.itemDomNodeType) && w.value){
                        this.setValue(w.value);
                        break;
                    }
                }
            }
            ,
            syncSelection : function() {
                _findItemByValueIterator(this.getChildren(),this);
            }
            ,
            selectionChanged : function(ev)
            {
                ev.oldValue && ev.oldValue.updateDomNodeClass('!active');
                ev.value && ev.value.updateDomNodeClass('active');
            }
            ,
            childrenAdapter :function(data) {
                return _childrenAdapterIterator(data, [], this);
            }
            ,
            childrenItemAdapter :function(datum, i) {
                return {
                    id: 'html',
                    domNodeType: this.itemDomNodeType,
                    style: this.itemStyle,
                    html: String.formatWithMap(this.itemTemplate, datum),
                    value: datum[this.dataIdKey],
                    datum: datum
                };
            }
        }
    }
});



