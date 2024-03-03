# property [value].
Object.emit
    uri: "axoid://define/Property/Value"
    mixin:  (_super) ->
        # get value
        getValue: -> @prop "value"
        # set value
        setValue: (v) -> @prop "value", v
        # check if value is empty
        isEmptyValue: (e) -> not @getValue()
        # check if value equals to
        equalsToValue: (v) -> v and (@getValue() is ("" + v))

# property [multiValue].
# It provides value multiset logic.
Object.emit
    uri: "axoid://define/Property/MultiValue"
    mixin:   (_super) ->
        valueChanged: (v) ->
            @prop "mvalue", (if v then ((if (v.split and v.length) then v.split(@mvalueSeparator or ",") else ["" + v])) else [])
            _super.valueChanged.apply this, arguments
            return

        getMultiValue: -> @mvalue or []

        equalsValue: (v) -> v and (("" + v) in @getMultiValue())

        putIntoMultiValue: (pk, v) ->
            return unless pk
            mv = @getMultiValue()
            pk = "" + pk
            contained = pk in mv
            changed = false
            v = (if contained then 0 else 1) if v is -1
            if (v) and not contained
                mv.push pk
                changed = true
            if (not v) and contained
                for pk, i in mv
                    if pk is mv[i]
                        mv.splice i, 1
                        changed = true
                        break
            changed and @setValue(mv.sort().join(@mvalueSeparator))
            
###
# Defines [Values] property that is a values bundle.
###
Object.emit 

    uri:"axoid://define/Property/Values"

    methods : ->
        # value comparator: 
        comparator: -> false
        
    # updates entity type assigned to
    mixin:  (_super, property) ->

        # property get/set
        prop: (key, value, opts) ->

            return null if @isDone

            isRegisteredProperty = @constructor.properties[if key[-3...] is 'Uri' then key[0..-4] else key]

            return (if isRegisteredProperty then _super.prop.call @, key else @value?[key]) if arguments.length is 1 # as getter

            if isRegisteredProperty
                
                _super.prop.call @, key, (if key is 'value' then Object.clone value else value), opts
                
            else
                
                @value = {} unless @value

                unless @value[key] is value

                    @value[key] = value
                    
                    @propertyChanged.call @, 
                        entity : @
                        propId : key
                        value : value
                        oldValue : @value[key]

        # property changed
        propertyChanged: (ev) ->

            _super.propertyChanged.call @, ev

            key = ev.propId

            return if key is 'valueUri'

            if key is 'value'
                olds = ev.oldValue
                if olds
                    for own p,v of olds when ev.value?[p] is undefined
                        _super.propertyChanged.call @, 
                            entity: @
                            propId : if p is 'value' then 'valueValue' else p
                            value : null
                            oldValue : v

                if ev.value
                    for own p,v of ev.value when v isnt olds?[p]
                        _super.propertyChanged.call @, 
                            entity: @
                            propId : if p is 'value' then 'valueValue' else p
                            value : v
                            oldValue : olds?[p]

            else
                unless isRegisteredProperty = @constructor.properties[if key[-3...] is 'Uri' then key[0..-4] else key]

                   _super.propertyChanged.call @, 
                        entity : @
                        propId : 'value'
                        value : @value
                        oldValue : @value

            ev
