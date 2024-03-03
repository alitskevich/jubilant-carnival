/* 
 * Showdown UI.
 */


// @define UI [App] entity
Object.entity.define('ShowDownHtml extends html', {    
    methods: function(_super) {
        function findCode(pre) {
            for (var i = 0; i < pre.childNodes.length; i++) {
                var node = pre.childNodes[i];
                if (node.nodeName == 'CODE')
                    return node;
                if (!(node.nodeType == 3 && node.nodeValue.match(/\s+/)))
                    break;
            }
            return null;
        }
        var hljs = window.hljs, sdc = window.Showdown.converter;
        
        var r = {
            init : function() {
                _super.init.apply(this, arguments);
                this.converter = new sdc();
            }
            ,            
            htmlAsyncAdapter : function(err, text) {
                if (!text) {
                    return 'nothing';
                } else if (text[0]==='<') {
                    return text;
                } else {
                    return this.converter.makeHtml(text);
                }
            }
        }
        if (hljs) {
            r.htmlChanged = function() {
                    var pres = this.domNode.getElementsByTagName('pre');
                    for (var i = 0; i < pres.length; i++) {
                        var code = findCode(pres[i]);
                        if (code)
                            window.hljs.highlightBlock(code, window.hljs.tabReplace);
                    }
            }
        }
        return r;
    }    
});
    
