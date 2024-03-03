
# current language
String.LANGUAGE = 'en'

String.localize = ((_cache) ->

    $ = (s, l=String.LANGUAGE) ->

        if s then _cache[l]?[s] or String.capitalize(String.camelize(s)) else ""

    $.get = (s, l=String.LANGUAGE) ->

        if s then _cache[l]?[s] or null else null

    $.add = (l, delta) ->

        ((delta = l) and (l = null)) if arguments.length is 1
        l=String.LANGUAGE unless l
        Object.update _cache[l] or (_cache[l] = {}), delta

    $.asEnum = (s, l)->

        return null unless r=@get(s,l)

        for k,v of r when id = +k or k
            if typeof v is 'object'
                v.id = id
                v
            else
                id:id, name: ''+v

    $
    
)({})

String.localize.add "en",
        "DOW":{'1': "Su",'2': "Mo",'3': "Tu",'4': "We",'5': "Th",'6': "Fr",'7': "Sa"}
        "MONTH_SHORT":{'01': "Jan",'02': "Feb",'03': "Mar",'04': "Apr",'05': "May",'06': "Jun",'07': "Jul",'08': "Aug",'09': "Sep",'10': "Oct",'11': "Nov",'12': "Dec"}
        "MONTH":{'01': "January",'02': "February",'03': "March",'04': "April",'05': "May",'06': "June",'07': "July",'08': "August",'09': "September",'10': "October",'11': "November",'12': "December"}


# EnumService
Object.emit

    uri:"axoid://define/L10nService/EnumService"

    methods: (_super) ->
        CACHE={}

        onEvent : (ev, u = ev.uri, key = u.host) ->
            
            return ev.callback null, r if r = CACHE[key]
            
            return ev.callback "not-found: enum [#{key}]" unless r = String.localize.asEnum key
            
            ev.callback null, CACHE[key] = r

# L10nService
Object.emit

    uri:"axoid://define/L10nService"

    properties: ["requires:Requires"]

    methods: (_super) ->

        onRequiredLoaded: (err)->
            
            return if err
            
            String.localize.add b for b in arguments when b

        onEvent : (ev) ->
            
            return ev.callback null, String.localize ev.uri.host
