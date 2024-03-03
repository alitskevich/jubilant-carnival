###
Basic Dom UI properties.
###

# @property domNode of view
Object.emit 

    uri: "axoid://define/Property/Node"
    
    methods: ->

        # first value init
        init: (T, defs) ->

            # create if none
            throw new Error ("domNode is not specified for [#{T}]") unless (node = defs.domNode)

            # children appended to
            T.domNode = T.contentNode = node

            # back reference
            node.entity = T

            #node.disabled = 'yes' if !(@disabled = !(defs.disabled or defs.disabledExpression))
            #styling here
            node.style.cssText += T.css if T.css
            Object.property.bind T, 'style', defs.styleExpression if defs.styleExpression
            T.domNodeClass "#{defs.style or ''} #{node.className or ''} #{if node.disabled then 'disabled' else ''}"

            #pre- hide for expressions
            node.style.display = 'none' if defs.hidden or defs.hiddenExpression

            Object.dom.listenTapped T if T.tapped

            T.propertyChanged 
                entity : T
                propId : 'domNode'
                value : node

        # done property with entity instance
        done: (T)->
            if e = T.domNode
                Object.dom.removeElement e
                e.entity = null
                T.domNode = T.contentNode = null


# @property The [style] property of view
# related entity attributes:
# @attr css - custom DOM node style
Object.emit 

    uri: "axoid://define/Property/Style"
    
    methods:  ->

        # @init
        init: (T, defs) ->
        # moved into domNode.init() for sake of performance

        #@get value getter.
        getter: (T) -> T.domNode.className

        #@setter value
        setter: (T, v, ev) ->
            if typeof v is "string" then T.domNodeClass v else T.domNodeStyle v

    mixin: (_super) ->

        # Sets UI style attributes
        domNodeStyle: (delta) ->
            return st unless (st = @domNode.style) and delta
            st[n] = v for n, v of delta when st[n] isnt v
            st

        # Updates UI style class
        domNodeClass: (delta) -> Object.dom.updateClass @domNode, delta

        # Sets/Unsets UI style class
        toggleDomNodeClass: (cl, flag) -> Object.dom.updateClass @domNode, ((if flag then cl else ("!" + cl)))


# @property The [hidden] property of view
# related entity attributes:
# @attr displayType - type of display: 'inline', 'block', 'inline-block'
Object.emit 

    uri: "axoid://define/Property/Hidden"
    
    methods:  ->
        
        getter: (T) -> T.domNode.style.display is "none"
        
        setter: (T, v) ->
            #T.toggleDomNodeClass 'hidden', v
            T.domNode.style.display = (if v then "none" else (@displayType or ""))

    mixin:  (_super) ->

        # Sets an Element "display" flag.
        display: (f, bForceParents) ->
            @setHidden not f
            if f and bForceParents and (p = @)
                p.display f while (p = p.parentView)
            @

        # switches an Element "display" flag.
        switchDisplay: -> @setHidden not @isHidden()

        #  is hidden
        isHidden: () -> @prop "hidden"

        # sets an Element "display" flag.
        setHidden: (f) -> @prop "hidden", f

# @define The [caption] property.
Object.emit 

    uri: "axoid://define/Property/Caption"
    
    methods: ->

        # setter
        setter: (T, v='', ev) ->
            
            T[@id] = v
            e = T.getCaptionElt()
            hidden = (v is "none")
            
            if e
                e.display not (e.hidden or hidden)
                v = T.getCaptionHtml(v, ev)
                try
                    e.domNode.innerHTML = (if (hidden or not v) then "" else v)
                catch ex
                    T.error(ex, "Caption")

        # value comparator
        comparator: -> false

    # patches entity type attached to
    mixin: (_super) ->
        
        getCaptionElt:  -> if @isDone then null else @captionElt or @

        getCaptionHtml: (v, ev) ->  ((if (icon = @prop 'icon') then '<i class="icon-#{icon}"></i> ' else "")) + String.localize(v, ev.quantity)


# @define The [html] property.
Object.emit 

    uri: "axoid://define/Property/Html"
    
    methods:(_super) ->

        # Sets property value asyncly.
        setValueAsync: (T, ev, asyncUrl) ->
            
            @setter T, (T.asyncPlaceholder or null), ev
            _super.setAsyncValue.call this, T, ev, asyncUrl

        getter: (T) -> T.contentNode?.innerHTML

        # setter
        setter: (T, v="<div>&nbsp;</div>") ->
            
            try
                throw v.error if v?.error
                T.contentNode.innerHTML = v
            catch ex
                msg = String.localize("html_error")+": " + ex.message
                T.contentNode.innerHTML = "<div style='color:red;'>#{msg}</div>"

# @define UI [disabled] Property
Object.emit 

    uri: "axoid://define/Property/Disabled"
    
    methods: ->

        # setter
        setter: (T, v) -> T[@id] = !!v # narrow to boolean

        # value comparator
        comparator: (a, b) -> !a is !b # compares as boolean

    # patches entity type attached to
    mixin:(_super) ->

        init: ->
            _super.init.call @

            # make alive
            Object.dom.alive @

        disabledChanged: (v) ->
            @domNode.disabled = (if v then "disabled" else "")
            @toggleDomNodeClass "disabled", v


# @property UI [children] property
# Used by [box] entity and its descendants.
# @attr childrenAsyncAdapter - adapt result of async fetching
# @attr childrenAdapter - adapt meta data before set
Object.emit 

    uri: "axoid://define/Property/Children"
    
    methods: (_super) ->

        _child = (e, cb) ->
            
            #ensure domNode
            unless e.domNode
            
                attrs = {}
                attrs.id = e.id if e.id
                node =  Object.dom.createElement(e.domNodeTag, Object.update(attrs, e.domNodeAttrs))
                e.domNode = node
                
            unless e.domNode.parentNode
                @contentNode.appendChild e.domNode

            Object.emit Object.update {type: "Box", uri:'axoid://create', callback: cb}, e

        createAsyncValueCallback: (T) ->
            (err, value) =>
                unless T._done
                    T.domNodeClass "!ui-busy"
                    T.prop @id, T.childrenAsyncAdapter(err, value)

        # Sets property value from async url.
        setValueForUri: (T, uri) ->
            T.domNodeClass "ui-busy"
            Object.emit 
                uri:uri
                callback: @createAsyncValueCallback(T) 

        # sets value
        setValue: (T, ch0, opts) ->

            ev = Object.update(value:ch0, opts)

            Function.perform T, (flow)->
                [
                    ->

                        meta = @childrenAdapter(ev.value, ev)

                        # removes all currently added
                        @removeAllChildren() unless ev.noReset

                        #T.trace('set children',v);
                        ch = @getChildren()

                        _add = (e) =>
                            pos = ch.length
                            ch.push(null)
                            cb = flow.wait()
                            _child.call @, e, (err, e) ->
                                    ch[pos] = e
                                    cb(err, e)

                        _add.call @, e for e in meta when e if meta

                        flow.next()

                    # callback into entity if exists
                    ->
                        v = (e for e, i in arguments when i>1)
                        @childrenChanged(v, value:v)
                ]

            @setValueForUri T, ev.uri if ev.uri

        done: (T) ->

            # cascade done
            T.removeAllChildren()
            
            _super.done.call @, T

    # @patch entity type
    mixin: (_super) ->

        # Creates a new child.
        createChild: (e, cb) ->
            
            _child.call @, e, (err, e) =>
                
                ch = @getChildren()
                ch.push e
                @childrenChanged?(ch, value: ch)
                cb?(err, e)

        # adapt meta
        childrenAdapter: (x) -> x

        # adapt meta
        childrenChanged: (v, ev) -> ev

        # gets list of children
        getChildren: -> @_children or (@_children = [])

        # invokes done() for each and then removes all children
        removeAllChildren: ->
            
            e.done() for e in @_children when e if @_children
            @_children = []

        # creates a set of children by given {#meta}
        setChildren: (meta, opts) -> @prop "children", meta, opts

        # @adopt async value.
        childrenAsyncAdapter: (err, value) ->
            if err then id: "Html", html: String.localize(err.reason or "unknown_error") else value

###
Basic Dom UI views.
###

# entity UI [view] entity type.
# This is root entity type for all other types of UI views.
# It just attaches three core UI properties: [domNode], [style] and [hidden].
Object.emit 

    uri: "axoid://define/View"
    
    properties: ["domNode:Node","style:Style","hidden:Hidden"]

# @define UI html view.
Object.emit 

    uri: "axoid://define/View/Html"
    
    properties: ["html:Html"]

# @define UI label view.
Object.emit 

    uri: "axoid://define/View/Label"
    
    properties: ["caption:Caption"]
    
    domNodeTag: "span"
    
# entity UI [box] entity type.
# Simplest UI container.
# It just extend  [view] entity type with [children] property.
Object.emit 

    uri: "axoid://define/View/Box"
    
    properties: ["children:Children"]
