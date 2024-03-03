/* 
 * Web SQL API.
 */
(function(global){
    
    var queryResultsAdapter = function(results){
        var r = [];
        for (var i=0,len = results.rows.length; i<len; i++){
            var item = results.rows.item(i), _id = item.id, name = item.name;
            if (item.body) {
                item = JSON.parse(item.body);
                item._id = _id;
                item.name = name;
            }
            r.push(item);
        }
        return r
    }
    ,
    findResultsAdapter = function(results){
        var r = queryResultsAdapter(results);
        return r && r[0] || null;
    }
    ,
    // Query the success callback
    writeResultAdapter = function (results) {
        Object.debug("Returned rows = " + results.rows.length);
        // this will be true since it was a select statement and so rowsAffected was 0
        if (!results.rowsAffected) {
            Object.debug('No rows affected!');
            return false;
        }
        // for an insert statement, this property will return the ID of the last inserted row
        // console.log("Last inserted row ID = " + results.insertId);
        return results.rowsAffected;
    }
    ,
    txInsert = function(ev, resultAdapter){
        var doc = ev.doc,_id=ev.docId||doc._id || (Date.now()).valueOf(), name = doc.name, next = this;
        delete doc['_id'];
        delete doc.name;
            
        this.tx.executeSql('INSERT INTO '+ev.collection.toUpperCase()+' (id, name, body) VALUES (?, ?, ?)'
            , [_id, name, JSON.stringify(doc)], function (tx, results) {
                next(null, (resultAdapter||writeResultAdapter)(results))
            },  next);
    }
    ,
    txUpdate = function(ev, resultAdapter){
        var doc = ev.doc,_id=ev.docId||doc._id, name = doc.name, next = this;
        
        delete doc['_id'];
        delete doc.name;
        
        this.tx.executeSql('UPDATE '+ev.collection.toUpperCase()+' SET name=?, body=? WHERE id=?'
            , [name, JSON.stringify(doc), _id], function (tx, results) {
                next(null, (resultAdapter||writeResultAdapter)(results))
            },  next);
    }
    ,
    txDelete = function(ev, resultAdapter){
        var doc = ev.doc,_id=ev.docId||doc._id, next = this;
        
        this.tx.executeSql('DELETE FROM '+ev.collection.toUpperCase()+' WHERE id=?'
            , [_id], function (tx, results) {
                next(null, (resultAdapter||writeResultAdapter)(results))
            },  next);
    };
    
    //## UI [fieldset] component:
    Object.entity.define({
        id:'WebDatabase'
        , 
        properties:['boolean:ready','number:touched']
        ,
        touched:0
        ,
        version: '1.0'
        ,
        name:'database'
        ,
        initialSize : 200000
        ,
        methods : function (_super) {
            return {
                init: function(){
                    _super.init.call(this);
                   
                    this.db = global.openDatabase(this.id, this.version, this.name, this.initialSize);
                    this.onOpened();
                    // register async listener for DB calls
                }   
                , 
                handleEvent: function(ev){
                    var u = ev.uri;
                    ev.collection = u.path[0];
                    ev.params = u.params;
                    this[u.host](ev);
                }
                ,
                //
                onOpened : Function.NONE
                ,
                // Perform something with the database
                perform:function(ev) {
                    var T =  this;
                    Function.perform(([
                        function(){
                            var next = this, tx = ev.tx;
                            next.event = ev;
                            if (tx) {
                                next(null, next.tx = tx);
                            } else {
                                T.db.transaction(function (tx) {
                                    next(null, next.tx=tx)
                                }, Function.NONE, Function.NONE);
                            }
                        }
                        ,
                        function (err, tx) {
                            var next = this;   
                            if (this.ok(err)) {
                                if (ev.batch) {
                                    var _err=null, cnt=0, lastId, total = ev.batch.length, curr=0;
                                    var fnCb = function (tx, results) {
                                        cnt+=(results.rowsAffected||0);
                                        if (++curr===total) {
                                            next(_err,{
                                                rowsAffected:cnt, 
                                                insertId:lastId
                                            });
                                        }
                                    }
                                    ,
                                    fnErr = function(tx, err){
                                        _err = err;
                                        Object.error.log('SQL batch', err);
                                        if (++curr===total) {
                                            next(_err,{
                                                rowsAffected:cnt, 
                                                insertId:lastId
                                            });
                                        }
                                    };
                                    
                                    for(var i=0; i<total;i++){
                                        var b = ev.batch[i];
                                        Object.debug(b.sql || ev.sql || b)
                                        tx.executeSql(b.sql || ev.sql || b
                                            , b.params||[]
                                            , fnCb //lastId=results.insertId;
                                            , fnErr);
                                    }
                                } else {
                                    //Object.debug(ev.sql);
                                    tx.executeSql(ev.sql, ev.params
                                        ,
                                        function (tx, results) {
                                            next(null, (ev.resultAdapter||Function.NONE)(results))
                                        }
                                        ,  
                                        function (tx, err) {
                                            next(err)
                                        });
                                }
                            }
                        }
                        ]).concat(ev.callback))
                }
                ,
                // Query the database
                query:function(ev) {
                    ev.sql='SELECT * FROM '+ev.collection.toUpperCase();
                    ev.resultAdapter = queryResultsAdapter;
                    this.perform(ev);
                }
                ,
                // Find one in the database
                findOne:function(ev) {
                    ev.sql='SELECT * FROM '+ev.collection.toUpperCase()+" WHERE ID = ? ";
                    ev.resultAdapter = findResultsAdapter;
                    ev.params = [ev.docId || ev.doc._id];
                    this.perform(ev);
                }
                ,
                // Upsert worker
                _upsert : function(ev, _fnYes, _fnNone) {
                    var T = this;
                    ev.callback = [
                    function(err, result) {
                        if (!err) {
                            T.incrementProperty('touched', 1);
                        }
                        if (result) {
                            ev.doc = Object.update(result, ev.doc);
                            _fnYes && _fnYes.call(this, ev);
                        } else {
                            _fnNone && _fnNone.call(this, ev);
                        }
                    }
                    ].concat(ev.callback);
                    this.find(ev);
                }  
                ,
                // Upsert
                upsert : function(ev) {
                    this._upsert(ev, txUpdate, txInsert);
                }
                ,
                // Update
                update : function(ev) {
                    this._upsert(ev, txUpdate);
                }
                ,
                // Update
                remove : function(ev) {
                    this._upsert(ev, txDelete);
                }
                ,
                // Insert
                insert : function(ev) {
                    this._upsert(ev, null, txInsert);
                }
                ,
                // error cb
                errorCB: function (err) {
                    Object.error.log("SQL", err);
                }
                ,
                // appendCreateCollectionSql
                appendCollectionSql: function(batch, coll, content, forceReset) {
                    coll  = coll.toUpperCase();
                    if (!batch) {
                        batch = [];
                    }
                    if (forceReset) {
                        batch.push(String.format('DROP TABLE IF EXISTS {0}', coll));
                    }
                    batch.push(String.format('CREATE TABLE IF NOT EXISTS {0} (id unique, created, modified, name, icon, type, starred, status, url, tags, content)', coll));
                    this.appendPopulateCollectionSqlIterator(content, batch, 'INSERT INTO '+coll+' (id, name, body) VALUES (?, ?, ?)');
                    return batch;
                }
                ,
                // appendPopulateCollectionSqlIterator
                appendPopulateCollectionSqlIterator: (function(p, i, sql){
                    var _id =  p.id, name = p.name;
                    delete p.id;
                    delete p.name;
                    this.push({
                        sql:sql, 
                        params:[_id, name, JSON.stringify(p)]
                    })
                }).iterator()
            };
        }
    });

})(this);
