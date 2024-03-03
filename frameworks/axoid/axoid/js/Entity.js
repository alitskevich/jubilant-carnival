/**
 * The Entity.
 */
class Entity extends PropertyContainer {

    // initializes entity
    init(){

    }

    static properties ={
        value: "Valuable"
    };

    constructor(){
        super()

    }
    // initializes entity
    init(){

        // init all declared properties
        for (let p of this._properties.values()) p.init(this);

        this._finalizers && this._finalizers.forEach(fn=> fn(this));
    }

    // done entity
    release() {
        // init all declared properties
        for (let p of this.constructor.properties.values()) p.done(this);

        this._state = null;
    }

    addFinalizer(fn) {
        (this._finalizers || (this._finalizers=new Set())).add(fn);
    }
    /*
     * Routines
     */

    error(msg) {
        return new Error(`${this}: ${msg}`);
    }

    log(...args) {

        args.unshift('' + this);

        Object.log(...args);

        return args[1];
    }

    toString() {
        return `[${this.constructor}:${this.id}]`
    }
}