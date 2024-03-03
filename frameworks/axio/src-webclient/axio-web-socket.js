(function (global) {
    
    // @define [SocketClient] entity
    Object.entity.define('SocketClient extends EventHandler', {
        
        requires: ['/socket.io/socket.io.js']
        ,
        ready: false // not ready by default
        ,
        methods: function(_super) {
            
            return {
                
                init : function() {
                    
                    var T = this;
                    
                    _super.init.apply(this, arguments);
                        
                    var socket =  global.io.connect('/'+(T.channel||''));
                        
                    T.handleEventImpl = function(ev) {
                            
                        ev.uri = ''+ev.uri;
                        Object.debug('Socket send', ev);
                            
                        var cb= ev.callback;
                        delete ev.callback;
                            
                        socket.json.emit('message',ev,cb);
                            
                    };
                        
                    socket.on('connect', function () {
                            
                        Object.debug('onConnect');
                        T.setReady();
                            
                    });
                        
                    socket.on('message', function (ev) {
                            
                        T.onMessage(ev);
                            
                    });
                        
                    socket.on('disconnect', function () {
                            
                        Object.debug('onDisconnect');
                            
                        T.setProperty('ready', false);
                            
                    });
                        
                    
                } 
                , 
                onMessage: function(ev) {
                    
                    Object.debug('onMessage', ev);
                    
                    Object.notify(ev);
                    
                }
            }
        }
    });
  
})(this);

