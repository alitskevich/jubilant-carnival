/* 
 * Google Universal Analytics tracker.
 * 
 * @see https://developers.google.com/analytics/devguides/collection/upgrade/
 */

Object.entity.define('GuaTracker',(function(global){
    
    var q = [];
    
    var ga = global.ga || function(){
        q.push(arguments);
    };
        
    Object.update(ga, {
        l: 1*new Date(), 
        q: q
    });

    Object.update(global, {
        'GoogleAnalyticsObject':'ga',
        ga : ga
    });
                        
    return {
        requires :  ['//www.google-analytics.com/analytics.js']
        ,
        properties:['boolean:enabled']
        ,
        methods : function (_super) {
            return {
                init : function() { 
                    _super.init.apply(this, arguments);
                    if (this.enabled) {
                        ga('create', this.account, this.domain);
                        ga('send', 'pageview');
                    }
                }
            }
        }
    };

})(this));
