Web client APIs.
==========

There is as set of web client APIs that includes: 

+ Remote Channels: XHR, SCRIPT, JSONP
+ HTML5 APIs related components: WebStorage, WebSQL.

***
DOM model API
-------------

> This API wraps DOM model allowing low-level access to basic functionality needed.

#### Object.dom.createElement(type, attrs)
        
> Creates a new DOM Element.
> Mostly used inside [domNode] property of [view] entity.
        
    var elt = Object.dom.createElement("DIV", {someAttr:'someValue'});

#### Object.dom.init(root, options)
        
> Creates Entities from given DOM tree.

    <div id="code2" data-widget="Input" data-caption="enter_code"  data-value="123"></div>
    ...
    <script>Object.dom.init()</script>
    
***
Remote API
----------


#### XHR Channel for [http], [https] scheme

> Performs XHR request.

    Object.notify({
        uri : 'script://somepath/somefile.js'
        ,
        dataType: 'json'
        ,
        callback: function(err, result) {...}
    });


#### Script Channel for [script], [jsonp] scheme

> Performs script resource loading.

    Object.notify('script://somepath/somefile.js');
    
***
HTML5 APIs related components
----------

#### WebStorage

> Wraps localStorage/sessionStorage API allowing use it as reqular Axio entity


#### WebSQL

> Wraps WebSQL API allowing use it as reqular Axio entity. 