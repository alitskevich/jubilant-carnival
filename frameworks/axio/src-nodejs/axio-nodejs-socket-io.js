(function () {

    // @define [SocketServer] entity based on Socket.IO.
    Object.entity.define('SocketServer extends EventHandler', {
        methods: function(_super) {
            return {
                init : function() {
                    var T = this;
                    
                    _super.init.apply(this, arguments);
                    
                    var io = require('socket.io').listen(this.httpServer);
                    
                    // configure
                    io.configure(function () {
                        io.set('transports', T.transports || ['xhr-polling']);//'flashsocket', 'websocket',  
                        io.set("polling duration", T.pollingDuration || 15); 
                        io.enable(T.enable||'log');
                    });
                    
                    var sockets = io.sockets;//.of('/'+(T.channel||''));
    
                    T.broadcastAll = function(ev) {
                        sockets.json.send(ev.payload);
                    };

                    sockets.on('connection', function(socket) {
                        
                        Object.debug('connection');
                        
                        socket.on('connect', function () {
                            T.onConnect({
                                //   socket : socket
                                });
                        });

                        socket.on('message', function(ev, callback) {
                            Object.debug('message', ev, callback);
                            //ev = Object.parse(ev)
                            //ev.uri = Object.parseUri(ev.uri);
                            //ev.socket = socket;
                            ev.callback = callback || Function.NONE;
                            if (ev.user) {
                                socket.set('user', ev.user, function () {
                                    Object.notify(ev);
                                }) 
                            } else {
                                socket.get('user', function (err, user){
                                    ev.user = user;
                                    Object.notify(ev);
                                });
                            }
                        });

                        socket.on('disconnect', function () {
                            T.onDisconnect({
                                //   socket : socket
                                });
                        });
                    }); 
                }
                , 
                onConnect: function(ev) {
                    Object.debug('onConnect');
                }
                , 
                onDisconnect: function(ev) {
                    Object.debug('onDisconnect');
                }
                , 
                user: function(ev) {
                    Object.debug('user');
                    ev.callback();
                }
                , 
                handleEventImpl: function(ev) {
                    var op = ev.uri.host;
                    Object.debug("Socket.", op);
                    ev.uri = ev.uri.hash || ev.uri;
                    this[op](ev);
                }
            }
        }
    });
  
})();
