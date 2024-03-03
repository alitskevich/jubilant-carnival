# @define [SocketClient] entity
Object.fire 

    uri: "axoid://define/SocketClient"
    properties:['requires:Requires']
    ready: false # not ready by default
    methods: (_super) ->

        launch: (cb)->
            @requires = ["script://#{@channel}/socket.io.js"]
            _super.launch.call @, cb

        init: ->

            throw new Error 'No Socket IO' unless io = window.io

            socket = io.connect @channel
            socket.on "connect", (=> @onConnect())
            socket.on "message", ((ev) => @onMessage ev)
            socket.on "disconnect", (=> @onDisconnect())

            @emit = (ev, cb = ev.callback) ->
                ev.uri = "" + ev.uri
                delete ev.callback
                socket.json.emit "message", ev, cb

        onEvent : (ev) ->
            @log "send", ev
            @emit ev

        onConnect: (ev) ->
            @log "onConnect", ev
            _super.init.call @

        onDisconnect: (ev) ->
            @log "onDisconnect", ev

        onMessage: (ev) ->
            @log "onMessage", ev
            Object.fire ev if ev.uri
