
Infrastructure
==============

***
## I. Functions.


#### Function.NONE
> Does nothing and returns first argument.

        {
            // used as a stub.
            someRequiredMethod : Function.NONE
            ...
        }

    

#### Function.perform(operations, event)

> Manages execution of sequence of functions allowing async and parallel flow.

Sync flow:

        Function.perform([
            // first operation
            function(arg){
                // `this` callback function HAS TO be called once to skip to next operation
                this(null, 'result'+arg.key);
            }
            ,
            // second operation
            function(err, result) {
              
                if (!err){
                    alert(result)
                }
            }
        ],{key:'arg'});
    
Async flow:

        Function.perform([
            function(){
                callSomethingAsync(this); // pass `this` as callback
            }
            ,
            function(err, result) {
                ...
            }
        ]);
    
Parallel async flow:

        Function.perform([
            function(){
                callSomethingAsync1(this.cb()); // pass callback created by `this.cb()`
                callSomethingAsync2(this.cb()); // pass one more callback created by `this.cb()`
                return 'result'; // instead of call `this(null, 'result')`
            }
            ,
            // will invoked when all callback triggered
            // `err` param will contain last error id any
            function(err, result, result1, result2) {
                ...
            }
        ]);

 
***
## II. Working with Arrays.

Routines to *safely* manipulate over arrays
    

####Array.slice(array)

> Returns new array that is slice of original.
    
        var result = Array.slice(['one', 'two'],1);
        > result 
        ['two']
    

####Array.item(array, index)

> Gets item of array by positions

        // negative index counts from right to left
        var result = Array.item(['one', 'two'], -1);
        > result 
        'two'


#### Function.prototype.iterator()

> Returns iterator function created from `this` function.

        // context object that become `this` and will be returned from iterator
        var context = {}
        // some extra parameter object
        var extra = 'key';
        // iterator function created
        var iteratorFn = (function(item, index, extra) { this[extra+index] = item }).iterator();

        var result = iteratorFn(array, context, extra);
        > result
        {'key1': 'one', 'key2': 'two'}

    
#### Array.findByAttr(arr, attrValue, attrId)

> Finds item matched by attribute ('id' by default)

```javascript
    > Array.findByAttr([{name:'Yuri'}, {name:'Alex'}], 'Yuri', 'name')
    {name:'Yuri'}
```

#### Array.sortBy(arr, , criteria, dir)

> Returns array sorted by `criteria` given in given direction.
>
> `criteria` is a function or string refered item attribute to sort by

        > Array.sortBy([2, 1], function(item) {return item;}, 1);
        [1, 2]

        > Array.sortBy([{name:'Yuri'}, {name:'Alex'}], 'name', 1);
        [{name:'Alex'}, {name:'Yuri'}]


***
## III. Working with Objects.


#### Object.update(obj, extra)

> Updates `obj` with data from `extra`.
>
> Returns `obj`.


        var obj = {a2:2};
        > Object.update(obj, {a1:1,a2:3})
        {a1:1, a2:3}

#### Object.get(obj, keys)

> Gets value of `obj` attribute specified by `keys` in deep or null if none.

        var obj = {a1:{a2:2}};
        > Object.get(obj, 'a1.a2')
        2
        
#### Object.set(obj, keys, value)

> Sets `value` to `obj` attribute specified by `keys` in deep.
>
> Returns `value` or null if fails.

        var obj = {};
        Object.set(obj, 'a1.a2', 2);
        > obj.a1.a2
        2

#### Object.clone(obj)

> Returns clone object of `obj` or null if none.

        var original = {key:1};
        var cloned = Object.clone(original);
        
        original.key = 2;
        > original.key
        2
        > cloned.key
        1
        

#### Object.parse(str)

> Returns result evaluated from `str`

        var r = Object.parse('{key:1}');
        
        > r.key
        1


***
## IV. Working with URI.


####Object.parseUri(str)

> Parses argument to a comprehensive URI object.

        var uri = Object.uri('data://root/p1/p2?param1=value1#hash1');
        > uri
        {
            type:'data',
            steps: ['root','p1','p2'],
            id: 'root/p1/p2'
            authority: 'root'
            params: {param1: 'value1'}, // param values are decoded
            hash: 'hash1'
        }
    

***
## V. Strings.

####String.capitalize(str)

>@returns capitalized {#s} or ''

    var result = String.capitalize('alex');
    > result
    "Alex"

####String.camelize(str, separator)

>@returns camelized {#s} or ''

    var result = String.camelize('alex_and_his_friends');
    > result
    "alexAndHisFriends"

####String.format(template, ...)

> Returns string formatted by template filled with rest of arguments
        
    var result = String.format('{0} watches {1}!', 'Big Brother', 'you');
    > result
    "Big Brother watches you!"
    
> If template is a function, then it is invoked with rest of arguments passed

    var result = String.format(Function.NONE, 'Alex');
    > result
    "Alex"

####String.formatWithMap(template, map)

> Returns string formatted by template and key/value map used for placeholder substitution.

    var result = String.formatWithMap('Hi, {name}!', {name:'Alex'});
    > result
    "Hi, Alex!"

***
## VI. Logging.
    
#### Object.log(...)
> Declared stub that does nothing by default.

        Object.log(a1, 't2');

#### Object.debug(...)
> Do with debug info. Adds prefix 'DEBUG:' and log arguments.

        Object.debug(a1, 't2');
        
    
***
## VII. Error handling.

#### Object.error
> Narrows error object from arguments.

        err = Object.error('not_found', "data not found", ex);
        
#### Object.error.log(err)
> Error logging.

        Object.error.log(err);

***
## VIII. Code dependency.

#### Object.require(deps, callback)
       
> Ensure all dependencies are resolved and invokes callback after.

***
## IX. Event notifications.

This API used to establish event-driven interactions between entities.

####Object.listen(type, handler, target, cb)

> Register an event `handler` function to listen all events with given `type`.

####Object.unlisten(type)

> Unregister all handlers that listen given `type`.

####Object.notify(event)

> Broadcasts `event` to all matched handlers for `type`.
> Event type is  ev.uri.kind or ev.uri.type