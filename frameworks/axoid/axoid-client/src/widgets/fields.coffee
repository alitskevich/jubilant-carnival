#-----------------------------------------------------------------------------
#
# Axoid UI: Fields and related
#
#-----------------------------------------------------------------------------

###
UI field ancestor.
###
Object.fire 

    uri: "axoid://define/Box/Field"
    properties: ["caption:Caption","value:Value","disabled:Disabled",'hint']
    children: []
    caption: ""
    style: "form-group"
    valueBoxStyle: "form-input-container"
    valueStyle: "form-control"
    captionStyle: "control-label"
    methods: (_super) ->
        init: ->
            # normalize caption obtained from id with '.'
            @caption = @caption or @id?.split(".")[-1]
            _super.init.call this

        childrenAdapter: (ch) ->
            T = @
            unless ch?.length
                ch = [
                    {
                        type:  "View"
                        onInited: -> T.valueElt = @
                        style: @valueStyle
                        tapped: (ev) -> T.doFocus ev
                    }
                ]

            [
                {
                    type: "Label"
                    onInited: -> T.captionElt = @
                    domNode: Object.dom.createComplexElement(String.format("<label class=\"{0}\" for=\"{1}_input\"/>", @captionStyle, @id))
                }
                {
                    type: "Box"
                    style: @valueBoxStyle
                    children: ch
                }
            ]

        launchEditor: ->

        doFocus: (ev) ->
            @launchEditor ev

        isEditable: ->
            not @readOnly

        valueChanged: () ->
            @redrawValue()

        # invoked when value changed
        redrawValue: ->
            @valueElt.domNode.innerHTML = @getCValue() if @valueElt
            @domNodeClass "!error"

        doneEditor: (value) ->
            
            return if value is @getValue()

            @setValue value

        # @add validation rule to be checked from this.checkIfValid()
        addValidationRule: (rule) ->
            @rules = (@rules or []).concat(rule)
            return

        # @check if field has some errors
        # @param err - error object like {stack:[{reason,message}]}
        checkIfValid: ->
            err = stack: []
            if @isValueRequired() and @isEmptyValue()
                err.stack.push
                    reason: "empty_required_field"
                    message: String.localize("empty_required_field", String.localize(@caption or @id))

            rule.call @, err for rule in @rules if rules
            valid = not (err.stack.length)
            e.entity = @ for e in err.stack unless valid
            @toggleDomNodeClass "error", not valid
            err

        isValueRequired: -> @valueRequired

        getCValue: -> @getValue()

        getCaptionHtml: (v, ev) -> String.localize(v or @id) + ((if @valueRequired then " <span class=\"required\">*</span>" else ""))

        disabledChanged: (v) ->
            _super.disabledChanged.apply @, arguments
            Object.prop @, "valueElt.domNode.disabled", v

        hintChanged: (v) ->
           @hintElt?.prop 'caption', v


# UI Text input field base:
Object.fire 

    uri: "axoid://define/Field/Input"
    alive: true
    maxLength: 128
    inputTag: "input"
    inputType: "text"
    methods: (_super) ->
        childrenAdapter: (ch) ->
            ch = @getInputChildrenMeta()
            _super.childrenAdapter.call this, ch

        getInputChildrenMeta: (ch) ->
            T = @
            [
                {
                    id: @id + "_input:View"
                    domNode: @create_inputNode()
                    style: @valueStyle
                    onInited: -> T.valueElt = @

                }
            ]

        create_inputNode: ->
            _done = @create_onblur_handler()
            Object.dom.createComplexElement String.format("<{0} type=\"{1}\" name=\"{2}\" maxLength=\"{3}\"/>", @inputTag, @inputType, @id, @maxLength), Object.update(
                placeholder: String.localize(@placeholder)
                onblur: _done
                onfocusleave: _done
                onkeydown: @create_onkeydown_handler()
            , @inputNodeAttrs)

        create_onblur_handler: ->
            T = this
            (ev) ->
                T.doneEditor @value
                true

        create_onkeydown_handler: ->
            T = this
            (ev) ->
                ev = ev or window.event
                T.doneEditor @value if ev.keyCode is 13
                true

        # invoked when value changed
        redrawValue: ->
            @valueElt?.domNode.value = @getValue()
            @domNodeClass "!ui-error"

        tapped: (ev) ->
            @valueElt?.domNode.focus()

        hintChanged: (v) ->
            @valueElt?.domNode.placeholder = v


# UI text input field:
Object.fire 

    uri: "axoid://define/Input/Textarea"
    inputTag: "textarea"
    maxLength: 8192


# UI text input field:
Object.fire 

    uri: "axoid://define/Input/PasswordInput"
    inputType: "password"


# UI text input field:
Object.fire 

    uri: "axoid://define/Input/DateInput"
    inputType: "date"


# UI checkbox field:
Object.fire 

    uri: "axoid://define/Field/Checkbox"
    captionStyle: "checkbox"
    methods: (_super) ->
        childrenAdapter: (ch) ->
            T = @
            _done = (ev) ->
                T.doneEditor !!@checked
                true

            [
                type:"Box"
                style: @valueBoxStyle
                children: [
                        type: "View"
                        onInited: -> T.valueElt = @
                        domNodeTag: "input"
                        style: @valueStyle1
                        domNodeAttrs:
                            onchange: _done
                            type: "checkbox"
                            value: true
                            disabled: @disabled
                            checked: !!@getValue()
                    ,
                        type: "View"
                        onInited: -> T.captionElt = @
                        domNodeTag: "span"
                        css: "display:inline;padding-left:8px"
                ]

            ]


    # invoked when value changed
    redrawValue: ->
        @valueElt.domNode.checked = !!@getValue()    if @valueElt
        return

# UI [fieldset] component:
Object.fire 

    uri: "axoid://define/Box/Fieldset"
    domNodeTag: "fieldset"
    methods: (_super) ->
        childrenAdapter: (ch) ->
            # add legend on top of children:
            ch.unshift(
                id: @id + "_label:Label"
                domNodeTag: "legend"
                style: @captionStyle
                caption: @caption
            )
            ch
