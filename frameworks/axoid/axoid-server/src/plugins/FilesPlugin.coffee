# Web Server Plugin that adds a File system access and a static resources support.
# Based on Express.
Object.fire
    uri:'axoid://define/webserver.Plugin/webserver.FilesPlugin' 
    
    staticDirs: ['./static']
    permittedDirs:['static']
    methods: (_super) ->
        
        fs = require 'fs'
        path = require 'path'
        express = require 'express'
        
        config: (app) ->
            
            @rootDir = path.dirname require.main.filename
            
            app.use express.static(dir) for dir in @staticDirs

        resolveUri: (uri) ->
            
            path.resolve [@rootDir].concat(uri.path)...
            
        checkPermission: (uri) ->
            if uri.path[0] in @permittedDirs then null else @error("forbidden: Not permitted: #{uri} #{@permittedDirs}").log() 
           
            
        getRaw: (ev) ->
            name = @resolveUri ev.uri
            
            return ev.callback err if err = @checkPermission(ev.uri)
            
            fs.exists name, (x) =>
                return ev.callback @error("not-found: File not found: #{ev.uri}").log() unless x
                
                fs.readFile name,  ev.callback
                
        getUtf8: (ev) ->
            name = @resolveUri ev.uri
            
            return ev.callback err if err = @checkPermission(ev.uri)
            
            fs.exists name, (x) =>
                return ev.callback @error("not-found: File not found: #{ev.uri}").log() unless x
                
                fs.readFile name, ev.uri.params.encoding or "utf8", ev.callback
                  
        getDir: (ev) ->
            name = @resolveUri ev.uri
            
            return ev.callback err if err = @checkPermission(ev.uri)
            
            fs.exists name, (x) =>
                return ev.callback @error("not-found: Directory not found: #{ev.uri}").log() unless x
                ev.callback null, ({id:ev.uri.path.concat(f).join('/'), name:f} for f in fs.readdirSync name) 
                
                    

            
