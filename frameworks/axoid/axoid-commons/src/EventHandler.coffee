###
# Defines [EventHandler] entity type that provides featured event handling.
# @param readyForEventsExpression [Expression]
###
Object.emit 

    uri: "axoid://define/EventHandler"

    properties: ['readyForEvents']

    readyForEventsExpression :'true'

    methods: (_super) ->
        
        listenEvents: ()->
        
        readyForEventsChanged: (ready)->
            
            #start listen when ready
            _super.listenEvents.call @  if ready

        # resolves operation id from uri
        resolveOperationId: (ev)->
            
            return opId if (key = ev.uri.host) and key isnt '*' and @[opId = ('on'+String.capitalize(key)+'Event')]
            
            return opId if @[opId = (ev.method or 'get') + String.capitalize(ev.uri.path[0] or 'default')]
            
            null

        onEvent: (ev) -> 
            
            ev.uri = Object.Uri.parse(ev.uri)
    
            @dispatchEvent ev

        # default Event handler
        dispatchEvent: (ev) ->
            
            return ev.callback? @error(new Error("not-found: Operation not found: #{ev.uri}")) unless opId = @resolveOperationId ev
        
            try
                
                @[opId] ev
                
            catch ex
                
                Object.log.error("bad: Error in event handler #{@}.#{opId}", ex)
                
                ev.callback? ex
