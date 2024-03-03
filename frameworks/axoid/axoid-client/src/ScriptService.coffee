Object.fire 

    uri: "axoid://define/HttpService/ScriptService"
    scriptType:"text/javascript"
    methods: (_super) ->
        registry = window._JSONP or (window._JSONP = {})
        counter =  window._JSONP_COUNTER or ( window._JSONP_COUNTER = 1)
        _doc = window.document

        _createScriptTag = (attrs) ->
            e = _doc.createElement("script")
            e.type = @scriptType
            e.charset = "utf-8"
            Object.update e, attrs
            e

        # creates Event handler implementation
        onEvent : (ev, u = ev.uri) ->
            
                script = _createScriptTag.call @, ev.scriptAttrs
                script.async = "async" unless ev.noAsynMode
                script.id = ev.scriptId if ev.scriptId
                
                ev._err = new Error()

                if jsonp = u.params.jsonp

                    sid = "n" + counter++
                    u.params[jsonp] = escape("window._JSONP.#{sid}")
                    registry[sid] = (r) ->
                        ev.callback? null, (if ev.unmarshaller then ev.unmarshaller r else r)
                    script.onload = ->
                        script.parentNode.removeChild script
                        delete registry[sid]
                else

                    script.onload = ->
                        cb = ev.callback
                        ev.callback = null
                        cb? null, this

                script.onerror = ->
                    ev.callback Object.error("remote_error", "Script error: #{u}")

                script.src = @resolveUri(u, ev)

                Object.dom.appendToHead script
