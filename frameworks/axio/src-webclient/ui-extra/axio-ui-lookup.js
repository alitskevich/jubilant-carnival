/* 
 * UI lookup field.
 */

//## UI lookup field:
Object.entity.define({
    id:'lookup', 
    superType:'field', 
    properties:['data',':popup',':multiValue'],
    dataCaptionKey:'name',
    dataIdKey:'id',
    editorMeta:{
        id:"table"
    }
    ,
    methods : function (_super) {
        return {
            launchEditor : function(ev) {
                if (this.isEditable()) this.displayPopup(true);
            }
            ,
            createPopup : function(home) {
                var p = _super.createPopup.call(this, home);
                this.tree = p.createChild(Object.update(this.editorMeta,{
                    dataIdKey:this.dataIdKey
                }));
                this.tree.setProperty('data',this.data);
                this.tree.setProperty('value',this.getValue());
                var T = this;
                Object.listen(this.tree.id+'.value', function(ev) {
                    T.doneEditor(ev);
                });
                return p;
            }
    
            ,
            dataChanged : function(ev, v) {
                _super.dataChanged.call(this, ev, v);
                if (this.tree) {
                    this.tree.setProperty('data',ev);
                }
                this.redrawValue();
            }
            ,
            //Resolves value to caption
            getCValue : function() {
                
                var fn= (function(item, i, opts) {
                    var v = opts.value;
                    if (item[opts.key]===v) {
                        this.result+= '<span'+(v?'':' class="empty-value"')+' style="'+Object.STYLE_TEXTLINE+'">&nbsp;'+(item[opts.captionKey]||'')+'</span>';
                    } 
                    if (item.children) {
                        fn(item.children, this, opts);
                    }
                }).iterator();
        
                return function() {
                    var opts = {value:this.getValue(), key:this.dataIdKey, captionKey: this.dataCaptionKey};
                    return fn(this.data, {result:''}, opts) ||  this.getValue() || this.placeholder || '';
                    
                };
            }()
        }
    }
});


//## lookup field:
Object.entity.define({
    id:'multiLookup', 
    superType:'lookup', 
    properties:[':multiValue'],
    editorMeta:{
        id:"table:",
        multiSelection:true,
        drillDown:true
    }
    ,
    //Resolves value to caption
    getCValue : function() {
        var fn=(function(v) {
            var pk = v[this.idKey], index = this.values.indexOf(''+pk);
            if (index>-1){
                this.values[index] = '<span'+(pk?'':' class="empty-value"')+' style="'+Object.STYLE_TEXTLINE+'">&nbsp;'+v[this.captionKey]+'</span>';
            }
            if (v.children) {
                fn(v.children, this);
            }
        }).iterator()
        
        return function() {
            var values = this.getMultiValue();
            return fn(this.data,{
                values: values.length? [].concat(values) : [''],
                idKey:this.dataIdKey,
                captionKey:this.dataCaptionKey
            }).values.join(',');
        };
    }()
});
