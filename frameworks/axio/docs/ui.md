UI Library
==========

UI library for web client based on `Object.dom.*` 

This API includes basic set of properties and entity types used to design web UI.

***
Core UI properties and views
-------------

### [domNode] property

> Holds reference to underlying DOM element for this view.
>
> If no element specified in meta-info, then a new Element created 
>
> Newly created element appended to element of parent if it specified in `parentEntity` attribute.
>
> `domNodeType` and `domNodeAttrs` attributes used to customize element created by default (simple DIV).

### [style] property
> This property manages access to `domNode.className` and `domNode.style` attributes.
>
> It applies initial attributes `style` and `css` to `domNode.className` and `domNode.style` respectively (yes, that is slightly unmatched names)
>
> It also patches entity type attached to with following methods:
>
> + `domNodeStyle(delta)` - updates `domNode.style` with delta and returns style object
> + `updateDomNodeClass(str)` - set/unset classes in `domNode.className`
>

    
### [hidden] property
> This property manages access to [style.display] attributes of [domNode] element
>
> It patches entity type attached to with following methods:
>
> + `setHidden(flag)` - sets hidden flag
> + `switchDisplay()` - switches hidden flag
> + `display(flag)` - sets hidden or show including all parents
    
### [children] property.

> This property manages access to children views of this view.
>
> It patches entity type attached to with following methods:
>
> + `createChild(meta)` - creates a new child view with given meta-info
> + `setChildren(metaArray)` - replaces existing children views with news ones, created with list of meta-info given.
> + `getChildren()` - gets list of children views.

###[view] view

> This is root entity type for all other types of UI views.

```javascript
    Object.entity.define('view', {
        // It just attaches three core UI properties:[domNode], [style] and [hidden]:
        properties:[':domNode',':style',':hidden']
    });
```

###[box] view
> Simple UI container.

```javascript
    Object.entity.define('box extends view', {
        // It just extend  [view] entity type with [children] property
        properties:[':children']
    });
```

***
Common UI properties and Views
-------------

### [html] property
> This property manages access to `domNode.innerHTML` attribute.

### [disabled] property
> This property manages access to `domNode.disabled` attribute.
> It also toggle class 'disabled'

### [caption] property
> This property manages access to `captionElt.innerHTML` attribute.
> It also provides localization of caption.

### [label] view
> Simple localized label view.

### [html]
> Simple html container view.

### button
> Simple button view.

### [list] view
> Simple list view.
> It uses `data` property to fill with items.
> Features:
> + `value` property contains currently selected item id.
> + current item marked with 'active' class.

***
Complex UI Views
-------------

### [popup] view
> Popup view.
> It used to build some complex UI components.

### [table] view
> Table view.
> Features:
>
>+ Many columns.
>+ Multi-selections.
>+ Tree-view mode.

***
UI Form and fields.
-------------

### [field] view
> It's base entity type for other fields.
> features:
>
> + caption
> + help label
> + validation
> + customizations
> + `value` property contains current field value

### [input] view
> Simple input field

### [textarea] view
> Simple textarea field

### [checkbox] view
> Simple checkbox field

### [dropdown] view
> Simple dropdown field
> It uses `data` property to fill with options.

