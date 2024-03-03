//-----------------------------------------------------------------------------
//
// Axio UI: Submit and related
//
//-----------------------------------------------------------------------------

// The UI [submitSupport] Property.
Object.property.define('submitSupport', null
    ,
    function(_super) {
        var RE_TILDA = new RegExp('~','g');
        return {
            validateFields: function() {
                var ev = {
                    stack:[]
                }, valid = true;
                if (this.fields) {
                    for ( var i = 0; i < this.fields.length; i++)
                    {
                        var ev0 = Object.entity(this.fields[i]).checkIfValid(); 
                        if (ev0.stack.length){
                            ev.stack.push.apply(ev.stack,ev0.stack);
                        }
                    }                
                    if (!(valid = !(ev.stack.length))) {
                        var firstInput = ev.stack[0].entity.valueElt;
                        if (firstInput) {
                            firstInput.domNode.focus();
                        }
                        this.error(ev);
                    }
                }
                return valid;
            }
            ,
            fieldsValues: function() {
                var r = {}, i = 0, key;
                if (this.fields) {
                    for (i = 0; i < this.fields.length; i++)
                    {
                        key = this.fields[i];
                        Object.set(r,key.replace(RE_TILDA,'.'),Object.entity(key).getValue()); 
                    }                
                }
                if (this.inputs) {
                    for (i = 0; i < this.inputs.length; i++)
                    {
                        key = this.fields[i];
                        Object.set(r,key.replace(RE_TILDA,'.'),window.document.getElementById(key).value); 
                    }                
                }
                return r;
            }
            ,
            getFields: function() {
                var r = {};
                if (this.fields) {
                    for (var i = 0, key; i < this.fields.length; i++)
                    {
                        key = this.fields[i];
                        r[key] = Object.entity(key); 
                    }
                }
                return r;
            } 
            ,
            // creates onload handler for hidden iframe
            create_onload_handler : function() {
                var T=this;
                return function(ev) {
                    if (!T.frameElt) return;
                    var frame = T.frameElt.domNode;
                    var doc = frame.contentDocument
                    var win = frame.contentWindow || doc.window || frame;// f..ing IE8
                    if (win.location.href=='about:blank') return;

                    var err = null, value = Object.parse(doc.body.innerText || doc.body.textContent || doc.body.innerHTML);
                    if (!value) {
                        value = {
                            errors:[{
                                reason:'server_error'
                            }]
                        };
                    }
                    if (value.errors && value.errors.length) {
                        err = {
                            stack:value.errors
                        };
                    }
                    T.onResult(err, value);
                };
            }  
            ,
            onResult:  function(err, value) {
                if(err) {
                    this.error(err);
                } else {
                    this.success(value); 
                }
            }
            ,
            error: function(err){
                Object.dom.handleError(err, this);
            }
            ,
            success: Function.NONE
        }
    }
    );

//## [AsyncButton] UI component:
Object.entity.define(
{
    id:'AsyncButton',
    superType:'button'
    ,
    properties:[':submitSupport']
    ,
    busyCaption:'in_progress'
    ,
    createAsyncDoc: function() {
        var r = this.fieldsValues()
        return r;
    }
    ,
    async: function(){
        return   this.validateFields() && this.createAsyncEvent();//UI.hideAlert() &&
    }
    ,
    createAsyncEvent: function(){
        return {
            uri:this.asyncUrl,
            doc: this.createAsyncDoc(),
            callback: this.createAsyncCallback()
        }
    }
    ,
    createAsyncCallback: function(){
        return this.onResult;
    }
});
//## UI [Form] component:
Object.entity.define('Form extends box', {
    properties:[':disabled',':submitSupport']
    ,
    domNodeType:'form'
    ,
    domNodeAttrs:{
        onsubmit : function () {
            return false;
        }
    }
    ,
    submit : function() {
        this.domNode.submit();
    }
});


//## UI [SubmitForm] component:
Object.entity.define('SubmitForm extends Form', {
    enctype : "application/x-www-form-urlencoded"
    ,
    method:"post"
    ,
    action: "#"
    ,
    methods : function (_super) {
        return {
            init : function() {
                var T=this;
                var id = this.id;
                if (!this.domNode) {
                    this.domNode = Object.dom.createComplexElement(String.format('<form enctype="{0}" method="{1}" target="{2}_target" action="{3}"></form>',this.enctype, this.method, this.id, this.action), this.domNodeAttrs);
                }
                
                Object.dom.listenEvents(this, 'submit', function () {
                        return T.validateFields();
                });
                
                _super.init.call(this);
                
                this.createChild({
                    referrer:[T,'frameElt'], 
                    id:"view:"+id+'_target'
                    , 
                    domNode:Object.dom.createComplexElement('<iframe src="about:blank" style="display:none;" name="'+id+'_target"></iframe>')
                }, function(err, e){
                    // IE8
                    e && Object.dom.listenEvents(e, 'load', this.create_onload_handler());
                })
            }
            ,
            childrenAdapter : function(ch) {
                return [].concat(ch);
            }
        }
    }
});

//## UI [SubmitButton] component:
Object.entity.define('SubmitButton extends view', {
    methods : function (_super) {
        return {
            init : function() {
                this.domNode =  Object.dom.createComplexElement('<input type="submit"/>', {
                    value:String.localize(this.caption)
                });
                _super.init.apply(this, arguments);
            }                   
        };
    }
});

//## UI [FileUploader] field:
Object.entity.define('FileUploader extends field', {
    properties:['attempt',':submitSupport']
    ,
    attempt:0
    ,
    methods : function (_super) {
        return {
            init : function() {
                this.domNode = Object.dom.createComplexElement(String.format('<form enctype="multipart/form-data", method="post" target="{0}_target" action="{1}"></form>',this.id, this.action), this.domNodeAttrs);
                
                _super.init.call(this);
                
                Object.dom.listenEvents(this.frameElt, 'load', this.create_onload_handler());
            }
            ,
            childrenAdapter : function(ch) {
                var id = this.id;
                return _super.childrenAdapter.call(this,[
                    {
                        referrer:[this,'valueElt'], 
                        id:"view:"+id+'_input'
                        , 
                        domNode:Object.dom.createComplexElement(String.format('<input type="file" class="{0}" name="{1}"/>', this.valueStyle, this.fileFieldName||id), {
                            onchange : this.create_onchange_handler()
                        })
                    }
                    ,
                    {
                        referrer:[this, 'linkElt'], 
                        id:"view:"+id+'_link', 
                        domNodeType:"a", 
                        domNodeAttrs:{
                            target : '_blank'
                        }
                    }
                    ,
                    {
                        referrer:[this,'frameElt'], 
                        id:"view:"+id+'_target'
                        , 
                        domNode:Object.dom.createComplexElement('<iframe src="about:blank" style="display:none;" name="'+id+'_target"></iframe>', {
                            onload : this.create_onload_handler()
                        })
                    }
                
                    ].concat(ch)
                    );
            }
            ,
            submit : function() {
                T.domNode.submit();
            }
            ,
            create_onchange_handler : function() {
                return function(ev) {
                    return true;
                };
            }
            ,
            error: function(ev){
                ev.alertEntity = this.linkElt;
                _super.error.call(this,ev);
            }
            ,
            success: function(ev){
                var url = ''+(ev && ev.uri || '');
                if (url) {
                    var a = this.linkElt.domNode;
                    a.className  = '';
                    a.innerHTML = 'link';
                    this.setValue(a.href = '//'+url);
                }
                this.incrementProperty('attempt',1);        
            }
                        
        };
    }

});

