# Web Server Plugin that adds a static resources support.
# Based on Express.
Object.fire
    uri:'axoid://define/webserver.DustPlugin' 
    
    templatePattern: "file://*/views/{0}.html"
    
    methods: (_super) ->
        
        config: (app) ->
            
            dust = require("dustjs-linkedin")
            
            # Disable whitespace compression.
            dust.optimizers.format = (context, node) -> node
            
            dust.onLoad = (view, callback) =>
                
              Object.fire 
                uri: String.format(@templatePattern, view)
                callback: callback
            
            app.use (req, res, next) ->
                
                return next() unless viewId = req.viewId
                
                context = Object.clone req.result or {}, app : app.config, viewId : viewId
                
                dust.render viewId, context, (err, result) ->
                    req.error = err
                    req.result = result
                    next()
