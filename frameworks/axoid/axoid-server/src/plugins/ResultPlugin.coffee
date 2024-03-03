Object.fire
    uri:'axoid://define/webserver.ResultPlugin'
    methods: (_super) ->
      config: (app) ->
        app.use (req, res, next) ->
            return Object.http.sendError(res, err)  if err = req.error
            return Object.http.sendJson(res, r)  if r = req.result
            return next()  if next
            Object.http.sendError res, 0, "Not resolved: " + req.url
