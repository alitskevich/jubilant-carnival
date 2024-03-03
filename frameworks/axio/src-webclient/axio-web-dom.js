/**
 * Axio: Web DOM API.
 */
Object.dom = (function(_win){
    
    var _doc = _win.document;
    
    var _createEvent = function(evt) {
        var r = {}, e;
        if (_win.event) {
            r.internal = _win.event;
            r.target = e =_win.event.srcElement;
        } else {
            r.internal = evt;
            e = evt.target;
            while (e && e.nodeType != 1) {
                e = e.parentNode;
            }
            r.target = e;
        }
        while (e && !e.entity) {
            e = e.parentNode;
        }
        r.entity = e && e.entity;
        return r;
    };
    
    // common styles
    Object.STYLE_LINE_FIXED = 'overflow:hidden;white-space:nowrap;cursor:pointer;';
    Object.STYLE_TEXTLINE = 'white-space:nowrap;line-height:1.5em;vertical-align:middle;';
    
    var _ALIVE_EVENTS_KEYS  = ['mousedown','mouseup','click', 'mousemove', 'mouseover', 'mouseout'];
    
    var _ALIVE_HANDLER  = function(ev0) {
        var T = this;
        if (!T.disabled) {
            var ev = _createEvent(ev0), type = ev.internal.type;
            switch(type) {
                case "mousedown":
                    T.updateDomNodeClass(T.stylePressed);
                    //_lastTouchedEntity=evt.entity;
                    T.touchBegin && T.touchBegin(ev);
                    break;
                case "mouseup":
                    T.touchEnd && T.touchEnd(ev)
                    T.updateDomNodeClass('!'+T.stylePressed);
                    break;  
                case "click":
                    T.tapped && T.tapped(ev)
                    break;
                case "mousemove":
                    T.mouseMove && T.mouseMove(ev)
                    break;
                case "mouseover":
                    T.updateDomNodeClass(T.styleHovered);
                    T.mouseOver && T.mouseOver(ev)
                    break;
                case "mouseout":
                    T.mouseOut && T.mouseOut(ev)
                    T.updateDomNodeClass('!'+T.styleHovered);
                    break;
            }
        }
        return true;
    }
    
    return { 
        //creates UI event
        document: _win.document
        ,
        createEvent : _createEvent
        ,
        // creates a new DOM Element
        createElement : function(type, attrs)
        {
            return Object.update(_doc.createElement(type||'DIV'), attrs);
        }
        ,
        createComplexElement : function(tag, attrs)
        {
            // hack for type set on IE8
            var div = this.DOM_FACTORY || (this.DOM_FACTORY = _doc.createElement("div"));
            div.innerHTML = tag;
            var r = div.firstChild;
            div.removeChild(r);
            return Object.update(r, attrs);
        }
        ,
        appendToHead: function(el){
            var fjs = _doc.getElementsByTagName('head')[0];
            fjs.appendChild(el);
        }
        ,
        appendCss: function(href){
            this.appendToHead(this.createElement('link',{rel:'stylesheet',href:href}));
        }
        ,
        // finds a DOM Element from parent
        getElementById : function(id)
        {
            return _doc.getElementById(id) || null;
        }
        ,
        // removes a DOM Element from parent
        removeElement : function(e)
        {
            if (e && e.parentNode) {
                e.parentNode.removeChild(e);
            } 
        }
        ,
        // makes entity view alive
        alive : function (T){
            this.listenEvents(T,_ALIVE_EVENTS_KEYS, function(ev0) {
                return _ALIVE_HANDLER.call(T, ev0);
            });
        }
        ,
        // bind handler for entity DOM event
        listenEvents : function (T, key, fn, fl){
            var node = T ? T.domNode : _doc, keys = key.split ? key.split(' ') : key;
            for (var i = 0, max = keys.length; i < max; i++) {
                key = keys[i];
                if (node.addEventListener) {
                    node.addEventListener(key, fn, fl);//, false
                }
                else {
                    node.attachEvent("on"+key, fn, fl);
                }
            }
        }
        ,
        // stops event bubbling
        stopEvent : function (ev){
            var e = ev && ev.internal;
            e.stopPropagation && e.stopPropagation();
            return  e && (e.cancelBubble = true);
        }
        ,
        // returns size of client viewport
        isKeyboardCode : function (ev, code) {
            if (!ev) {
                ev = _win.event || {};
            }
            return ev.keyCode===code || ev.charCode===code || ev.which===code
        }
        ,
        KEY_CODE: {
            ESCAPE: 27,
            ENTER: 13,
            TAB: 8
        }
        ,
        // returns size of client viewport
        viewportSize : function (){
            var scr = _win.screen;
            return {
                width:scr.availWidth , 
                height:scr.availHeight
            };
        }
        ,
        // returns total offset of element 
        getTotalOffset : function(p) {
            var r = {
                top : 0, 
                left : 0,
                width : p.clientWidth,
                height : p.clientHeight
            };
            while (p) {
                r.top += p.offsetTop - p.scrollTop;
                r.left += p.offsetLeft - p.scrollLeft;
                p = p.offsetParent;
            }
            return r;
        } 
        ,
        // UI error handler
        handleError : function(err) {
            Object.error.log(err);
        }
        ,
        // sets/remove class for elt. 
        // Classes to remove have to be prefixed with '!' sign.
        updateClass: function(elt, delta) {
            if (elt && delta) {
                var clss= elt.className.split(' '), i,l, cl;
                delta = delta.split(' ')
                for (i=0, l=delta.length; i<l; i++) {
                    cl = delta[i];
                    if (cl) {
                        if (cl[0]==='!') {
                            if (cl==='!*') {
                                clss = [];
                            } else {
                                var p = clss.indexOf(cl.substring(1));
                                if (p>-1) {
                                    clss[p] ='';
                                }
                            }
                        } else {
                            if (clss.indexOf(cl)===-1) {
                                clss.push(cl);
                            } 
                        }
                    }
                }
                delta='';
                for (i=0, l=clss.length; i<l; i++) {
                    cl = clss[i];
                    if (cl) {
                        delta = delta ? ( delta+' '+cl ) : cl;
                    }
                }
                elt.className = delta;
            }
            return elt;
        }
        ,
        // Creates Entities from given DOM tree.
        init : (function() {
    
            var re_dashAlpha = /-([\da-z])/gi
            ,
            fn_camelCase = function( all, letter ) {
                return letter.toUpperCase();
            }
            ,
            _getAllWidgets = (_doc.querySelectorAll) 
            ? function(root){
                return root.querySelectorAll('[data-widget]');
            }
            : function(root) {
                for (var i=0, all=root.children, widgets = []; i<all.length; i++) {
                    var c = all[i];
                    if (c.getAttribute('data-widget')) {
                        widgets.push(c);
                    }
                    _getAllWidgets(c, widgets);
                }
                return widgets;
            }  
            ,
            // initializes widgets iterator
            _applyWidgetsInitIterator = (function(v){
                var meta = {};
                var attr = v.attributes;
                for (var i=0,name, l = attr.length; i < l; i++ ) {
                    name = attr[i].name;
                    if ( !name.indexOf( "data-" ) ) {
                        meta[ name.substring(5).replace( re_dashAlpha, fn_camelCase ) ] = v.getAttribute( name );
                    }
                }
                var id = v.getAttribute('id');
                meta['id'] = meta['widget'] + (id?(':'+id):'');
                meta.domNode=v;
                meta.parentEntity = this.parentEntity;
                try {
                    //Object.debug('widget', id, meta);
                    
                    Object.entity.create(meta);
                } catch (ex) {
                    Object.error.log('wrong_widget', ex.message, meta);
                    if (this.handleError) {
                        this.handleError(ex, meta);
                    } 
                }
            }).iterator()
        
            // initializes all widgets over DOM tree
            return function(root, options) {
                if (!root) {
                    root = Object.entity.create({
                        id:'box',
                        domNode:_doc.body
                    });  
                }

                var handleError = function  (ex, meta) {
                    var node = Object.dom.createElement();
                    meta.domNode.appendChild(node);
                    Object.entity.create({
                        id: 'html', 
                        parentEntity : root ,
                        style: 'alert-error', 
                        html: 'Error: '+(ex.message||('can\'t create UI view: '+meta.id))
                    })
                };
                
                _applyWidgetsInitIterator(_getAllWidgets(root.domNode)
                    ,
                    Object.update({
                        handleError:handleError,
                        parentEntity: root
                    }, options));
            }  
        })()
    }

})(window);


