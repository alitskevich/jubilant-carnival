Object.http = (->
    
    http = require("http")
    request = require("request")
    
    MIME = http.MIME =
        URL_ENCODED: "application/x-www-form-urlencoded"
        JSON: "application/json"
        JS: "text/javascript"
        HTML: "text/html"
        CSS: "text/css"
        IMAGE: "image/*"
        JPG: "image/jpg"
        PNG: "image/png"
        GIF: "image/gif"
        TXT: "text/plain"
        APPCACHE: "text/cache-manifest"

    REASON_CODES = http.REASON_CODES =
        ok: 200
        bad: 400
        conflict: 409
        forbidden: 403
        "not-found": 404
        "method-not-allowed": 405
        "internal-server-error": 500

    ###
    Return `true` if the request has a body, otherwise return `false`.
    
    @param  {IncomingMessage} req
    @return {Boolean}
    @api private
    ###
    _hasBody = (req) -> 
        "transfer-encoding" of req.headers or "content-length" of req.headers

    
    ###
    Extract the mime type from the given request's
    _Content-Type_ header.
    
    @param  {IncomingMessage} req
    @return {String}
    @api private
    ###
    _mime = (req) ->
        (req.headers["content-type"] or "").split(";")[0]

    _statusCode = (reason) ->
        (if reason then (REASON_CODES[reason] or 500) else 200)
        
    http.fetchPayload = (ev, req, next) ->
        if [
            "get"
            "delete"
        ].indexOf(req.method) is -1
            req.addListener "data", (chunk) ->
                ev.body += chunk
                return

            req.addListener "end", ->
                Object.http.parsePayload ev, ->
                    next err, ev
                    return

                return

        else
            this err, ev
        return

    #if (strict && '{' != first && '[' != first) return next(400, 'invalid json');
    http.negotiateMime = (url) ->
        p = url.lastIndexOf(".")
        ext = url.substring(p + 1).toUpperCase()
        MIME[ext] or MIME.HTML

    http.send = (res, result, reason) ->
        res.status(_statusCode reason).send(result)

    # send error as JSON
    http.sendJson = (res, obj, reason) ->
        res.status(_statusCode reason).json(obj)

    # send error as JSON
    http.sendError = (res, err) ->
        err = Object.error(err).log()
        res.status(_statusCode err.reason).json(error: err)
        err

    Object.fire
        uri:'axoid://define/EventHandler/HttpService'
        
        methods: (_super)->
            F0 = (x) -> x
            
            # Parsers for given resource type
            PARSERS =
                js: Object.parse
                json: Object.parse
                uri: Object.parseUri

            resolveUri : (uri) ->
                "" + uri
                
            onRequestReady: (rq, ev)->
                ev.callback @negotiateError(rq.status, rq.statusText, ev), (rq.responseText)
                    
            onEvent: (ev, uri=ev.uri) ->
                url = @resolveUri(uri)
                
                @log "Remote HTTP request #{url}"
                request[ev.method or 'get'] url, ev.options, (err, response, body) =>
                    #@log body or err # if not err and response.statusCode is 200 # Print the google web page.
                    unmarshaller = (ev.unmarshaller or PARSERS[ev.dataType] or F0)
                    ev.callback err, unmarshaller body

    http
)()

