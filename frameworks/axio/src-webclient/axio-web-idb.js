(function(global){
    
    /** 
     * Web Indexed DB API.
     **/

    // Generate four random hex digits.
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    // Generate a pseudo-GUID by concatenating random hexadecimal.
    function guid() {
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }
    // narrow object from {#s*}
    function narrowFromString(obj, key, def) {
        var r = obj;
        if (!r || typeof(r)==='string') {
            r = {};
            r[key || 'id'] = obj || def;
        }
        return r;
    }
    var IDBKeyRange = global.IDBKeyRange || global.webkitIDBKeyRange ; // No prefix in moz
    var IDBCursor = global.IDBCursor || global.webkitIDBCursor ||  global.mozIDBCursor ||  global.msIDBCursor ;
    var PREV = IDBCursor.PREV || "prev";
    var NEXT = IDBCursor.NEXT || "next"

    var _createIndexIterator = (function(idx){
        idx = narrowFromString(idx,'keyPath');
        this.createIndex(String.camelize(idx.keyPath,','), idx.keyPath, idx.options);
    }).iterator();
    
    var _createStoresIterator = (function(st){
        this.createStore(st.id,st.keyPath||'id',st.indices);
    }).iterator()

    function _openCursorArgs(options) {
        var range = options.range;
        var desc = options.descend || (options.dir ==='desc');
        if (!range) return [null, !desc ? NEXT: PREV];
        
        if (range instanceof Array) {
            var lower = range[0], upper = range[1];
            if (upper===null) {
                return [IDBKeyRange.lowerBound(lower)];
            }
            if (lower===null) {
                return [IDBKeyRange.upperBound (upper)];
            }
            desc = (lower > upper);
            return  [IDBKeyRange.bound.apply(IDBKeyRange, desc?[upper, lower]:[lower, upper] ), desc ? PREV : NEXT];
        }
        
        return [IDBKeyRange.only(range)];
    }
    
    var _openCursor = function(store, options, next) {
        var key = options.key, src = key && store.index(String.camelize(key,',')) || store;
        var cursor = src.openCursor.apply(src, _openCursorArgs(options));
        if (!cursor) {
            next("No cursor");
        } else {
            cursor.onerror = function(e){
                next(Object.error("failed",'cursor error',e));
            };
            cursor.onsuccess = _createCursorOnSuccess(options, next);
        }
    };

    // Creates a handler for the cursor’s `success` event:
    var _createCursorOnSuccess = function (options, next) {
        var elements = [];
        var skipped = 0, processed = 0;
        
        return function (e) {
            var cursor = e.target.result;
            if (!cursor) {
                // We're done. No more elements.
                next(null, elements); 
            }
            else {
                // Cursor is not over yet.
                if (options.limit && processed >= options.limit) {
                    next(null, elements); 
                    e.target.transaction.abort();
                }
                else if (options.offset && options.offset > skipped) {
                    skipped++;
                    cursor['continue'](); /* We need to Moving the cursor forward */
                } else {
                    elements.push(cursor.value);
                    processed++;
                    cursor['continue']();
                }
            }
        }
    }
    var _openDb =function(T){
        // Naming is a mess!
        var indexedDB = global.indexedDB || global.webkitIndexedDB || global.mozIndexedDB || global.msIndexedDB ;
        Object.update(indexedDB.open(T.id, T.version), {
            onblocked : function(ev){
                Object.debug("blocked", ev);
            }
            ,
            onsuccess : function (ev) {
                T.db = ev.target.result; // Attach the connection ot the queue.
                if (T.db.version===T.version) {
                    T.setReady();
                }
            }
            ,
            onerror : function (ev) {
                T.error("failed","Couldn't not connect to the database",ev);
            }
            ,
            onabort : function (ev) {
                T.error("failed","Connection to the database aborted",ev);
            }
            ,
            onupgradeneeded : function(ev){
                var tx = ev.target.transaction;
                T.db =tx.db;
                T.upgradeVersion(tx, ev.oldVersion, ev.newVersion)
            }
        });        
    }
    
    var _OP_GET_STORE  = [function(ev) {
        var u = ev.uri;    
        ev.store = (ev.store || ev.collection || u.path[0]).toLowerCase();
        this.options = ev.options = Object.update(u.params, ev.options);
        this.payload = ev.payload = ev.payload || ev.docs || ev.doc;

        return (this._store || (this._store = (ev.db.db.transaction(ev.scope || [ev.store], ev.txType || 'readwrite')).objectStore(ev.store)));
    }];

    var _OP_PUT = [function(err, store) {
        if (this.ok(err)) {
            var docs =Array.isArray(this.payload)?this.payload:[this.payload];
            var next = this,ev =next.event, i=0;
            var onerr = function(e) {
                next(e)
            }
            var on = function(e) {
                var doc = docs[i++];
                if (doc) {
                    doc.id = doc.id || doc._id || guid();
                    doc.ts = doc.ts || Date.now().valueOf();
                    var rq = store.put(doc);
                    rq.onsuccess = on;
                    rq.onerror = onerr;
                } else {
                    next();
                }
            }
            on();
        }
    }];

    var _applyOn = function(req, next, errMsg) {
        req.oncomplete = function (event) {
            next();
        };
        req.onerror = function (event) {
            next(errMsg);
        };
        return req;
    }
    var _OPS={
        // Query the database
        query: [function(err, store) {
            if (this.ok(err)) {
                _openCursor(store, this.options || {}, this);
            }
        }]
        ,
        // Reads from storeName in db with json.id if it's there of with any json.xxxx as long as xxx is an index in storeName
        find: [function (err, store) {
            if (this.ok(err)) {
                var doc  =this.payload, next = this;
                var req = null;
                if (doc.id) {
                    req = store.get(doc.id);
                } else {
                    // We need to find which index we have
                    for (var key in store.indexNames) {
                        var index = store.index(key);
                        if (doc[index.keyPath]) {
                            req = index.get(doc[index.keyPath]);
                            break;
                        }
                    }
                }
                if (req) {
                    req.onsuccess = function (event) {
                        if (event.target.result) {
                            next(null, event.target.result);
                        } else {
                            next('not_found');
                        }
                    };
                    req.onerror = function () {
                        next('not_found'); // We couldn't find the record.
                    }
                } else {
                    next('not_found'); // We couldn't even look for it, as we don't have enough data.
                }
            }
        }]
        ,
        // Insert operations
        insert : _OP_PUT
        ,
        // Update operations
        update : _OP_PUT
        ,
        // Upsert operations
        upsert : _OP_PUT
        ,
        // Remove operations
        remove : [function(err, store) {
            _applyOn(store['delete'](this.payload.id), this, "Not Deleted");
        }]
        ,
        // Clears all records operations.
        clear : [function(err, store) {
            _applyOn(store.clear(), this, "Not cleared");
        }]
    }
    
    //## UI [fieldset] component:
    Object.entity.define('IndexedDatabase extends EventHandler', {
        //schema version need to be an unsigned long
        version: 1
        ,
        ready: false // not ready by default
        ,
        methods : function (_super) {
            return {
                init : function(){
                    _super.init.call(this);
                    _openDb(this);
                } 
                ,
                // upgrate db version
                handleEventImpl : function(ev){
                    this.perform(ev);
                }
                ,
                // Perform something with the database
                perform : function(ev, cb, op) {
                    var u = ev.uri = ev.uri || Object.parseUri('/'+(op || ev.operation));
                    
                    ev.db = this;

                    op = u.host || 'query';    
                    if ((op==='query')|| (op==='read')) {
                        ev.txType = 'readonly';
                    }
                    Function.perform(_OP_GET_STORE.concat(_OPS[op]||[], cb||ev.callback||[]), ev);
                }
                ,
                // database error hook
                error : function(err,mesage,info){
                    Object.error.log(err, mesage, info);
                } 
                ,
                // close db
                close : function(){
                    this.db && this.db.close();
                }
                ,
                // Perform something with the database
                setReady : function(err) {
                    if (err) {
                        this.error(err)
                    } else {
                        Object.log("IndexedDatabase is ready: id=", this.id, " version=", this.version);
                        _super.setReady.call(this);
                    }
                }
                ,
                // Performs a query on storeName in db.
                // options may include :
                // - key :  keyPath to be used for filter
                // - range : range for the keyPath
                // - limit : max number of elements to be yielded
                // - offset : skipped items.
                query : function(ev, cb) {
                    this.perform(ev, cb, 'query');
                }
                ,
                // Reads from storeName in db with json.id if it's there of with any json.xxxx as long as xxx is an index in storeName
                read : function (ev, cb) {
                    this.perform(ev, cb, 'read');
                }
                ,
                // insert from storeName in db with json.id if it's there of with any json.xxxx as long as xxx is an index in storeName
                insert : function (ev, cb) {
                    this.perform(ev, cb, 'insert');
                }  
                ,
                // insert from storeName in db with json.id if it's there of with any json.xxxx as long as xxx is an index in storeName
                update : function (ev, cb) {
                    this.perform(ev, cb, 'update');
                }
                ,
                // insert from storeName in db with json.id if it's there of with any json.xxxx as long as xxx is an index in storeName
                upsert : function (ev, cb) {
                    this.perform(ev, cb, 'upsert');
                }
                ,
                // creates a new Store in this database
                createStore : function(id, keyPath, indices){
                    var store = this.db.createObjectStore(id, narrowFromString(keyPath||'id','keyPath'));
                    _createIndexIterator(indices, store);
                }
                ,
                // creates a list of new Store in this database
                createStores : function(meta){
                    _createStoresIterator(meta, this);
                }
                ,
                // upgrates db version
                upgradeVersion : function(tx, oldVersion, newVersion){
                    var T = this;
                    Function.perform([function(){
                        this.db = T;
                        this.tx = tx;
                        Object.debug("Upgrade", oldVersion, " => ", newVersion);
                        this(null,oldVersion);
                    }].concat(
                        (this.migrations ||[]).slice(oldVersion)
                        ,
                        function (err) {
                            T.setReady(err);
                        }
                        )
                    );
                }
            };
        }
    });
})(this);

