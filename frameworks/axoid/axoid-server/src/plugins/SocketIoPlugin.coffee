# @define [SocketServer] entity based on Socket.IO.
Object.fire
        uri:'axoid://define/EventHandler/SocketServer'
        methods: (_super) ->
            config: (app)->
                T = this
                io = require("socket.io")(@http)
            
                # configure
                io.configure ->
                    io.set "transports", T.transports or ["xhr-polling"] #'flashsocket', 'websocket',
                    io.set "polling duration", T.pollingDuration or 15
                    io.enable T.enable or "log"
                    return

                sockets = io.sockets #.of('/'+(T.channel||''));
                
                T.broadcastAll = (ev) ->
                    sockets.json.send ev.payload
                    return
                
                app.post "/", (req, res) ->
                    io.emit "message", JSON.stringify(req.body)
                    res.json req.body

                sockets.on "connection", (socket) ->
                    Object.debug "connection"
                    socket.on "connect", ->
                        T.onConnect {}
                        return

                    socket.on "disconnect", ->
                        console.log "user disconnected"
                        return
                     
                    #   socket : socket
                    socket.on "message", (ev, callback) ->
                        Object.debug "message", ev, callback
                        #socket.broadcast.emit msg
                    
                        #ev = Object.parse(ev)
                        #ev.uri = Object.parseUri(ev.uri);
                        #ev.socket = socket;
                        ev.callback = callback or Function.NONE
                        if ev.user
                            socket.set "user", ev.user, ->
                                Object.notify ev
                                return

                        else
                            socket.get "user", (err, user) ->
                                ev.user = user
                                Object.notify ev
                                return

                        return

                    socket.on "disconnect", ->
                        T.onDisconnect {}
                        return

                    return

                return

            
            #   socket : socket
            onConnect: (ev) ->
                Object.debug "onConnect"
                return

            onDisconnect: (ev) ->
                Object.debug "onDisconnect"
                return

            user: (ev) ->
                Object.debug "user"
                ev.callback()
                return

            onEvent: (ev) ->
                op = ev.uri.host
                Object.debug "Socket.", op
                ev.uri = ev.uri.hash or ev.uri
                this[op] ev
                return
