(function(global) {
     /* 
      * GA tracking API.
      */   

    // @define [GaTracking] entity
    Object.entity.define('GaTracking', {
        methods : function (_super) {
            return {
                init : function() { 
                    var T = this;
                    
                    if (!global._gaq ) {
                        global._gaq=[];
                    }
        
                    if (this.account) {
                        global._gaq.push(function(){
                            var tracker  = global._gat.getPropertyTracker(T.account);
                            if (this.domainName) {
                                tracker._setDomainName(T.domainName);
                            }
                            T.tracker = tracker;
                        });
                        this.src = (("https" == global.location.protocol) ? '//ssl' : '//www') + '.google-analytics.com/ga.js';
                        Object.require([this.src]);
                        
                        this.trackPage();
                    }
                    _super.init.apply(this, arguments);
                }
                ,
                // page tracking
                performOp: function(op) {
                    var T = this;
                    global._gaq.push(function(){
                        op.call(T, T.tracker)
                    });
                }
                ,
                // page tracking
                trackEvent: function(category, action, label, value, noninteraction) {
                    this.performOp(function(tracker) {
                        tracker._trackEvent(category, action, label, value, noninteraction);//info.join('/')
                    });
                }        
                ,
                // page tracking
                trackPage: function(ev) {
                    this.performOp(function(tracker) {
                        tracker._trackPageview();//info.join('/')
                    });            
                }
                ,
                // Tracks social interactions
                trackSocial: function(network, action, target, pagePath) {
                    this.performOp(function(tracker) {
                        tracker._trackSocial(network, action, target, pagePath);//info.join('/')
                    });            
                }
            }
        }
    });
   
})(window)
