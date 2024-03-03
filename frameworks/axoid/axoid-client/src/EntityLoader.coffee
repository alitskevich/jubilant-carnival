Object.fire 

    uri: "axoid://define/CodeLoader/EntityLoader"
    methods : (_super) ->
        resolveUri: (uri) ->
            uri.host = uri.host.replace(/\./g,'/')
            _super.resolveUri.call @, uri
