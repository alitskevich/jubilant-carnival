# CodeLoader entity type
Object.fire 

    uri: "axoid://define/Cache/CodeLoader"
    uriPattern : 'remote://*/js/{{host}}.js?_ver={{version}}'
    #storage: window.localStorage
    methods: (_super) ->
        fetchUnmarshaller : (s) -> s
        cacheSerializer : (s)   -> @evaluate s
        cacheDeserializer: (s) -> @evaluate s
        evaluate: (s) ->
            return null unless s
            try
                (Function.call(Function, s))()
            catch ex
                @error(ex, "JS syntax:" + ex.message).log()
            s
