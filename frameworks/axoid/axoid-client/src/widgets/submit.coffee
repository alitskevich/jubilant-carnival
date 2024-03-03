#-----------------------------------------------------------------------------
#
# Axoid UI: Submit and related
#
#-----------------------------------------------------------------------------

# The UI [submitSupport] Property.
Object.fire 

    uri: "axoid://define/Property/SubmitSupport"
    
    mixin: (_super) ->

        RE_TILDA = /~/g

        validateFields: ->
            ev = stack: []
            valid = true
            if @fields
                for f in @fields
                    ev0 = Object.entity.get(f).checkIfValid()
                    ev.stack.push.apply ev.stack, ev0.stack    if ev0.stack.length

                unless valid = not (ev.stack.length)
                    firstInput.domNode.focus() if firstInput = ev.stack[0].entity.valueElt
                    @error ev
            valid

        fieldsValues: ->
            r = {}
            Object.prop r, key.replace(RE_TILDA, "."), Object.entity.get(key).getValue() for key in @fields if @fields
            Object.prop r, key.replace(RE_TILDA, "."), window.document.getElementById(key).value for key in @inputs if @inputs
            r

        getFields: ->
            r = {}
            r[key] = Object.entity.get(key) for key in @fields if @fields
            r

        # creates onload handler for hidden iframe
        create_onload_handler: ->
            T = this
            (ev) ->
                return unless T.frameElt
                frame = T.frameElt.domNode
                doc = frame.contentDocument
                win = frame.contentWindow or doc.window or frame # f..ing IE8
                return if win.location.href is "about:blank"
                err = null
                value = Object.parse(doc.body.innerText or doc.body.textContent or doc.body.innerHTML)
                value = errors: [reason: "server_error"]    unless value
                err = stack: value.errors    if value.errors and value.errors.length
                T.onResult err, value

        onResult: (err, value) ->
            if err then @error err else @success value

        error: (err) -> Object.dom.handleError err, @

        success: (x) -> x


# [AsyncButton] UI component:
Object.fire 

    uri: "axoid://define/Button/AsyncButton"
    properties: ["support:SubmitSupport"]

    busyCaption: "in_progress"
    methods: (_super) ->
        createAsyncDoc: -> @fieldsValues()

        async: -> @validateFields() and @createAsyncEvent() #UI.hideAlert() &&

        createAsyncEvent: ->
            uri: @asyncUrl
            doc: @createAsyncDoc()
            callback: @createAsyncCallback()

        createAsyncCallback: -> @onResult

# UI [Form] component:
Object.fire 

    uri: "axoid://define/Box/Form"
    properties: ["disabled:Disabled", "support:SubmitSupport", "value:Values"]

    domNodeTag: "form"
    domNodeAttrs:
        onsubmit: -> false

    submit: ->
        @domNode.submit()

# UI [SubmitForm] component:
Object.fire 

    uri: "axoid://define/Form/SubmitForm"
    enctype: "application/x-www-form-urlencoded"
    method: "post"
    action: "#"
    methods: (_super) ->
        init: ->
            T = @
            id = @id
            @domNode = Object.dom.createComplexElement(String.format("<form enctype=\"{0}\" method=\"{1}\" target=\"{2}_target\" action=\"{3}\"></form>", @enctype, @method, @id, @action), @domNodeAttrs)    unless @domNode
            Object.dom.listenEvents @, "submit", ->
                T.validateFields()

            _super.init.call @
            @createChild
                id: id + "_target:View"
                onInited: -> T.frameElt = @
                domNode: Object.dom.createComplexElement("<iframe src=\"about:blank\" style=\"display:none;\" name=\"#{@id}_target\"></iframe>")
                , (err, e) ->
                    # IE8
                    e and Object.dom.listenEvents(e, "load", @create_onload_handler())
                    return

        childrenAdapter: (ch) ->
            [].concat ch

# UI [SubmitButton] component:
Object.fire 

    uri: "axoid://define/View/SubmitButton"
    methods: (_super) ->
        init: ->
            @domNode = Object.dom.createComplexElement("<input type=\"submit\"/>", value: String.localize(@caption) )
            _super.init.call @


# UI [FileUploader] field:
Object.fire 

    uri: "axoid://define/Field/FileContent"

    methods: (_super) ->

        childrenAdapter: (ch) ->

            _super.childrenAdapter.call T = @, [
                {
                    id: @id + "_input:View"
                    onInited: -> T.valueElt = @
                    domNode: Object.dom.createComplexElement(String.format("<input type=\"file\" class=\"{0}\" name=\"{1}\"/>", @valueStyle, @fileFieldName or @id),
                        onchange: @create_onchange_handler()
                    )
                }
            ].concat(ch)

        create_onchange_handler: ->
            (ev) =>
                for f in ev.target.files
                    reader = new FileReader()
                    reader.onload = (e) =>
                        @prop 'file', f
                        @prop 'value', e.target.result

                    reader.readAsBinaryString f
                    return


# UI [FileUploader] field:
Object.fire 

    uri: "axoid://define/Field/FileUploader"
    properties: ["attempt", "submitSupport:SubmitSupport"]

    methods: (_super) ->
        init: ->
            @domNode = Object.dom.createComplexElement(String.format("<form enctype=\"multipart/form-data\", method=\"post\" target=\"{0}_target\" action=\"{1}\"></form>", @id, @action), @domNodeAttrs) unless @domNode
            _super.init.call this
            Object.dom.listenEvents @frameElt, "load", @create_onload_handler()
            return

        childrenAdapter: (ch) ->
            T = @
            id = @id
            _super.childrenAdapter.call this, [
                {
                    id: id + "_input:View"
                    onInited: -> T.valueElt = @
                    domNode: Object.dom.createComplexElement(String.format("<input type=\"file\" class=\"{0}\" name=\"{1}\"/>", @valueStyle, @fileFieldName or id),
                        onchange: @create_onchange_handler()
                    )
                }
                {
                    id: id + "_link:View"
                    onInited: -> T.linkElt = @
                    domNodeTag: "a"
                    domNodeAttrs:
                        target: "_blank"
                }
                {
                    onInited: -> T.frameElt = @
                    id: id + "_target:View"
                    domNode: Object.dom.createComplexElement("<iframe src=\"about:blank\" style=\"display:none;\" name=\"#{@id}_target\"></iframe>",
                        onload: @create_onload_handler()
                    )
                }
            ].concat(ch)

        submit: ->
            @domNode.submit?()

        create_onchange_handler: ->
            (ev) ->
                true

        error: (ev) ->
            ev.alertEntity = @linkElt
            _super.error.call @, ev

        success: (ev) ->
            url = "" + (ev and ev.uri or "")
            if url
                a = @linkElt.domNode
                a.className = ""
                a.innerHTML = "link"
                @setValue a.href = "//" + url
            @prop "attempt", 1 + (@prop "attempt" or 0)