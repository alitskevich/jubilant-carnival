Object.fire 

    uri: "axoid://define/ScriptService/EntityService"
    scriptType:"text/javascript"
    methods : (_super) ->
        resolveUri: (uri, ev) ->
            uri.path = ('js/'+uri.host.replace(/\./g,'/')+'.js').split('/')
            uri.host = ""
            _super.resolveUri.call @, uri, ev
