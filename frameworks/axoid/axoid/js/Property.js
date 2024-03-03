var ALL, PTYPES;

ALL = {};

PTYPES = {};

export default class Property {

    constructor(id1) {
        var _super, ftor, k, methods, ref, typeId, v;
        this.id = id1;
        ref = this.id.split(':'), this.id = ref[0], typeId = ref[1];
        if (this.id.slice(-3) === "Uri") {
            this.asyncTarget = this.id.slice(0, -3);
        }
        if (typeId) {
            if (!(this.type = PTYPES[typeId])) {
                throw new Error("ERROR: No such property type: " + typeId);
            }
            if ((ftor = this.type.methods) && (methods = ftor(_super = {}))) {
                for (k in methods) {
                    v = methods[k];
                    if (typeof v === "function") {
                        _super[k] = this[k] || STUB;
                    }
                    this[k] = v;
                }
            }
        }
    }

    setup(proto) {
    }

    init(T, defs) {
        var expr, monitor, v;
        monitor = {
            locked: false
        };
        if ((expr = defs[this.id + "Binding"])) {
            Property.bind(T.id, this.id, expr, monitor);
        }
        if ((expr = defs[this.id + "Expression"])) {
            Property.bindWithExpression(T, this.id, expr, monitor);
        }
        if (!(((v = defs[this.id]) === void 0) || monitor.bound)) {
            T.prop(this.id, v, {force: true});
        }
        if (defs[this.id + "Uri"] || defs[this.id + "UriExpression"]) {
            return Property.instance(this.id + "Uri").init(T, defs);
        }
    }

    done(T) {
        return T.state[this.id] = null;
    }

    getter(T) {
        return T.state[this.id];
    }

    setter(T, v, ev) {
        return T.state[this.id] = v;
    }

    comparator(v1, v2) {
        return v1 === v2;
    }

    asyncAdapter(err, value) {
        if (err) {
            this.prop('asyncError', err);
        }
        return value || null;
    }

    createAsyncValueCallback(T) {
        var uuid;
        if (T._monitor == null) {
            T._monitor = {};
        }
        uuid = T._monitor[this.id] = Object.math.uuid();
        return (function (_this) {
            return function (err, value) {
                if (T.isDone) {
                    T.log("!!! obsolete result at asyncValueCallback for property " + T + "." + _this.id);
                    delete T._monitor[_this.id];
                    return;
                }
                if (uuid !== T._monitor[_this.id]) {
                    T.log("!!! out of monitor at asyncValueCallback for property " + T + "." + _this.id);
                    return;
                }
                T.prop(_this.id, (T[_this.id + "AsyncAdapter"] || _this.asyncAdapter).call(T, err, value));
                delete T._monitor[_this.id];
            };
        })(this);
    }

;

    setValue(T, value, opts) {
        var ev, uri, v;
        ev = Object.update({
            value: value
        }, opts);
        ev.propId = this.id;
        ev.entity = T;
        ev.oldValue = this.getter(T);
        if (ev.uri) {
            uri = ev.uri;
            ev.uri = null;
        }
        if (((v = ev.value) !== void 0) && (ev.force || !this.comparator(v, ev.oldValue))) {
            this.setter(T, v, ev);
            if (this.asyncTarget && v) {
                T.prop(this.asyncTarget, null, {
                    uri: v,
                    force: true
                });
            }
            T.propertyChanged(ev);
        }
        if (uri) {
            Object.emit({
                uri: uri,
                callback: this.createAsyncValueCallback(T)
            });
        }
        return ev;
    }

    static define(meta) {
        return PTYPES[meta.id] = meta;
    }

    static instance(id) {
        return ALL[id] || (ALL[id] = new Property(id));
    }

    static bindWithExpression(T, propId, value, monitor) {
        var _bind, _log, expr, i, len, ps, ref;
        expr = Property.Expression.instance(value);
        monitor.locked = false;
        _log = function (s) {
            if (Object.DEBUG) {
                return Object.log("binding: " + T + "[" + propId + "] " + s);
            }
        };
        _bind = function (ev) {
            var e, i, len, p, ref, val, values;
            if (monitor.locked) {
                return;
            }
            values = {};
            ref = expr.sources;
            for (i = 0, len = ref.length; i < len; i++) {
                p = ref[i];
                if (!(e = (p.entityId === '@' ? T : $(p.entityId).entity))) {
                    return _log("No source of " + p.id);
                }
                if (!(val = e.prop(p.propId)) && ((val === void 0 && p.flag !== 'optional') || (p.flag === 'required'))) {
                    return _log("No value from " + p.id);
                }
                values[p.id] = val;
            }
            monitor.locked = true;
            try {
                value = expr.expression.call(T, values);
                if (Object.LOG_LEVEL > 4) {
                    _log("= [" + expr.message + "] (" + (('' + value).replace('\n', ' ').slice(0, 31)) + ")");
                }
                return T.prop(propId, value);
            } finally {
                monitor.locked = false;
            }
        };
        ref = expr.sources;
        for (i = 0, len = ref.length; i < len; i++) {
            ps = ref[i];
            $.instance(ps.entityId === '@' ? T.id : ps.entityId).addPropertyChangedHandler(ps.propId, _bind, T.id);
        }
        if (!monitor.bound) {
            return _bind();
        }
    }

    /*

     double binds property.

     Placeholder grammar:  (entityId|"@") ["." propertyId]

     Use "@" to refer taget entity itself

     By default, propertyId is "value".

     Binding triggers when source is defined.

     @example hello world

     * will trigger when storage.name is defined
     valueBinding: "storage.name"
     */

    static bind(tId, tProp, path, monitor) {
        var _bind, _log, ref, ref1, s0, sId, sProp, val;
        ref = path.split('.'), sId = ref[0], sProp = ref[1];
        if (sProp == null) {
            sProp = 'value';
        }
        _log = function (s) {
            if (Object.DEBUG) {
                return Object.log("duplex: " + tId + "[" + tProp + "] " + s);
            }
        };
        _bind = function (ev) {
            var e, ref1;
            if (monitor.locked) {
                return;
            }
            monitor.locked = true;
            if (Object.LOG_LEVEL > 4) {
                _log("= [" + sId + "." + sProp + "] (" + (('' + ev.value).replace('\n', ' ').slice(0, 31)) + ")");
            }
            try {
                if (!tId) {
                    throw new Error("Binding target has no id");
                }
                if (!(e = (ref1 = $(tId)) != null ? ref1.entity : void 0)) {
                    throw new Error("Lack of binding target with id [" + tId + "]");
                }
                return e.prop(tProp, ev.value);
            } finally {
                monitor.locked = false;
            }
        };
        $.instance(sId).addPropertyChangedHandler(sProp, _bind, tId);
        if (!monitor.reverse) {
            if ((s0 = (ref1 = $(sId)) != null ? ref1.entity : void 0) && ((val = s0.prop(sProp)) !== void 0)) {
                _bind({
                    entity: s0,
                    value: val
                });
                monitor.bound = true;
            }
            monitor.reverse = true;
            this.bind(sId, sProp, tId + "." + tProp, monitor);
        }
        return true;
    }

;


}