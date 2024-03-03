# Web Server Plugin that adds a File system access and a static resources support.
# Based on Express.
Object.fire

    uri:'axoid://define/webserver.Plugin' 

    methods: (_super) ->
        
        onEvent: (ev) ->
            
            uri = ev.uri
            cb = ev.callback or ->
                
            opId = uri.path.shift() or 'default'
            opId = ev.method+String.capitalize(opId) if ev.method

            @log("Dispatch #{uri} into #{opId}")
            
            cb @error("not-found: Operation not found: #{opId}").log() unless op = @[opId]
            
            try
                op.call @, ev, cb
            catch ex
                cb @error("Error in #{opId} ").addDetails(ex).log()
            
                    

                    

            
