/* 
 * UI Table.
 */

//## the [selection] property.
Object.property.define('multiSelection', function(propId, _super) { 
    return { 
        attachToEntityCtor: function(ctor){
            _super.attachToEntityCtor.call(this, ctor);
            ctor.prototype.alive = true;
        }
        ,
        done : function(T) {
            _super.done.call(this, T);
            T.lastSelection =T.selection = null;
        }
    }
}
,
function(_super) {
    return {
        syncSelection : function() {
            var fn = (function(w) {
                var home = this.home;
                if (w.getChildren) {
                    fn(w.getChildren(),this);
                }
                
                if (w.selectionHome!==home || !w.value) return;
                var oldV =!!w.selected;
                if ((w.selected= home.hasValue(w.value))) {
                    home.lastSelection = w;
                    this.selection.push(w);
                }
                if ((oldV!==w.selected)){//
                    if (w.selectedChanged)  {
                        w.selectedChanged({
                            value:w.selected
                        });
                    }
                    if (home.itemSelectionChanged) {
                        home.itemSelectionChanged({
                            item : w,
                            value:w.selected
                        });
                    }
                }
            }).iterator();

            return function(val) {
                this.lastSelection = null;
                var ev={
                    selection: [],
                    home:this.selectionHome ||this
                };
                fn(this.getChildren(),ev);
                this.setProperty('selection',ev.selection);
            };
        }()
        ,
        valueChanged : function(ev) {
            _super.valueChanged.call(this, ev);
            this.syncSelection(ev);
        }
        ,
        dataChanged : function(ev) {
            _super.dataChanged.call(this, ev);
            this.syncSelection(ev);
        }
        ,
        tapped : function(ev) {
            _super.tapped.call(this, ev);
            this.itemHandler('itemTapped',ev);
        }
        ,
        mouseOver : function(ev) {
            _super.mouseOver.call(this, ev);
            this.itemHandler('itemMouseOver',ev);
        }
        ,
        mouseOut : function(ev) {
            _super.mouseOut.call(this, ev);
            this.itemHandler('itemMouseOut',ev);
        }
        ,
        itemHandler : function(key, ev) {
            _super.itemHandler.call(this, ev);
            for (var w=ev.entity; w&&!w.selectionHome;w=w.parentEntity){}
            if (w && w.selectionHome){
                w.selectionHome[key](ev,ev.selectionItem = w, ev.entity = w.selectionHome);
            }
        }
        ,
        itemMouseOver : function(ev, item) {
        }
        ,
        itemMouseOut : function(ev, item) {
        }
        ,
        itemTapped : function(fn) {
            return function(ev, w) {
                if (this.multiSelection && (ev.internal.ctrlKey || this.forcedMultiSelection) ) {
                    this.putIntoMultiValue(w.value, -1);
                } else if (ev.internal.shiftKey && this.multiSelection) {
                    if (!(this.lastSelection)) {
                        this.setValue(w.value);
                    } else {
                        var context = {
                            home:this,
                            values:this.getMultiValue(),
                            tappedW:w,
                            lastW:this.lastSelection
                        };
                        fn(this.getChildren(),context);
                        this.setValue(context.values.join(';'));
                    }
                } else {
                    this.setValue({
                        value:w.value||null, 
                        datum:w.datum
                    });
                }
            };
        }(
            (function(w){
                if (w.disabled || !w.value) return;
                var context = this, isStopper= (w===context.lastW) || (w===context.tappedW);
                var home = context.home;
                if (context.inBounds){
                    if (home.mvalue.indexOf(''+w.value)==-1) {
                        home.mvalue.push(''+w.value);
                    };
                    if (isStopper){
                        return;
                    } else {

                }
                } else {
                    if (isStopper){
                        context.inBounds = true;
                        if (home.mvalue.indexOf(''+w.value)==-1) {
                            home.mvalue.push(''+w.value);
                        };
                    } else {

                }
                }
            }).iterator()
            )
    }
}
);

// ## Item list view:
Object.entity.define({
    id:'table',
    domNodeType:"dl",
    superType:'view'
    ,
    properties:[
    ':children','data','dataUrl','multiSelection:selection',':value',':multiValue'
    ]
    ,
    dataIdKey:'id'
    ,
    columns: [{
        col :'name'
    }]
    ,
    methods : function (_super) {
        return {
            init : function()
            {
                this.columns = this.columns.slice(0);
                if (this.multiSelection) {
                    this.columns.unshift({
                        col :'multi',
                        type:"multiSelect"
                    })
                }
                if (this.drillDown) {
                    this.columns.unshift({
                        col :'exp',
                        type:"treeSubLevel"
                    })
                }
                _super.init.call(this);
            }
            ,
            dataChanged : function(ev)
            {
                this.setChildren(ev);
                _super.dataChanged.call(this, ev);
            }
            ,
            itemSelectionChanged : function(ev)
            {
                Object.set(ev.item,'rowElt.style',{
                    value:'ui-item-selected', 
                    remove:!ev.value
                });
                Object.set(ev.item,'selectionCell.selected', ev.value);
            }
            ,
            itemChildrenAdapter : function(item)
            {
                this.itemColumnsAdapter(this.columns, this, item.data);
                return [{
                    id :"box",
                    css : 'display:block;clear:both;' ,
                    referrer:[this,'rowElt'],
                    children: this.columns
                }];
            }
            ,
            itemColumnsAdapter : (function(v, i, data) {
                v.data = data;
                if (!v.cellType){
                    v.id = v.cellType = v.type ? v.type+'TableCell': 'tableCell';
                }
                v.list = this;
                v.value = data[v.col] || false;
            }).iterator()
            ,
            childrenAdapter :function(list) {
                var ch = [], len, home = this.selectionHome || this;
                if (list && (len = list.length)) {
                    for (var i=0;i < len; i++)
                    {
                        var datum = list[i];
                        ch.push({
                            id:'tableItem',
                            css : 'display:block;',
                            selectionHome :home,
                            data : datum,
                            value : datum[this.dataIdKey]
                        });
                    }
                }
                return ch;
            }
        }
    }
});

// ## Dex grid row widget:
Object.entity.define({
    id:'tableItem',
    domNodeType:"dt",
    properties:[ ':domNode',':style',':children','selected'],
    children:[]
    ,
    childrenAdapter : function() {
        return this.selectionHome.itemChildrenAdapter(this);
    }
    ,
    //
    selectedChanged : function(ev)
    {
    }
});

// ## UIListItems cell:
Object.entity.define({
    id:'tableCell',
    superType:'view',
    css : Object.STYLE_LINE_FIXED+';display:inline-block;'
    ,
    methods : function (_super) {
        return {
            init : function()
            {
                _super.init.call(this);
                this.redrawValue();
            }
            ,
            redrawValue : function()
            {
                this.domNode.innerHTML = this.getValuePresentation();
            }
            ,
            getValuePresentation : function()
            {
                return '<span style="'+Object.STYLE_TEXTLINE+'">&nbsp;'+this.value+'</span>';
            }
        }
    }
});
// # UIListItems cell enriches presentation with link and icon
Object.entity.define({
    id:'linkTableCell',
    superType:'tableCell',
    alive:true,
    hrefFieldName : 'url',
    iconFieldName : 'icon',
    targetWindow:'_blank',
    getValuePresentation : function(a) {
        return !(a = this.data) ? this.value : this.getLinkHTML(this.value
            , a[this.iconFieldName], a.itemStyle, a[this.hrefFieldName],this.targetWindow);
    }
    ,
    tapped : function(ev) {
        if (ev.target.href) {
            Object.dom.stopEvent(ev);
        }
    }
    ,
    // formats rich caption HTML by arguments
    getLinkHTML : function(caption, icon, cl, href, targetWindow) {
        return ([
            '<a style="'+Object.STYLE_TEXTLINE,
            '" ',
            (href ? ' href="' + href + '"' : ''),
            (targetWindow ? 'target="' + targetWindow + '"' : ''),
            (cl ? 'class="' + cl + '"' : ''),
            '>',
            (icon ? '<img style="margin:0px;border:none;vertical-align:middle;" src="' + icon + '"/>'
                : ''), '<span style="padding:0px;">', caption,
            '</span></a>' ]).join('');
    }

});



// ## The [MultiSelect] listview cell:
Object.entity.define({
    id:'multiSelectTableCell',
    superType:'tableCell',
    properties:['selected'],
    style:'ui-trigger',
    css:Object.STYLE_LINE_FIXED+'display:inline-block;width:16px;height:16px;background-position-y:-80px;margin-top:4px;',
    valueClass:"ui-trigger-true",
    alive:true
    ,
    methods : function (_super) {
        return {
            init : function()
            {
                _super.init.call(this);
                this.domNode.innerHTML='&nbsp;&nbsp;';
                this.value = this.data[this.list.dataIdKey];
                this.parentEntity.parentEntity.selectionCell = this;
                this.setProperty('selected', this.list.hasValue(this.value));
            },
            tapped : function(ev)
            {
                this.list.putIntoMultiValue(this.value, this.selected?-1:1);
                Object.dom.stopEvent(ev);
            }
            ,
            selectedChanged : function(ev) {
                this.redrawValue();
            }
            ,
            redrawValue : function()
            {
                this.toggleDomNodeClass(this.valueClass, this.selected);
            }
        }
    }
});


// ## The [TreeSubLevel] listview cell:
Object.entity.define({
    id:'treeSubLevelTableCell',
    superType:'tableCell',
    properties:['expanded'],
    css:Object.STYLE_LINE_FIXED+';display:inline-block;width:1em',
    alive:true
    ,
    methods : function (_super) {
        
        return {
            init : function()
            {
                _super.init.call(this);
                this.setProperty('expanded', this.data.children?-1:0);
            },
            tapped : function(ev)
            {
                this.setProperty('expanded', this.expanded*-1);
                Object.dom.stopEvent(ev);
            }
            ,
            expandedChanged : function(ev) {
                this.domNode.innerHTML = this.expanded ?((this.expanded>0)?'▼' : "►"):"&nbsp;&nbsp;";
                var item = this.parentEntity.parentEntity;
                if (item.subElt) {
                    item.subElt.switchDisplay();
                } else {
                    if (this.expanded>0) {
                        item.createChild({
                            id :"table:",
                            drillDown:true,
                            referrer:[this,'subElt'],
                            css:'margin-left:1em',
                            selectionHome:this.list,
                            data: this.data.children,
                            columns: this.list.columns
                        });

                    }
                }
            }
        }
    }
});
