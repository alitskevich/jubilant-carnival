###
# Defines [Settings] entity type that works as a stored values bundle container.
# @options
#   - storage
###
Object.fire 

    uri: "axoid://define/Settings"

    properties: ["value:Values"]
    
    storage: window.localStorage
    
    methods: (_super) ->

        init: ->
            @storage = @createStorage()
            @initValue(@id)
            _super.init.call @

        createStorage: ->
            @storage or
                getItem: (key) -> @[key]
                setItem: (key, value) -> @[key] = value

        initValue: (key) ->
            #restore from storage
            @value = (s = @storage.getItem(key)) and Object.parse(s) or @value or {}

        valueChanged: (val) ->
            @persistValue val
            _super.valueChanged.apply @, arguments

        persistValue: (v) ->
            try @storage.setItem @id, s unless @storage.getItem(@id) is (s = JSON.stringify(v))
