/* 
 * File system.
 */

Object.fs = (function(){

    var fs = require('fs')
    ,
    path = fs.path = require('path');
    
    fs.withFileContent = function(fileName, cb, encoding) {
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
    
    Object.entity.create({
        id:'EventHandler:file', 
        handleEventImpl: function(ev){
            fs.withFileContent(ev.uri.steps.join('/'), function(err, content) {
                if (content) {
                    Object.http.send(ev.res, content, Object.http.negotiateMime(''+ev.uri));
                } else {
                    Object.http.sendError(ev.res, "not-found", 'Url not found: '+ ev.uri);
                }
            }, ev.encoding);
        }
    });
    
return fs;
    
})();