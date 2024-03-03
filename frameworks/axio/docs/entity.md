Entity and its Properties.
====

***
Entity
------
There is three public operation over Entities: define entity type, create and get by id


***
####Object.entity.define(typeId, body)

> Defines a new entity type.

```js
Object.entity.define(
  'MyEntity extends BaseEntity' // a new type id [and extended type]
  ,
  {
  // list of properties attached to this type in form '[propertyType:]id'
  // if id equals with propertyType, then short notation can be used ':id'
  properties:[':caption']
  ,
  // some initial value for property
  caption: 'First code'
  ,
  // factory method that returns bundle of methods that override base entity type
  methods : function (_super) {
    return {
      init : function(){
        // call super
        _super.init.call(this);
        // do something extra
        ...
      }
      }
    }
  }
);
```

***
####Object.entity.create(meta)

> Creates a new entity instance.
>
> *@error* thrown if no such entity type defined yet.

Object.entity.create({
id:'MyEntity:myEntity1' // required EntityType and optional entity id
,
// some initial value for property. (It ovverides value specified in entity type)
caption: 'Second code'
});

***
####Object.entity(id)

> Returns an entity instance by given id or null if none exists

var entity = Object.entity('myEntity1');

***
#### Root entity type
All entity types implicitly extends anonymous root type that provides basic functionality.

// let define empty type
Object.entity.define('EmptyType');

// create entity
var entity = Object.entity.create({id:"EmptyType:someId")

//entity will contain following:
console> entity
{
// some unique entity id that can be referred from `Object.entity(id)`
id: 'someId'

// invoked implicitly from `Object.entity.create()`
init: function(){
// usually overriden in descendants
}

// invoked when entity is released
done: function(){
// can be overriden in descendants
}

// used to read property value
getProperty: function(key){
// do not override it. Use custom property types.
}

// used to write property value
setProperty: function(key, value){
// do not override it. Use custom property types.
}

// used to increment property value
incrementProperty: function(){...}

// string representation of entity
toString: function(){...}
...
// some internal functions prefixed with '_'
}

***
#### EventHandler entity type.

>This entity type provides basic functionality to handle events that matched entity id.
>It supports `ready` property and can defer event handling until ready.
>
>By default, it uses `event.uri.host` to dispatch event handling to one of its methods specified by. Descendants can
override `handleEventImpl` for own behavior.

Object.entity.create({
id:'EventHandler:schemeId'
,
handleEventImpl: function(ev){
// by default (this.eventHandlers||this)[ev.uri.host].call(this, ev);
// but you can do something else
}
});

***
Property
--------

Actually, we only need to define Property type and then specify properties by type and name.

***

####Object.property.define(id, body, entityPath)

> Defines a new property type.
> It allow to define custom property type that manage access to entity state in some specific manner.

Object.entity.defineProperty('MyPropertyType extends SomeBaseProperty'
,
// factory method that returns object to override base property
function(propId) {
return {
// overrides base setter
setter: function(v, prop) {
return this[propId] = !!v; // convert to boolean
}
}
}
,
// factory method that returns object to patch entity type attached to
function(_super) {
return {
init : function() {
// call super init()
_super.init.call(this);
....
}
}
}
});

Methods below do not intended to use exclicitly.

***
####Object.property(id, type)**

> Returns an unique stateless property instance by given type and id.
>
> A new instance created if none exists yet.
>
> **@error** thrown if no such property type defined yet.
>
> **NOTE** Actually, no need to invoke this method exclicitly, it invoked on demand from `entity._prop()`.

// @get property instance by key.
// Creates new one if none exists yet.
_prop : function (key) {
return this...properties[key]
|| (this...properties[key] = Object.property(key,"*"));
}

***
####Object.property.bind(theEntity, propertyId, expression)**

> Creates a new property binding expression.
>
> * Binding tracks changes of mentioned source entity properties, evaluate expression and set result into given property
of given entity
> * Binding tries to trigger immediately at created
> * Binding will not trigger until all source entites are created and all required source property value is filled.
> * `this` inside of expression refers to entity instance
>
> **NOTE** Actually, no need to invoke this method exclicitly, it usually invoked on demand from `property.init()`.

var entity = Object.entity.create({
id:'MyEntity:myEntity1'
,
// property binding expression that binds [caption] property with others.
// NOTE: asterisk in placeholder means that source value is required.
captionExpression: '${someEntity.propId} + " and " + ${*someOtherEntity.requiredPropId}'
});

***
####Default property type
All property types implicitly extends default type (named "*") that provides basic functionality.

var prop = Object.property('someProppId', '*');

console> prop
{
// property id that refer to entity state attribute key.
id: 'someProppId'

// invoked when property attached to entity type
// by default applies patches to entity type
attachToEntityCtor: function(ctor){
// can be overriden in descendants
}

// invoked implicitly from `entity.init()`
init: function(){
// usually overriden in descendants
}

// invoked implicitly from `entity.done()`
done: function(){
// can be overriden in descendants
}

// value comparator
comparator : function(v1, v2) {
// usually overriden in descendants
return v1 === v2;
}

// used to read property value
getValue: function(theEntity, key){...}

// used to write property value
setValue: function(theEntity, key, value){
// do not override it.
}

// used to load property value asynchronously from some Channel
setAsyncValue: function(){
// do not override it.
}

// value setter
_setter : function (value) {
// `this` is entity instance
// usually overriden in descendants
}

// value getter
_getter : function () {
// `this` is entity instance
// can be overriden in descendants
}
}