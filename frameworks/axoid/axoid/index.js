import Uri from './js/Uri.js';


// Axoid API.
export default {

    // defines an entity or property type
    define(meta) {
        TYPES.set(meta.id, meta);
    }
    ,
    defineProperty(meta) {

        Property.define(meta)
    }
    ,
    // creates a new instance of entity from given `meta`
    create(meta) {
        //[meta.id, type] = meta.id.split(':') if meta.id
        ///meta.type = type if type

        // get constructor
        Ctor = getConstructor(meta);
        // create & launch
        return (new Ctor(meta)).launch()
    }
}