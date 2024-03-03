# HttpService.
Object.fire 

    uri: "axoid://define/EventHandler/HttpService",
    defaultHost:window.location.hostname+(if window.location.port then ":#{window.location.port}" else '')
    defaultProtocol: window.location.protocol[0..-2]
    methods: (_super) ->

        F0 = (x) -> x

        # MIME type by extension registry. Used for XHR.
        MIME =
            json: "application/json"
            js: "application/json"
            html: "text/html"
            txt: "text/plain"

        RQTOR = window["XMLHttpRequest"] or try window.ActiveXObject("Microsoft.XMLHTTP")#window.XDomainRequest or

        # Parsers for given resource type
        PARSERS =
            js: Object.parse
            json: Object.parse
            uri: Object.parseUri

        _newRequest = ->
            new RQTOR()

        negotiateResultType : (u, ev) ->
            urlId = u.path[-1..][0]
            r = "js"
            r = urlId[p + 1..] if urlId and (p = urlId.lastIndexOf(".")) > -1
            r

        negotiateError : (st, text, ev) ->
            return null if (not st or (st >= 200 and st < 300) or (st is 304))

            Object.error("remote: #{st} #{ev.uri} #{text or ''}").addDetails(ev?._err)

        resolveMethod : (ev) ->
            ev.method or ((if ev.payload then "POST" else "GET"))

        resolveUri : (uri, ev) ->
            uri.host = @defaultHost if uri.host is '*'
            uri.type = if uri.params._ssl or ev.ssl then 'https' else @defaultProtocol
            delete uri.params._ssl if uri.params.ssl
            "" + uri

        onRequestReady: (rq, ev)->
            err =  @negotiateError(rq.status, rq.statusText, ev)
            result = (ev.unmarshaller or PARSERS[ev.dataType] or F0)(rq.responseText) #unless err
            ev.callback err, result

        resolveHeaders: (ev)->
            Object.update(
                'Accept': MIME[ev.dataType] or "*/*"
                'Language': String.LANGUAGE
                'Content-Type': MIME[ev.dataType]
                , ev.headers)

        # creates Event handler implementation
        onEvent : (ev) ->
                try
                    T = @
                    rq = _newRequest()

                    rq.open @resolveMethod(ev), @resolveUri(ev.uri, ev), true

                    ev._err = new Error()

                    ev.dataType = @negotiateResultType(ev.uri, ev) unless ev.dataType

                    rq.onreadystatechange = ->
                        if (@readyState is 4) and (not ev.completed)
                            ev.completed = true
                            @onreadystatechange = F0
                            T.onRequestReady(@, ev)
                        false

                    rq.setRequestHeader h, v for h, v of @resolveHeaders(ev) when v

                    rq.responseType = resType if resType = ev.uri.params.responseType;

                    if ev.payload
                        if typeof (ev.payload) is "object"
                            ev.payload = JSON.stringify(ev.payload)
                        rq.send ev.payload
                    else
                        rq.send null
                catch ex
                   ev.callback @error("remote_error: " + ev.uri, ex)
                return



Object.fire 

    uri: "axoid://define/HttpService/RawHttpService",
    methods: (_super) ->
        onEvent : (ev) ->
                try
                    T = @

                    rq = new XMLHttpRequest()
                    ev._err = new Error()

                    rq.open @resolveMethod(ev), @resolveUri(ev.uri, ev), true

                    rq.onreadystatechange = ->
                        if (@readyState is 4) and (not ev.completed)
                            ev.completed = true
                            @onreadystatechange = (x) -> x

                            # convert data to binary string
                            arr = if @response then String.fromCharCode(d) for d in new Uint8Array(@response) else []

                            ev.callback T.negotiateError(@status, @statusText, ev), arr.join("")
                        false

                    headers = Object.update(
                        Language: String.LANGUAGE
                    , ev.headers)

                    rq.setRequestHeader h, v for h, v of headers when v

                    rq.responseType = "arraybuffer";

                    rq.send null
                catch ex
                    ev.callback @error("remote_error: " + ev.uri, ex)
                return
