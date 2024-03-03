# @define UI button view.
Object.fire 

    uri: "axoid://define/View/Button"
    properties: ["disabled:Disabled", "caption:Caption", 'counter']
    domNodeTag: "button"
    busyCaption:'in_progress'
    methods: (_super)->

        tapped: (ev) ->

            @prop "disabled", true #prevent double click
            if ev = @createAsyncEvent()

                @domNodeClass "ui-busy"
                if @busyCaption
                    @savedCaption = @getCaptionElt()?.domNode.innerHTML
                    @prop "caption", @busyCaption

                Object.fire Object.clone ev, callback:(err, result) =>
                    
                    ev.callback?(err, result)
                    
                    if err
                        @onError err
                    else
                        @incrementCounter()
                        @onSuccess()

                    @domNodeClass "!ui-busy"
                    @prop "disabled", false
                    if @savedCaption
                        @getCaptionElt()?.domNode.innerHTML = @savedCaption
                        @savedCaption = null
            else
                if @doAction()
                    @incrementCounter()
                Function.nextTick => @prop "disabled", false

        createAsyncEvent : ->
            null
            
        doAction : ->
            true

        incrementCounter: () ->
            @prop 'counter', (@prop('counter') or 0)+1
            
        counterChanged: () ->
            @prop 'odd', (@prop('counter') or 0 )%2 is 1
            
        onError : (err) ->
            
        onSuccess : ->