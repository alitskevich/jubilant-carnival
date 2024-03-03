# [Plugins] property
Object.emit
    uri: "axoid://define/Property/Plugins"
    mixin:  (_super) ->

        launch: (cb)->

            Function.perform @ , (flow) -> [
                    ->
                        if @plugins
                            for meta in @plugins 
                                Object.emit Object.clone meta,
                                    _parent : @
                                    uri : "axoid://create"
                                    callback : flow.wait()


                        flow.next()

                    (err, plugins)->
                        @error(err, "#{@}.onPluginsInitializing") if err

                        @plugins = (e for e, i in arguments when i>1)

                        @[id] = p for p in @plugins when id=p.id

                        _super.launch.call @, cb
                ]

        done: ->
            _super.done.call @
            if @plugins
                for p in @plugins
                    p.done()
                    p._parent = null
                    @[p.id]= null if p.id