Very basic usage
================

1\. Refer to axio.js:

    <script src="http://alitskevich.github.com/axiojs/js/libs/axio.js"></script>


2\. Define entity types (and may be [property types](#!docs-entity-property_define) you need):

    //## The [MyWidget] UI Entity extends [BaseWidget].
    Object.entity.define('MyWidget extends BaseWidget', {
    
        // define properties:
        properties: ['MyPropType:myProperty','greeting', 'data', 'extra']
        , 
        myProperty: 'hi' //specify initial value 
        ,
        // factory returning methods (it allows to override super methods if any)
        methods : function (_super) {
        
            return {
            
                init : function(){

                    _super.init.call(this);
                    ...
                }
                ,
                // hook on [greeting] property value changed
                greetingChanged: function(event, value) {
                    ...
                }
                ,
                // handle all events with key matched to its 'id'
                handleEvent: function(ev){
                
                    // does something async and invokes callback 
                    ev.callback(error, result);
                
                }
            }
        }
    }

3\. Create Entity instances:

    Object.entity.create({
        // required type and optional id
        id: 'MyWidget:cool1'
        , 
        // initial state
        myProperty: '123' //instant initial value for [myProperty] property
        , 
        // async load [data] property value from Source [data] specified by URL scheme
        dataUrl: 'data://some/path?or=param' 
        , 
        // bind [greeting] with expression 
        greetingExpression: '"Hello, "+${user.name}+this.postfix' 
        ,
        //... and even bind url to property value source!
        extraUrlExpression: '"http://host.com/extras/"+${application.pageId}+".json"'    
    });
    
3a\. or from DOM model:

    <div id="code2" data-widget="Input" data-caption="enter_code"  data-value="123"></div>
    ...
    <script>Object.dom.init()</script>
 