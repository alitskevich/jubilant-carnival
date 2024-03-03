# The plugin that dispatches requests to handle with appropriate plugins method.
Object.fire
    uri:'axoid://define/webserver.DispatcherPlugin' 
    config: (app)->
        
        HTTP_METHODS= ["get","post","put","delete"]#,"options"
  
        app.use (req, res, next) =>

            uri = Object.Uri.parse("//*" + (if req.url is '/' then '/home' else req.url))
            
            return next() unless method in HTTP_METHODS

            return next() unless uri.type = app[uri.path.shift()]?.id
            
            Object.fire 
                uri : uri
                method: method = req.method = req.method.toLowerCase()
                headers : req.headers
                payload : req.body
                callback: (err, result)->
                        req.error = err
                        req.viewId = ev.viewId if ev.viewId
                        req.result = result
                        next()
            

