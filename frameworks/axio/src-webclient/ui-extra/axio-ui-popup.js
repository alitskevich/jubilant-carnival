/**
 * UI popup and related.
 */

(function (_win){
    
    var _hideAll = function(){
        for (var n in _ALL) {
            var v = _ALL[n];
            if(v.display){
                v.display(false);
            }
        }
        getHome().display(false);
    }
    ,
    _dom =Object.dom
    ,
    $ = Object.entity
    ,
    IS_MODAL = false
    ,
    _ALL={}
    , 
    _HOME = null
    ,
    getHome = function() {
        if (!_HOME) {
            var node  = _dom.createElement();
            
            _HOME = $.create({
                id:'view:__popupHome',
                domNode : node,
                hidden:true,
                css : "z-index:1000;position:fixed;left:0px;top:0px;bottom:0px;right:0px;display:none;background-color:black;opacity:0.3"
                ,
                hide: _hideAll
            });
            node.onclick = function () {
                if (!IS_MODAL) {
                    _hideAll();
                }
            };
           _dom.listenEvents(null, 'keydown', function(ev) {
                if (!_HOME.hidden && _dom.isKeyboardCode(ev, _dom.KEY_CODE.ESCAPE)) {
                    _hideAll();
                }
            }, true);
            _dom.document.body.appendChild(node);
        }
        return _HOME;
    }
    ,
    onHiddenChanged  = function(ev) {
        getHome().display(!ev.value);
    }
    ,
    getPopup = function(T) {
        var  id=T._id, e = _ALL[id];
        if (!e) {
            e = T.createPopup(getHome());
            Object.listen(e.id+'.hidden', onHiddenChanged);
            _ALL[id] = e;
        }
        return e;
    }
    ,
    displayPopup = function(p, flag, modal) {
        IS_MODAL = modal;
        if (flag) {
            p.display(flag);
        } else {
            hideAll();
        }
        
    }
    ;

    // ## Property containing popup for UI widget
    // NOTE: property id MUST be 'popup'
    Object.property.define('popup'
        ,
        function(propId, _super) { 
            return {
                done : function(T) {
                    _super.done.call(this, T);
                }
            }
        }
        ,
        function(_super) {
            return {
                displayPopup : function(flag, modal) {
                    displayPopup(this.getPopup(), flag, modal);
                }
                ,
                showPopup : function(modal) {
                    this.displayPopup(true, modal);
                }
                ,
                createPopup : function(home) {
                    return this.createChild({
                        id : 'box:popup$' + this.id
                        ,
                        style : "modal"
                        ,
                        hidden: true
                    });
                }
                ,
                getPopup : function() {
                    return getPopup(this);
                }
            }
        });

})(window);



