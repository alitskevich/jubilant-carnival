# @define UI Widget view.
Object.emit 

    uri: "axoid://define/Html/Widget"
    
    properties: ["data","template"]
    
    methods: (_super) ->

        _doneSubs = ->
            
            s.done() for s in @_subs if @_subs
            @_subs = []

        done: ->
            
            _doneSubs.call @
            
            _super.done.call @

        htmlChanged: ->
            
            _doneSubs.call @
            
            for node in @domNode.querySelectorAll "[data-widget]"
                
                Object.dom.initWidget {
                    domNode : node
                    callback : (err, obj) =>
                        return @handleSubError err, meta if err
                        @_subs.push obj
                }

        templateChanged: (v) -> @redraw()

        dataChanged: (v) -> @redraw()

        redraw: () ->  
            
            if (tmpl= @prop 'template') and (ctx = @prop 'data')
                
                @prop 'html', @compileHtml(tmpl, ctx)

        compileHtml: (tmpl, ctx) -> String.template(tmpl, ctx)
        
        handleSubError: (err, meta) ->
            
            Object.error(err "wrong_widget", meta).log()
            
            Object.emit
                uri: "axoid://create/Html"
                domNode: meta.domNode
                style: "alert-error"
                html: "Error: " + (err.message or ("can't create UI view: " + meta.id))
