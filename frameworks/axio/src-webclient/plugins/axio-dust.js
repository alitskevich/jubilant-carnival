(function (global) {

    /* 
     * Dust API.
     */

    var dust = global.dust;

    if (dust) {
        dust.onLoad =  function(view, callback){
            Object.notify( 'templates/'+view, callback);
        }
    }
 
    // The Dust [template] Property.
    Object.property.define('dustTemplate'
        ,
        function(propId) { 
    
            return {
                getter : function(v) {
                    var tId = this.templateId || ("c_"+this.id);
                    return dust.cache[tId] || null;
                }
                ,
                setter : function(v) {
                    var tId = this.templateId || ("c_"+this.id);
                    if (v && !dust.cache[tId]) {
                        dust.loadSource(dust.compile(v, tId));
                        this.redraw();
                    }
                }
            }
        }
        ,
        function(_super) {
            return {
                redraw : function() {
                    var T=this, tId = this.templateId || ("c_"+this.id);
                    if (dust.cache[tId] && this.context) {
                        dust.render(tId, this.prepareContext(), (this.renderCb || (this.renderCb = function(err, out) {
                            T.setProperty('html', err || out);
                        })));
                    }
                }
                ,
                contextChanged: function (){
                    this.redraw();
                }
                ,
                prepareContext: function (){
                    return this.context;
                }
            }
        }
        );

})(window)
   