String.tokenize= (s='', re = /\W/g, op)->

    pastLastIndex = 0
    while e = re.exec(s)
        #interval text
        op text if e.index and (text = s[pastLastIndex..e.index-1])
        op e[0], true
        pastLastIndex = re.lastIndex

    #rest
    op text if (text = s[pastLastIndex..])

# returns string formatted by template and key/value map used for placeholder substitution.
String.template = (->

    parse =  (s, x)->

        r = {tag:'top', children:[]}
        stack = []
        lastIndex = 0
        RE = ///{{
                  #slash
                  ([?\/:#]?)
                  #tag
                  ([a-zA-Z0-9\._]+)
                  #filter
                  (\|[a-z]+)?
                  }}
            ///g

        while e = RE.exec(s)

            #interval text
            r.children.push tag:'_', value:text if e.index and (text = s[lastIndex..e.index-1])
            tag = e[2]

            #result
            if (e[1] is '?') or (e[1] is '#')
                stack.unshift r
                r.children.push r0 = tag:tag, children:[], flag: e[1]
                r=r0
            else if e[1] is '/'
                r = stack.shift()
            else if e[1] is ':'
                r = r['_'+tag] = children:[]
            else
                r.children.push tag:tag, opts:e[3]

            lastIndex = RE.lastIndex

        r.children.push tag:'_', value:s if s = s[lastIndex..]

        return r

    fn = (node, obj)->
        r = []

        if node.children
          for n in node.children

            if (tag = n.tag) is '_'
                r.push n.value
            else
                if (v = if tag is '.' then obj else Object.prop(obj,tag))

                    if Array.isArray(v)
                        if v.length
                            if n.flag is '?'
                                r.push fn n, obj
                            else
                                (r.push fn n, e) for e in v when e
                        else
                            (r.push fn n._else, if n.flag is '?' then obj else v) if n._else

                    else
                        r.push fn n, if n.flag is '?' then obj else v

                else
                    if n.flag is '#'
                        (r.push fn n, {id:k0, value:v0}) for k0,v0 in v when v0 if v
                    else
                        (r.push fn n._else, if n.flag is '?' then obj else v) if n._else

        else
            r.push $.writeValue obj, r, node.opts

        r.join('')

    $ = (s,obj)-> fn parse(s), obj

    $.filters={
        t: (t) -> String.localize t
        d: (d) -> Date.format(d)
    }

    encoder= (i)-> '&#'+i.charCodeAt(0)+';'

    $.writeValue= (obj, r, opts) ->
        obj = fn0(obj) for f in opts when fn0 = @filters[f] if opts
        r = (''+obj)
        r = r.replace /[\u00A0-\u9999<>\&]/g, encoder unless opts and opts.indexOf('u')
        r
    $
)()