/**
 * UI field ancestor.
 */
Object.entity.define('field extends box',{
    properties:[':caption',':value',':disabled']
    ,
    children:[]
    ,
    caption:''
    , 
    style:"control-group"
    , 
    valueBoxStyle:'controls'
    , 
    valueStyle:'input-xlarge'
    , 
    captionStyle:'control-label'
    ,
    helpStyle:'help-block'
    ,
    methods : function (_super) {
        return {
            init : function() {
                // normalize caption obtained from id with '.'
                this.caption = this.caption || Array.item(this.id.split('.'),-1);
                // super
                _super.init.call(this);
            }
            ,
            childrenAdapter : function(ch) {
                var T = this;
                if (!ch || !ch.length) {
                    ch = [{
                        id:"view:"+this.id+'_input',
                        referrer:[this, 'valueElt'], 
                        style:this.valueStyle, 
                        alive:true,
                        tapped : function(ev) {
                            return T.doFocus(ev);
                        }
                    }]
                }
                if (this.help) {
                    ch.push({
                        id :"label", 
                        domNodeType:'p', 
                        style:this.helpStyle, 
                        caption:this.help, 
                        referrer:[this,'helpElt']
                    })
                }
                return [
                {
                    referrer:[this,'captionElt'], 
                    id :"view:"+this.id+'_label', 
                    //domNodeType:'label',
                    //style:this.captionStyle
                    domNode:Object.dom.createComplexElement(String.format('<label class="{0}" for="{1}_input"/>', this.captionStyle, this.id))
                }
                ,
                {
                    id : "box",
                    style:this.valueBoxStyle, 
                    children : ch
                }
                ];
            }
            ,
            launchEditor : Function.NONE
            ,
            doFocus : function(ev) {
                this.launchEditor(ev);
            }
            ,
            isEditable : function() {
                return !this.readOnly;
            }
            ,
            valueChanged: function(ev) {
                this.redrawValue();
            }
            ,
            // invoked when value changed
            redrawValue : function() {
                if (this.valueElt) {
                    this.valueElt.domNode.innerHTML=this.getCValue();
                }
                this.updateDomNodeClass('!error');
            }
            ,
            doneEditor : function(ev) {
                var value = ev.value;
                if (value === this.getValue())	return;
                ev.fromUI = true;
                this.setValue(ev);
            }
            ,
            // @add validation rule to be checked from this.checkIfValid()
            addValidationRule : function(rule)
            {
                this.rules = (this.rules||[]).concat(rule);
            }
            ,
            _scanValidationRules : (function(rule,i,T)
            {
                rule.call(T,this);
            }).iterator()
            ,
            _scanNormalizeErrors : (function(err)
            {
                err.entity = this;
            }).iterator()
            ,
            // @check if field has some errors
            // @param err - error object like {stack:[{reason,message}]}
            checkIfValid : function()
            {
                var err = {
                    stack:[]
                };  
                if (this.isValueRequired() && this.isEmptyValue()){
                    err.stack.push({
                        reason:'empty_required_field', 
                        message:String.localize('empty_required_field',String.localize(this.caption|| this.id))
                    });
                }
                this._scanValidationRules(this.rules, err, this);
                var valid = !(err.stack.length); 
                if (!valid) {
                    this._scanNormalizeErrors(err.stack, this)
                }
                this.toggleDomNodeClass('error', !valid);
                return err;
            }
            ,
            isValueRequired : function()
            {
                return this.valueRequired;
            }
            ,
            getCValue : function()
            {
                return this.getValue();
            }
            ,
            getCaptionHtml: function(v, ev){
                return String.localize(v|| this.id)+((this.valueRequired?' <span class="required">*</span>':''));
            }
            ,
            disabledChanged : function(ev,v) {
                _super.disabledChanged.apply(this, arguments); 
                Object.set(this,'valueElt.domNode.disabled', v);  
            }
        };
    }
}
    
);


//## UI Text input field base:
Object.entity.define({
    id:'input'
    , 
    superType:'field'
    ,
    alive:true
    , 
    maxLength :128
    ,
    inputTag :"input"
    ,
    inputType :"text"
    ,
    methods : function (_super) {
        return {
            childrenAdapter : function(ch) {
                ch = this.getInputChildrenMeta();
                return _super.childrenAdapter.call(this,ch);
            }
            , 
            getInputChildrenMeta : function(ch) {
                return [{
                    id:"view:"+this.id+'_input', 
                    domNode:this.create_inputNode(), 
                    style:this.valueStyle, 
                    referrer:[this,'valueElt']
                }];
            }
            ,
            create_inputNode : function() {
                var _done = this.create_onblur_handler();
                return Object.dom.createComplexElement(String.format('<{0} type="{1}" name="{2}" maxLength="{3}"/>',this.inputTag, this.inputType, this.id, this.maxLength), Object.update({
                    placeholder: String.localize(this.placeholder),
                    onblur : _done,
                    onfocusleave : _done,
                    onkeydown : this.create_onkeydown_handler()                      
                }, this.inputNodeAttrs));
            }
            ,
            create_onblur_handler : function() {
                var T=this;
                return function(ev) {
                    T.doneEditor({
                        value:this.value
                    });
                    return true;
                };
            }
            ,
            create_onkeydown_handler : function() {
                var T=this;
                return function(ev) {
                    ev = ev||window.event;
                    if (ev.keyCode ===13){
                        T.doneEditor({
                            value:this.value
                        });
                    };
                    return true;
                };
            }
            ,
            // invoked when value changed
            redrawValue : function() {
                if (this.valueElt) {
                    this.valueElt.domNode.value=this.getValue();
                }
                this.updateDomNodeClass('!ui-error');
            }
            , 
            tapped : function(ev) {
                this.valueElt && this.valueElt.domNode.focus();
            }
        }
    }
});

//## UI text input field:
Object.entity.define({
    id:'textarea'
    , 
    superType:'input'
    ,
    inputTag: 'textarea'
    , 
    maxLength: 8192
});

//## UI text input field:
Object.entity.define({
    id:'password'
    , 
    superType:'input'
    , 
    inputType:'password'
});


//## UI dropdown field:
Object.entity.define({
    id:'dropdown'
    , 
    superType:'input'
    , 
    properties:['data']
    , 
    alive:true
    ,
    methods : function (_super) {
        return { 
            getInputChildrenMeta : function(ch) {
                return [{
                    referrer:[this,'valueElt'], 
                    id:"view:"+this.id+'_input', 
                    domNodeType:"select", 
                    style:this.valueStyle,  
                    domNodeAttrs:{
                        onchange : this.create_onchange_handler()
                    }
                }];
            }
            , 
            tapped : function(ev) {
                this.valueElt && this.valueElt.domNode.focus();
            }
            ,
            create_onchange_handler : function() {
                var T=this;
                return function(ev) {
                    T.doneEditor({
                        value:T.data[this.selectedIndex].id
                    });
                    return true;
                };
            }
            ,
            op_options : (function(v, i) {
                v._pos = i;
                if (this.valueElt) {
                    var is = v.id==this.value;
                    this.valueElt.domNode.options[i] = new Option(v.name, v.id,is, is);
                }
            }).iterator()
            ,
            dataChanged : function(ev, v) {
                _super.dataChanged.apply(this, arguments);
                this.valueElt.domNode.options.length=0
                this.op_options(v,this);
            }
            ,
            redrawValue : function() {
                if (this.data && this.valueElt) {
                    var d = Array.findByAttr(this.data, this.value,'id');
                    this.valueElt.domNode.selectedIndex = d ? d._pos : 0;
                }
            }
        }
    }
});

//## UI checkbox field:
Object.entity.define({
    id:'checkbox', 
    superType:'field',
    captionStyle:'checkbox',
    childrenAdapter : function(ch) {
        var T=this, _done = function(ev) {
            T.doneEditor({
                value:!!this.checked
            });
            return true;
        };
        return [ 
        ['box://'+this.valueBoxStyle,
        ["[label]box://"+this.captionStyle,
        {
            referrer:[this,'valueElt'], 
            id:"view", 
            domNodeType:'input', 
            style:this.valueStyle1
            , 
            domNodeAttrs:{
                onchange : _done
                , 
                type :"checkbox"
                , 
                value:true
                , 
                disabled:this.disabled
                , 
                checked:!!this.getValue()
            }
        }
        ,{
            referrer:[this,'captionElt'], 
            id :"view", 
            domNodeType:'span', 
            css1:'display:inline;padding-left:8px'
        }
        ]
        ]                
        ];
    }
    ,
    // invoked when value changed
    redrawValue : function() {
        if (this.valueElt) {
            this.valueElt.domNode.checked=!!this.getValue();
        }
    }

});



//## UI [fieldset] component:
Object.entity.define({
    id:'fieldset'
    ,
    superType:'box'
    ,
    domNodeType:'fieldset'
    , 
    childrenAdapter : function(ch) {
        // add legend on top of children:
        return ( ch.unshift({
            id :"label:"+this.id+'_label', 
            domNodeType:'legend', 
            style:this.captionStyle, 
            caption:this.caption
        }), ch);
    }
});