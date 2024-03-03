/* 
 * HTTP utils.
 */

Object.http = (function(){

    var http = require('http');
    var request = require('request');
    var _perform = function(ev){
        Object.debug('Remote HTTP request', ''+ev.uri);
        request.get(''+ev.uri, ev.options, function (err, response, body) {
            if (!err && response.statusCode == 200) {
                console.log(body) // Print the google web page.
            }
            ev.callback(err, body);
        });
    };
    Object.entity.create({
        id:'EventHandler:http', 
        handleEventImpl: _perform
    });
    Object.entity.create({
        id:'EventHandler:https', 
        handleEventImpl: _perform
    });

    http.withFileContent = function(fileName, cb, encoding) {
        var name = path.join(global.__root, fileName);
        path.exists(name, function(x) {
            if (x) {
                fs.readFile(name, encoding, cb);
            } else {
                cb({
                    reason:'not-found', 
                    message:'Not found: '+fileName
                });
            }
        });
    }
    var MIME = http.MIME = {
        URL_ENCODED:"application/x-www-form-urlencoded",
        JSON:'application/json',
        JS:'text/javascript',
        HTML:'text/html',
        CSS:'text/css',
        IMAGE:'image/*',
        JPG:'image/jpg',
        PNG:'image/png',
        GIF:'image/gif',
        TXT:'text/plain',
        APPCACHE:'text/cache-manifest'
    }
    
    /**
     * Return `true` if the request has a body, otherwise return `false`.
     *
     * @param  {IncomingMessage} req
     * @return {Boolean}
     * @api private
     */

    var _hasBody = function(req) {
        return 'transfer-encoding' in req.headers || 'content-length' in req.headers;
    };

    /**
     * Extract the mime type from the given request's
     * _Content-Type_ header.
     *
     * @param  {IncomingMessage} req
     * @return {String}
     * @api private
     */

    var _mime = function(req) {
        var str = req.headers['content-type'] || '';
        return str.split(';')[0];
    };

    var REASON_CODES = http.REASON_CODES = {
        "ok":200
        ,
        "bad":400
        ,
        "conflict":409
        ,
        "forbidden":403
        ,
        "not-found":404
        ,
        "method-not-allowed":405
        ,
        'internal-server-error':500
    }
    ;
    
    http.fetchPayload = function(ev, req, next) {
        if (['get','delete'].indexOf(req.method)===-1){
            req.addListener('data', function(chunk) {
                ev.body += chunk;
            });
            req.addListener('end', function() {
                Object.http.parsePayload(ev, function(){
                    next(err, ev);
                });
            });
        } else {
            this(err, ev);
        }
    }

    http.parsePayload =  function(ev, cb){
        var mime = ev.headers['content-type'];
        var ch0 = ev.body[0];
        if (mime===MIME.URL_ENCODED) {
            ev.payload = Object.parseUri("?"+ev.body).params;
            cb();
        }
        else  if (mime.indexOf('xml')>-1 || ch0=='<' ) 
        {
            var xml2js = require('xml2js');
            var parser = new xml2js.Parser();
            parser.parseString(ev.body,cb);
        
        }
        else  if (ch0=='{' || ch0=='[') 
        {
            try {
                ev.payload = JSON.parse(ev.body);
            } catch(e){
                this.error("bad", "Bad JSON payload format: " +':'+ e);
            }
            cb();
        
        } else {
            cb();
        }
    
   
    }
    
    http.xmlPayloadParser = function(options){
        var options = options || {}
    
        return function (req, res, next) {
            if (req._body) return next();
            req.body = req.body || {};

            if (!_hasBody(req)) return next();

            // check Content-Type
            if (['application/xml','application/atom+xml','application/rss+xml'].indexOf(_mime(req))==-1) return next();

            // flag as parsed
            req._body = true;

            // parse
            var buf = '';
            req.setEncoding('utf8');
            req.on('data', function(chunk){
                buf += chunk;
            });
            req.on('end', function(){
                var first = buf.trim()[0];

                if (0 == buf.length) {
                    return next(400, 'invalid json, empty body');
                }
        
                var xml2js = require('xml2js');
                var parser = new xml2js.Parser();
                parser.parseString(buf,function(err,result) {
                    if (err) {
                        err.body = buf;
                        err.status = 400;
                        next(err);
                    } else {
                        req.body = result;
                        next();
                    }
                });
            //if (strict && '{' != first && '[' != first) return next(400, 'invalid json');
            }
            );
        }
    };

    http.negotiateMime = function(url) {
        var p = url.lastIndexOf('.'), ext =url.substring(p+1).toUpperCase();
        return MIME[ext] || MIME.HTML;
    }

    http.send = function(res, result, mime, reason) {
        var code = reason ? (REASON_CODES[reason] || 500) : 200;
        res.writeHead(code, http.STATUS_CODES[code], {
            'Content-Type': mime || MIME.HTML
        });
        res.end(result);
    }
    
    // send error as JSON
    http.sendJson = function(res, obj, reason) {
        this.send(res, JSON.stringify(obj), MIME.JSON, reason);
    }
    
    // send error as JSON
    http.sendError = function(res, err, message) {
        err = http.narrowError(err, message);
        http.sendJson(res, err, err.reason);
        return err;
    }
    
    http.narrowError = function(err, message) {
        
        err = Object.error(err ||{}, message);
        
        if (!err.reason || !REASON_CODES[err.reason]) {
            err.reason = 'internal-server-error';
        }
    
        if (!err.message) {
            err.message = http.STATUS_CODES[REASON_CODES[err.reason]];
        }
        
        return err;
    }
    
    return http;
    
})();
