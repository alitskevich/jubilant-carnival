Object.fire 

    uri: 'axoid://define/webclient.Application'

    properties : ['title', "plugins:Plugins"]
    
    doc: window.document
    
    domNode : window.document.body
    
    methods : (_super) ->

        init: ->

            _super.init.call @

            # Creates Entities from DOM tree.
            Object.dom.initWidget domNode : node for node in @domNode.querySelectorAll "[data-widget]"

        titleChanged: (v)-> @doc.title = v
