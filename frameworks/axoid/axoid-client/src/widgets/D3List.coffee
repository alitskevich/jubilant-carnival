
###
UI D3 List view.
###
Object.fire 

    uri: "axoid://define/List/D3List"
    
    properties: ["delta"]

    methods: (_super) ->
        _reg = (data, key, r={}) ->
            r[val] = e for e in data when val = e[key] if data
            r

        dataChanged: (data, ev) ->
            unless data
                @prop 'dataCount', if ev.error then -2 else -1
                return

            @dataRegistry = _reg data, @dataIdKey
            @childrenRegistry = {}
            @setChildren data, noReset: true
            @prop "value", null if (val = @getValue()) and not @dataRegistry[val]

        deltaChanged: (delta) ->
            @dataRegistry = Object.update(@dataRegistry or {}, _reg delta, @dataIdKey)
            @childrenRegistry = {} unless @childrenRegistry
            @setChildren delta, noReset: true

        childrenAdapter: (data) ->
            r=[]
            #remove obsolete items
            ch = @_children
            @_children = []
            counter = 0
            if ch
                for e in ch when id = e.value
                    if @dataRegistry[id]
                        @_children.push e
                        @childrenRegistry[id] = e
                        counter++
                    else
                        e.done()

            #update or insert
            if data
                for datum, i in data
                    throw new Error 'Empty datum id in list data' unless id = datum[@dataIdKey]
                    if existing = @childrenRegistry[id]
                        lastNode = existing.domNode
                        @updateChild(existing, datum)
                    else
                        counter++
                        
                        meta = @childrenItemAdapter datum, i
                        
                        #create domNode
                        attrs = {}
                        attrs.id = meta.id if meta.id
                        node =  Object.dom.createElement(meta.domNodeTag, Object.update(attrs, meta.domNodeAttrs))
                        @contentNode.insertBefore(node, lastNode?.nextSibling)
                        meta.domNode = node
                        
                        r.push meta

            @prop 'dataCount', counter
            r

        updateChild: (e, d) -> e.prop 'data', d, force:true
