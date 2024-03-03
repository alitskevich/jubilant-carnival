(function(context) {

    var mongolab = context.mongolab = {
    };
    
    var updateQ = function(u, q) {
        if (q) {
            u.params.query = JSON.stringify(Object.update(u.params.query||{},q))
        }
        return u;
    }
    ;//local
    
    mongolab.dbURI = function(action) {
        var url = Object.parseUri(this.conf().dbUrl+action);
        Object.update(url.params, {'apiKey':this.conf().apiKey});
        return ''+url;
    }
    

    mongolab.conf = function() {
        return this._conf || (this._conf = context.MANIFEST.mongo || {});
    }
    

    mongolab.getCollectionPath = function() {
        return (this.conf().collectionPath||'collections/');
    }
    

    mongolab.perform = function(action,cb, options) {
     
        
            Object.async(Object.update({
                asyncUrl:this.dbURI(action),
                headers:this.conf().headers,
                callback:cb
            }, options))

    }
    
    mongolab.getCollection = function( url, cb, cacheId) {
        
            this.perform(this.getCollectionPath()+url,
                function _mongo_data_cb(err, ev0){
                    if (!err) {
                       setCachedColl(cacheId, ev0.value)
                    }
                    cb(err, ev0);
                }
            )
    }
     
    Object.listen('mongoGetCollection', function(ev){
        mongolab.getCollection(ev.uri,ev.callback, ev.cacheId)
    });
  
    mongolab.getDoc = function(url, cb) {
       this.perform(this.getCollectionPath()+url, cb)
    }
    mongolab.queryDoc = function(url, cb) {
       this.perform(this.getCollectionPath()+url+'&fo=true', cb)
    }
    mongolab.query = function(url, cb) {
       this.perform(this.getCollectionPath()+url, cb)
    }
     
    Object.listen('mongoGetDoc', function(ev){
        mongolab.getDoc(ev.uri, ev.callback)
    });
    Object.listen('mongoQueryDoc', function(ev){
        var u = updateQ(ev.uri,ev.query)
        mongolab.queryDoc(u, ev.callback)
    });
    Object.listen('mongoQuery', function(ev){
        var u = updateQ(ev.uri,ev.query)
        mongolab.query(u, ev.callback)
    });
 
    mongolab.upsert = function(collId, doc, cb) {
        if (doc._id) {
            var id = doc._id['$oid'];
            this.perform(this.getCollectionPath()+collId+'/'+id, cb, {method: "PUT", payload:doc}
            );           
        } else {
            this.perform(this.getCollectionPath()+collId, cb, {method: "POST", payload:doc});           
        }
    }
    
    Object.listen('mongoUpsert', function(ev){
        mongolab.upsert(ev.uri, ev.doc, ev.callback)
    });
    
    mongolab.install = function(collId, data, cb) {
       this.perform(this.getCollectionPath()+collId,cb,{
           method:"POST",
           payload:data
        });
    }
    
    Object.listen('mongoInstall', function(ev){
        mongolab.install(ev.collection, ev.data, ev.callback)
    });

})((typeof exports !== 'undefined')? exports : window );