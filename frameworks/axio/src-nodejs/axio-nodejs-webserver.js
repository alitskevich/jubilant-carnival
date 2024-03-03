/* 
 * The AxioServer class.
 */

// RemoteServerModule 
Object.entity.define('RemoteServerModule extends EventHandler',{
     
    methods : function (_super) {
        var opDone = function(err, result, mime){
            var ev = this.event;
            if (this.viewId) {
                ev.renderView(this.viewId, result);
            } else {
                if (err) {
                    ev.error(err);
                } else {
                    ev.send(result, this.contentType || mime);
                }
            }
            ev.done();
        }
        //
        var opInitArray = [function(ev) { 
            this.event = ev;
            this.options = ev.options;
            this.payload = ev.payload;
            ev.callback  = this;
            this(ev);
        }];
    
        return {
            // init
            init: function() {
                _super.init.call(this);
                Object.log('++Module: ', this.id);
                //delete require.cache[p];
                var m = this.impl = require(this.requirePath, true);
                m.init && m.init(this.server, this.config);
            }
            ,
            // done
            done: function() {
                Object.log('--Module: ', this.id);
                this.impl.done && this.impl.done(this);
            }
            ,
            handleEvent: function(ev) {
                ev = ev.payload;
                var uri = ev.uri;
                var opId = String.capitalize(String.camelize(uri.path[1]));
                var op = this.impl[ev.options.method+opId];
                var opName = this.id+'.'+ev.options.method+opId;
                if (op) {
                    try {
                        Object.log('!!! Operation', opName);
                        Function.perform(opInitArray.concat(op, opDone), ev); // do perform
                    } catch(ex){
                        ev.error(ex, "Error in "+ opName);
                    }              
                } else {
                    if ((ev.options.method==='options') && this['post'+opId]) {
                        ev.send('OK');
                    } else {
                        ev.error("no-op", 'Operation not found: '+ opName);
                    }
                }
            }
        }
    }
});

// Object.web.Server prototype 
Object.entity.define('RemoteServer extends EventHandler',{
     
    methods : function (_super) {
        
        var narrowCfg = function(r) {
            return (typeof(r)==='string')?{'id':r}:r;
        }
        
        var initModuleIterator = (function(cfg, i, T) {
            cfg = narrowCfg(cfg || {});
            var p = T.config('rootdir','.') + '/' +(cfg.path || String.format(T.config('modulesPattern')||'{0}.js', cfg.id));
            this[cfg.id] = Object.entity.create({
                id:'RemoteServerModule:remote_'+cfg.id, 
                config : cfg, 
                server : T,
                requirePath : p
            });
        }).iterator();
        
        return {
            // init
            init: function() {

                // underlying http server
                this.httpServer = require('http').createServer(this.app); 
                
                _super.init.call(this);
       
                // init modules
                this.modules = initModuleIterator(this.config('modules'), {}, this);

            } 
            ,
            // done server instance.
            // invoked from process.on('SIGTERM') hook
            done : function (cb){
                //require.cache = {};
                Object.unlisten._all();
                for (var n in this.modules) {
                    this.modules[n].done();
                }
                this.httpServer.removeAllListeners('connection');
                this.httpServer.removeAllListeners('request');
                this.httpServer.close(cb);
                return this;
            }
            ,
            // gets config param
            config: function(key, def) {
                return Object.get(this.cfg, key) || def || null;
            }
            ,
            // listen http port
            listenHttpPort : function (port, cb){   
                port = port || this.config('http.port', 80);
                this.httpServer.listen(port, function() {
                    Object.log('Server is listening at port: ', port);
                    cb && cb();
                });
            }
            ,
            // express handler that 
            //   - dispatch requests to handle with appropriate module method 
            //   - and then send the result back with response
            createHandler:function () {
        
                return function (req, res, next) {
                    
                    var isMethodAllowed = ['get','post','put','delete','options'].indexOf(req.method.toLowerCase())>-1;
                
                    if (!isMethodAllowed) {
                        next();
                    } else {
                        var ev = Object.entity.create({
                            id:'RemoteServerEvent', 
                            req : req, 
                            res : res
                        });
                        
                        var foundModule = Object.notify({
                            uri:'remote_'+(ev.uri.path[0] || 'home')+'://handle',
                            payload: ev
                        });
                        
                        if (!foundModule) {
                            next();
                        }
                    }      
                }
            }
        }
    }
});

// RemoteServer Event 
Object.entity.define('RemoteServerEvent extends EventHandler',{
     
    methods : function (_super) {
        return {
            // init
            init: function(config) {
                _super.init.call(this);
                
                var req = this.req;

                this.payload = req.body || '';
                
                var opts = this.options = {};
    
                for (var n in req.headers) {
                    opts[n.toLowerCase()] = req.headers[n];
                }
                var host = opts['x-forwarded-host'] || opts.host || 'default';
    
                this.uri = Object.parseUri('//'+host+req.url);
    
                this.access_token =  opts['x-authorization'] || opts['authorization'] || null;
    
                Object.update(opts, this.uri.params);
    
                opts.method = req.method.toLowerCase();
    
                opts.language = opts.language || opts.lang || String.LANGUAGE;
            }
            ,
            // done
            done: function() {
                this.payload = this.req = this.res = null;
            }
            ,
            // send error as JSON
            error : function(err, message) {
                Object.error.log(Object.http.sendError(this.res, err, message));
            }
            ,
            // send static file content
            sendStatic : function (filename) {   
                Object.notify({
                    uri : 'file://'+filename, 
                    res:this.res
                });
            }
            ,
            // send object as JSON
            sendJson : function(obj, reason) {
                Object.http.sendJson(this.res, obj, reason);
            }
            ,
            // send string result
            send : function(result, mime, reason) {
                Object.http.send(this.res, (typeof(result)==='string') ? result : JSON.stringify(result), mime, reason);
            }
            ,
            // renders a view
            renderView : function (viewId, context){  
                Object.notify({
                    uri : 'view://'+viewId, 
                    context: context, 
                    res: this.res
                });
            }
        }
    }
});