Object.fire 

    uri: "axoid://define/webclient.HashNavigator"

    properties : ["value:Values"]

    methods : (_super) ->
        _loc = window.location
        _toValue = (h)->
            h ='#!' if not h or h is '#'
            v =  {page:''}
            if h[1] is '!'
                hashes = h[2..].split '/'
                v.page = hashes[0]
                v["index#{i-1 or ''}"] = (e or "") for e, i in hashes when i>0
            v

        # Creates Entities from given DOM tree.
        init: ->
            @value = _toValue _loc.hash

            _super.init.call @

            window.onhashchange = => @prop 'value', _toValue _loc.hash

        valueChanged: (v)->
            return unless v
            h = []
            e = v.page
            i=0
            while e
                h.push e
                e = v["index#{i or ''}"]
                i++
            _loc.hash = h unless (h = "#!"+(h.join '/')) is _loc.hash
