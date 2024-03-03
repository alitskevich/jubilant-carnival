###
# Defines [Cache] entity type that provides caching feature.
# @options
#   version
#   uriPatterm
#   storage
###
Object.emit 

    uri: "axoid://define/EventHandler/Cache"

    uriPattern : 'remote://{{host}}/{{path}}?_ver={{version}}'
    
    methods: (_super) ->

        CACHE = {}

        resolveUri: (u) ->

            u = Object.clone u, u.params
            u.path = u.path.join('/')
            u.version = @getVersion() unless u.version

            Object.Uri.parse(String.template @uriPattern, u)

        cacheDeserializer : (s) ->

            return null unless s

            if typeof s is "object" then s else Object.parse(s)

        cacheSerializer : (s)   ->

            return null unless s

            s = if typeof s is "object" then JSON.stringify(s) else s
            if s and s isnt "{}" then s else null

        getVersion: ->
            '' + (@version or 1)

        fetch: (uri, cb) ->

            Object.emit
                uri: @resolveUri uri
                callback: cb
                unmarshaller: @fetchUnmarshaller

        restore: (key) ->

            return null unless s = @storage?[key]
            ver = @getVersion()
            if ver is s[0..ver.length-1] then s[ver.length+1..] else null

        store: (key, s) ->

            try @storage?.setItem key, (@getVersion()+":"+s)

        dispatchEvent : (ev) ->

                u = ev.uri
                key = @id + ':' +u.id

                # try get cached result
                return ev.callback null, r if (r =  CACHE[key] or (CACHE[key] = @cacheDeserializer(@restore key)))

                #fetch otherwise
                @fetch u, (err, data) =>

                    err = @error(err, "fetch data for versioned cache") if (err = s?.error or err)

                    if not err and (s = @cacheSerializer(data))
                        CACHE[key] = data = @cacheDeserializer s
                        @store key, s

                    ev.callback err, data
