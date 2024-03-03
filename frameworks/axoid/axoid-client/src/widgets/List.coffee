###
UI List view.
###
Object.fire 

    uri: "axoid://define/View/List"

    properties: ["children:Children", 'itemTemplate', "data", "selection", "value:Value"]

    style: 'list-group'
    domNodeTag: 'ul'
    itemType: 'Widget'
    itemStyle: 'list-group-item'
    itemTemplate: '<a href="#" onclick="return false;">{{name}}</a>'
    dataIdKey: 'id'
    itemDomNodeTag: 'li'
    asyncDataPropertyName: null
    itemActiveStyle: 'active'

    methods: (_super) ->

        _reg = (data, key, r={}) ->
            #throw new Error 'Empty datum id in list data' unless id = datum[@dataIdKey]
            r[val] = e for e in data when val = e[key] if data
            r

        valueChanged: (value) ->
            @prop 'datum', @dataRegistry?[value]
            @syncSelection()

        itemTemplateChanged: (template) ->
            ch.prop 'template', template for key, ch of @childrenRegistry if template

        childrenChanged: () ->
            @childrenRegistry=_reg @getChildren(), 'value'
            @syncSelection()

        dataChanged: (data, ev) ->
            if data
                @prop 'dataCount', data.length
            else
                @prop 'dataCount', if ev.error then -2 else -1
                data = []

            @dataRegistry = _reg data, @dataIdKey
            @childrenRegistry = {}
            @setChildren data
            @prop "value", null if @dataCount>=0 and (val = @getValue()) and not @dataRegistry[val]

        syncSelection: ->
            @prop "selection", @childrenRegistry?[@getValue()]

        selectionChanged: (sel, ev) ->
            ev.oldValue?.domNodeClass '!'+@itemActiveStyle
            sel?.domNodeClass @itemActiveStyle

        childrenAdapter: (data) ->
            return [] unless data
            @childrenItemAdapter datum, i for datum, i in data

        childrenItemAdapter: (d, i, nextNode) ->
            type: @itemType
            domNodeTag: @itemDomNodeTag
            style: @itemStyle
            template: @itemTemplate
            value: d[@dataIdKey]
            data: d

        tapped: (ev) ->
            w = ev.entity
            while w and (w isnt @)
                if (v = w.value) and  @childrenRegistry?[v]
                    @setValue v
                    break
                w = w.parentView
            w
