# UI dropdown field:
Object.fire 

    uri: "axoid://define/Input/Dropdown"
    properties: ["data"]
    dataIdKey:'id'
    methods: (_super) ->
        _newOption = (id, name=''+id, isv=false) ->
            new Option(name, id, isv, isv)

        getInputChildrenMeta: (ch) ->
            T = @
            [
                {
                    id: @id + "_input:View"
                    onInited: -> T.valueElt = @
                    domNodeTag: "select"
                    style: @valueStyle
                    domNodeAttrs:
                        onchange: @create_onchange_handler()
                }
            ]

        tapped: (ev) ->
            @valueElt?.domNode.focus()

        create_onchange_handler: ->
            T = this
            (ev) ->
                T.doneEditor if @selectedIndex then T.data[@selectedIndex-1][T.dataIdKey] else ''
                true

        dataChanged: (data, ev) ->
            _super.dataChanged.call @, data, ev
            options = @valueElt.domNode.options
            #reset all
            options.length = 0

            if data is null
                options[0] = _newOption '', 'Loading...'
            else
                options[0] = _newOption '', '', not @value
                for d,i in data when id = d[@dataIdKey]
                    isv = id is @value
                    @valueElt.domNode.options[i+1] = _newOption id, d.name, isv
                    @prop 'datum', d if isv
            ev

        redrawValue: ->
            if @data
                for d, i in @data when (id = d[@dataIdKey]) is @value
                    @prop 'datum', d
                    @valueElt.domNode.selectedIndex = i+1
                    return
            @valueElt.domNode.selectedIndex = 0
