# Server Plugin that adds the MongoDb support.
Object.fire
    uri:'axoid://define/EventHandler/webserver.MongoPlugin' 
    
    options : {}
    
    methods: (_super) ->

        # mongo connector
        mongo = undefined
        _mongo = ->
            (mongo or (mongo = require("mongodb")))
        
        # database instance
        db = undefined
        
        _close = ->
            db?.close()
            db = null

        # ObjectID factory
        _objectID = (id) -> if id then new mongo.BSONPure.ObjectID(id) else null

        _obj = (o) -> (if (typeof (o) is "string") then Object.parse(o) else o)
        
        _optionsKeys = [ "limit", "sort", "fields", "skip", "hint", "explain", "snapshot", "timeout" ]

        _queryOptionsFilter = (params, r = {}) ->
            
            (r[k] = v) for k in _optionsKeys when v=params[k] 
            
            r.sort = _obj r.sort
            r.fields = _obj r.fields
            r.limit = Number(r.limit) or 100
            r.skip = Number(r.skip) or 0
            
            r
            
        _first = (collectionId, flow)->
            ->
                @next = flow.next

                # collection 
                @collectionId = collectionId
                # query
                @query = Object.parse(@query) or _objectID(@docId or @hash) unless @query
                # payload
                @payload = @doc or @docs unless @payload

                if db then @next null, db else _mongo().connect @home.uri, @home.options, @next

        _collection = (err, db) ->
            return @next(err)  if err
            db.collection @collectionId, @next
        
        _cursor = (err, collection) ->
            return @next(err)  if err
            collection.find @query, _queryOptionsFilter(@), @next  
           
        _count = (err, cursor) ->
            if err then @next(err) else @next(null, cursor.count)

        _query = (err, cursor) ->
            if err then @next(err) else cursor.toArray @next
                
        _findOne = (err, docs) ->
            @next err, Array.item(docs)
            
        _insert = (err, collection) ->
            if err then @next(err) else collection.insert @payload, @options, @next  
                
        _update = (err, collection) ->
            if err then @next(err) else collection.update @query, @payload, @options, @next

        _upsert = (err, collection) ->
            if err then @next(err) else collection.update @query, @payload, Object.update(@options, upsert : true), @next
            
        _remove = (err, collection) ->
            if err then @next(err) else collection.remove @query, @next
                        
        _retPayload = (err) ->
            @next err, if err then null else @payload
          
        _last = (err, result)->
            if err
                @home.error err
                _close()
                    
            @next err, result

        OPERATIONS =
              
              # query items
              query: [_cursor, _query]
              
              # count items
              count: [_cursor, _count]
              
              # find one
              find: [_cursor, _query, _findOne]
              
              # insert new items
              insert: [ _insert, _retPayload ]
              
              # update items by query
              update: [ _update, _retPayload ]
              
              # upsert items by query
              upsert: [ _upsert, _retPayload ]
              
              # delete items by query 
              remove: _remove

        perform: (collectionId, op='query', opts={}, cb) ->
            opts = Object.clone opts, home : @
            
            @log(collectionId, op); 
            
            Function.perform opts, (flow)-> 
                    [_first(collectionId, flow)].concat _collection, OPERATIONS[op], _last, cb

        onEvent: (ev, u) ->
            @perform u.host, u.path[0], ev, ev.callback
            
        done: ->
            _close()
            _super.done.call @
