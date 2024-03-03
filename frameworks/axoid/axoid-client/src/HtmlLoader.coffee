Object.fire 

    uri: "axoid://define/Cache/HtmlLoader"
    uriPattern: 'remote://*/html/{{host}}.html'
    methods : (_super) ->
        init: ->
            @storage = @createStorage()
            _super.init.call @

        createStorage: ->
            @storage or
                getItem: (key) -> @[key]
                setItem: (key, value) -> @[key] = value

        cacheDeserializer : (s) -> s
        cacheSerializer : (s) -> s
