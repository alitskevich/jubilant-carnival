/* 
 * NavList and NavIndexList UI.
 */
(function(global){


    Object.entity.define('NavList extends List', {
        itemTemplate:'<a href="#!{id}">{name}</a>'
        ,
        methods: function(_super) {
            return {
                init : function() {
                    var T = this, loc = global.location;
                    _super.init.apply(this, arguments);
                
                    // @hook on hash changed
                    global.onhashchange = function() {
                        // sync hash changes with local storage
                        T.go((loc.hash||'#').substring(2));
                    }
                    
                    // reset hash immediately!
                    this.go(loc.hash.substring(2)||'home');
                }
                ,
                go : function(h) {
                    if (!h) return;
                    if (h) {
                        var hashes = h.split('-');
                        this.setProperty('value', hashes[0]);
                        this.setProperty('index', hashes[1] || "");
                    } 
                }
            }
        }
    });


})(this);
