# logs its arguments. Uses console.log() by default.
Object.LOG_LEVEL = 1

Object.log = ((c={log:->}) ->


    # IE8
    unless c.log.apply
        c._log = c.log
        c.log = ->
            c._log (s for s in arguments).join(", ")

    unless c.error
        c.error = ->
            c.log ['ERROR: '].concat(s for s in arguments)...

    r = (x) ->
        return x unless Object.LOG_LEVEL>4

        if x?.printIntoLog
            x.printIntoLog c
        else
            c.log (e for e in arguments)...
        x

    r.error = r
    
    r
    
)(window.console)


#   @method #Object.error(err, details).
#   @return [Err] object
Object.error = (->

    class Err

        constructor:  (e) ->
            @details = []

            if typeof e is 'string'
                @reason = e.split(':')[0] if e
                @message = e if e
            else
                @reason = e.reason if e.reason
                @message = e.message if e.message

        reason: 'unknown'
        message: ''
        isError: true

        addDetails: () ->
            for det in arguments when det
                @details.unshift(det)
                @stack = det.stack if det.stack
            @

        addPrefix: (p)->
            @prefix = ''+p if p
            @
            
        # logs this
        log: ()->
            Object.log (@)
            @

        end: (x) -> x

        toString: ->
            "#{@prefix or ''} #{@message}"

        printIntoLog: (c) ->
            details = if @details?length is 1 then @details[0] else @details
            stack = @stack or (new Error).stack
            c.error @toString(), details, stack

    (err, details) ->
        (if err?.isError then err else new Err(err)).addDetails(details)

)()

###
Axio: Web DOM API.
###
Object.dom = ((_win) ->

    _doc = _win.document

    _createEvent = (evt) ->
        r = {}
        e = undefined
        if _win.event
            r.internal = _win.event
            r.target = e = _win.event.srcElement
        else
            r.internal = evt
            e = evt.target
            e = e.parentNode while e and e.nodeType isnt 1
            r.target = e
        e = e.parentNode while e and not e.entity
        r.entity = e and e.entity
        r

    _ALIVE_EVENTS_KEYS = [
        "mousedown"
        "mouseup"
        "click"
        "mousemove"
        "mouseover"
        "mouseout"
    ]
    
    _ALIVE_HANDLER = (ev0) ->
        T = this
        unless T.disabled
            ev = _createEvent(ev0)
            type = ev.internal.type
            switch type
              when "mousedown"
                    T.updateClass T.stylePressed if T.stylePressed

                    #_lastTouchedEntity=evt.entity;
                    T.touchBegin and T.touchBegin(ev)
              when "mouseup"
                    T.touchEnd and T.touchEnd(ev)
                    T.updateClass "!" + T.stylePressed if T.stylePressed
              when "click"
                    T.tapped and T.tapped(ev)
              when "mousemove"
                    T.mouseMove and T.mouseMove(ev)
              when "mouseover"
                    T.updateClass T.styleHovered if T.styleHovered
                    T.mouseOver and T.mouseOver(ev)
              when "mouseout"
                    T.mouseOut and T.mouseOut(ev)
                    T.updateClass "!" + T.styleHovered if T.styleHovered
        true

    #creates UI event
    document: _win.document
    
    createEvent: _createEvent

    # common styles
    STYLE_LINE_FIXED : "overflow:hidden;white-space:nowrap;cursor:pointer;"
    STYLE_TEXTLINE : "white-space:nowrap;line-height:1.5em;vertical-align:middle;"

    # creates a new DOM Element
    createElement: (type="DIV", attrs) ->
        
        Object.update _doc.createElement(type), attrs

    createComplexElement: (tag, attrs) ->

        # hack for type set on IE8
        div = @DOM_FACTORY or (@DOM_FACTORY = _doc.createElement("div"))
        div.innerHTML = tag
        r = div.firstChild
        div.removeChild r
        Object.update r, attrs

    appendToHead: (el) ->
        
        fjs = _doc.getElementsByTagName("head")[0]
        fjs.appendChild el

    appendCss: (href) -> @appendToHead @createElement "link", rel: "stylesheet", href: href

    # finds a DOM Element from parent
    getElementById: (id) -> _doc.getElementById(id) or null

    # removes a DOM Element from parent
    removeElement: (e) -> e?.parentNode?.removeChild e

    # makes entity view alive
    alive: (T) ->
        @listenEvents T, _ALIVE_EVENTS_KEYS, (ev0) ->
            _ALIVE_HANDLER.call T, ev0
            
    # makes entity view alive
    listenTapped: (T) ->
        @listenEvents T, ['click'], (ev0) ->
            _ALIVE_HANDLER.call T, ev0

    # bind handler for entity DOM event
    listenEvents: (T, key, fn, fl) ->
        
        node = (if T then T.domNode else _doc)
        keys = (if key.split then key.split(" ") else key)
        
        for key in keys
            if node.addEventListener
                node.addEventListener key, fn, fl #, false
            else
                node.attachEvent "on" + key, fn, fl
        node

    # stops event bubbling
    stopEvent: (e) ->
        
        if e = e?.internal or e
            e.stopPropagation?()
            e.cancelBubble = true
            e.returnValue = false
        false

    # returns size of client viewport
    isKeyboardCode: (ev = _win.event or {}, code) -> ev.keyCode is code or ev.charCode is code or ev.which is code

    KEY_CODE:
        ESCAPE: 27
        ENTER: 13
        TAB: 8

    # returns size of client viewport
    viewportSize: ->
        
        scr = _win.screen
        width: scr.availWidth
        height: scr.availHeight

    # returns total offset of element
    getTotalOffset: (p) ->
        
        r =
            top: 0
            left: 0
            width: p.clientWidth
            height: p.clientHeight

        while p
            r.top += p.offsetTop - p.scrollTop
            r.left += p.offsetLeft - p.scrollLeft
            p = p.offsetParent
        r

    getDataset: (v)->
        
        return ds if ds = v.dataset
        
        #polyfill
        ds = {}
        (ds[String.camelize n[5..], '-'] = v.getAttribute(n)) for attr in v.attributes when (n = attr.name)[0..4] is 'data-'
        ds

    # UI error handler
    handleError: (err) -> Object.error(err).log()

    # sets/remove class for elt.
    # Classes to remove have to be prefixed with '!' sign.
    updateClass: (elt, delta) ->
        
        return elt unless elt and delta

        clss = elt.className.split(" ")
        delta = delta.split(" ")

        for cl in delta when cl
            if cl[0] is "!"
                if cl is "!*"
                    clss = []
                else
                    clss[p] = "" if (p = clss.indexOf(cl[1..]))>-1
            else
                clss.push cl unless cl in clss
        elt.className = (cl for cl in clss when cl).join(' ')
        elt

    initWidget : (->

        (meta) ->
            
            elt = meta.domNode

            meta[n] = z for n,z of Object.dom.getDataset elt

            [id,type] = meta["widget"].split(':')
            
            unless type
                type= id
                id = null
                
            id = id_ if id_ = elt.getAttribute("id")
            
            meta.uri = "axoid://create/#{type}##{id or ''}"

            Object.fire meta

    )()
    
) if typeof window is 'object' then window else @
