Object.fire 

  uri: "axoid://define/View/webclient.AceEditor"
  properties:['value']
  css: "position: relative;height: 500px;"
  mode:'coffee'
  theme:'chrome'
  methods: (_super)->

    init: ->
        _super.init.call @
        @editor.getSession().on 'change', (e) =>
            return if @defered
            @defered = true
            Function.nextTick 1000, @, ->
                @defered = false
                @isOnChange = true
                @prop 'value', @editor.getValue()
                @isOnChange = false

    domNodeChanged: (domNode) ->
        @editor = window.ace.edit(domNode)
        @editor.setTheme("ace/theme/#{@theme}")
        @editor.getSession().setMode("ace/mode/#{@mode}")

    valueChanged: (value) ->
        @editor.setValue(value) unless @isOnChange
