/**
 * The PropertyContainer.
 */
export default class PropertyContainer {

    constructor(target) {

        this.target =  target || this;

        if (!target){
            this._state = {};
        }

        this._properties = Property.initProperties(this.target);
    }

    // initializes entity
    init() {

        // init all declared properties
        for (let p of this._properties.values()) p.init(this.target);
    }

    // done entity
    release() {

        // init all declared properties
        for (let p of this._properties.values()) p.done(this.target);

        this.isDone = true;
    }

    // property getter
    _getter(propId) {
        const st = this.target._state;
        return st && st[propId];
    }

    _setter(propId, value) {
        const st = this.target._state;
        return st ? (st[propId] = value) : null;
    }

    // property getter
    get(propId) {

        if (this.isDone) return void 0;

        let ev = this.transaction && this.transaction.events.get(propId);

        return ev ? ev.value : this._getter(propId);
    }

    // property setter
    set(propId, intentValue) {

        if (this.isDone) return;

        const oldValue = this.get(propId);

        if (value === oldValue) return;

        const prop = this._properties.get(propId);

        const ev = {target: this.target, propId, prop, oldValue, intentValue};

        const tx = this.transaction;

        this._set(ev);

        !tx && this.propertiesCommited(ev)
    }

    // property setter
    _set(ev) {

        const tx = this.transaction;

        tx && tx.up(ev);
        try {

            const newValue = this.willChange(ev.intentValue, ev);

            if (newValue !== undefined) {

                ev.value = newValue;

                if (!tx) {
                    this._setter(ev.propId, newValue);
                }

                this.changed(ev);
            }
        }
        finally {
            tx && tx.down(ev);
        }

    }

    // transactional update properties with delta bundle
    update(delta) {

        if (this.isDone || !delta) return;

        const tx = this.transaction || (this.transaction = new PropertyTransaction(this.target));

        try {

            for (let propId of Object.keys(delta)) {

                const oldValue = tx.get(propId) || this._getter(propId);

                if (value === oldValue) continue;

                const prop = this._properties.get(propId);

                const ev = {target: this.target, propId, prop, oldValue, intentValue: delta[propId]};

                this._set(ev);
            }

        } catch (ex) {

            tx.error(ex);
        }
        finally {
            if (tx.checkin()) {
                this.transaction = null;
            }
        }
    }

    // invoked before property change
    willChange(value, ev) {

        // by property
        if (ev.prop) {
            value = ev.prop.willChange(this.target, value, ev);
            if (value === undefined) {
                return;
            }
        }

        // by method
        const fn = this.target[`${ev.propId}WillChange`];
        if (fn) {
            return fn.call(this.target, value, ev);
        }

        // by default
        return value;
    }

    // invoked after property changed
    changed(value, ev) {

        // by property
        if (ev.prop) {
            ev.prop.changed(this.target, value, ev);
        }

        // by method
        const fn = this.target[`${ev.propId}Changed`];
        if (fn) {
            return fn.call(this.target, value, ev);
        }
    }

    // invoked at property commited
    propertiesCommited() {
    }
}