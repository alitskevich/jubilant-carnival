# [Requires] property.
Object.emit

    uri: 'axoid://define/Property/Requires'
    
    mixin:  (_super) ->
        
        launch: (cb)->
            
            Object.emit 
            
                uri:'axoid://require'
                
                dependencies: @requires
                
                callback: (err) =>
                    
                    @onRequiredLoaded? (e for e in arguments)...
                    
                    _super.launch.call @, cb
