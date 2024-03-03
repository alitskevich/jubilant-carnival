/* 
 * Web Storage.
 */
(function(global){
    
    var STORAGE_STUB = {
        getItem: function(key) {
            return this[key];
        }
        ,
        setItem: function(key, value) {
            this[key]=value;
        }
    };

    Object.entity.define('WebStorage', {
        properties: ['valueBundle:value']
        ,
        storage: global.localStorage || STORAGE_STUB
        ,
        methods : function (_super) {
        
            return {
                init : function() { 
                    
                    
                    this.initStorage();
                    
                    _super.init.call(this);
                    
                }
                ,
                initStorage: function() {
                    
                    var s = this.storage.getItem(this.id);
                    this.value = s && Object.parse(s) || this.value || {};
                    
                }
                ,
                valueChanged : function(ev, val) {
                    
                    _super.valueChanged.call(this, ev, val);
                    
                    this.persistValue(val) ;
                    
                }
                ,
                persistValue : function(s) {
                    
                    s  = JSON.stringify(s);
                    if (this.storage[this.id] != s) {
                        //Object.debug('Persist::'+this.id, s);
                        try {
                            this.storage.setItem(this.id, s);
                        }
                        catch (e) {
                        //Object.error.log('Persist::'+this.id, s, e);
                        }
                    }
                }       
            };
        }
    });

})(this);

