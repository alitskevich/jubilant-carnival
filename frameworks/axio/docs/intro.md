Introduction
============

AXIO.JS is yet another Javascript framework designed to be extremely simple, flexible, powerful and fast.


Main vision
-----------

```
Everything is Entities interacting by Events
```

Let figure out the entire system as a set of Entities.

Once initialized, these Entities provide access to its state via Properties.

All interactions between Entities are event-driven and mostly defined by property binding expressions.


**Entity** is an atomary piece of state and logic. 

+ Entity has a type. 
    * Entity type consists with 1) some initial state 2) a bunch of methods and 3) list of Properties attached to
    * Entity type can override some base type and also may be patched by Properties attached to. 
+ Entity can be referred by its `id` and can make reference to itself from other entity with `referral:[E,key]`.
+ Entity implicitly recieves `init()` at created and need to explicit `done()` at released.
+ Entity implements `(get|set|increment)Property()` to provide read/write access to its state via Properties.
+ Entity dynamically attaches Property of default type on demand.

You may 

+ Implement `<property>Changed()` hooks on any of its own property value changed.
+ Implement `handleEvent(event)` to handle events, which key matched with its `id`.
+ Invoke `E.setProperty('<property>Url', url)` to asynchronously set property value from some url
+ Set `<property>Expression` initial attribute to create binding expression for some property.

**Property** is stateless piece of code that used to represent any attribute of entity. 

+ Property is distinctly referred by its `type` and `key`. One property can be shared between many Entities.
+ Property has a type. Type can descent each other.
+ Property may have `entityPatch` used to patch entity type attached to.
+ Property provides `init()` and `done()` invoked from Entities it assigned to.
+ It implements `getValue()` and `setValue()` to provide read/write access to value attribute of Entity.
+ On value changed, Property invokes `E.<property>Changed()` and evaluates all related bindings.

**Event** is simple object having 1) `uri` attribute, 2) optional `callback` function 3) and some other payload.

+ Event key calculated from `event.uri.kind || event.uri.type`
+ Event fired by `Object.notify(event, cb)` to be handled
    * by entity, which `id` matched with event key.
    * otherwise, by each of functional listeners subscribed by `Object.listen(key, handler)`.

