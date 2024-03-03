import utils from './utils.js'

// counter used as guid
var TOTAL = 0;

const TYPES = new Map();

const collectTypes = (typeId)  => {
    const types = [];
    let t = null;
    while (typeId) {
        t = TYPES.get(typeId);
        types.unshift(t);
        typeId = t.superId
    }
    return types;
};

//@creates a new one entity constructor.
const createConstructor = (type)  => {

    const defaults = {};
    const properties = new Map();
    const proto = Object.assign({}, Entity.prototype);

    collectTypes(type.superId).concat(type).forEach((type) => {

        if (type.properties) for (let propId in type.properties) {
            if (properties.has(propId)) {
                throw new Error(`bad-code: Duplicate property ${propId} in type ${type.id}`)
            }
            let prop = Property.instance(propId);
            properties.set(propId, prop);
            prop.setup(proto);
        }

        Object.assign(defaults, type.defaults);
        Object.mixin(proto, type.methods);

    });

    const ctor = function (meta) {

        this.id = meta.id || `#${TOTAL++}`; // identity
        this._state = new Map();
        this._defaults = Object.assign({id: this.id}, defaults, meta.defaults);
    };

    ctor.properties = properties;
    ctor.defaults = defaults;
    ctor.id = type.id;

    Object.assign(ctor.prototype, proto);

    return ctor;
};

// get entity constructor or creates/register a new one.
const getConstructor = (meta) => {

    if (meta.properties || meta.methods) {

        return this.createConstructor(Object.assign({}, meta, {id: `${meta.type}-${this.TOTAL++}}`, superId: meta.type}));
    } else {

        const type = this.TYPES.get(meta.type);
        return type.ctor || (type.ctor = this.createConstructor(type));
    }
};


