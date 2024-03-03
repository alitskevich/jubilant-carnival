###
 Very common properties.
###

# property [liquid].
Object.emit
    uri: "axoid://define/Property/Liquid"
    methods : ->
        # value comparator
        comparator: -> false


# property [boolean].
Object.emit
    uri: "axoid://define/Property/Boolean"
    methods : ->
        # value comparator
        comparator: (a, b) -> (not a) is (not b) # compares as boolean
        # value setter
        setter: (T, v, ev) -> T[@id] = not not v


# property [number].
Object.emit
    uri: "axoid://define/Property/Uri"
    methods : ->
        # value comparator
        comparator: (a, b) -> (''+a) is (''+b)
        # value setter
        setter: (T, v, ev) -> T[@id] = Object.Uri.parse v

# property [number].
Object.emit
    uri: "axoid://define/Property/Number"
    methods : ->
        # value comparator
        comparator: (a, b) -> Number(a) is Number(b)
        # value setter
        setter: (T, v, ev) -> T[@id] = Number(v)

    mixin:  (_super, prop) ->
        r = {}
        propid = prop.id
        # increment value of this property
        r['increment'+String.capitalize(propid)] = (delta=1) ->
            @prop propid, ((@prop propid) or 0)+delta
        r

# property [date].
Object.emit
    uri: "axoid://define/Property/Date"
    methods : ->
        # value comparator
        comparator: (a, b) -> Date.compare(a, b) is 0


