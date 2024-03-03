/**
 * The PropertyContainer.
 */
export default class PropertyTransaction {

    constructor(target) {

        this.target = target;
        this.count = 0;
        this.events = new Map();
    }

    get(propId) {

        const ev = this.events.get(propId);
        return ev ? ev.value : null;
    }

    up(ev) {

        this.count++;
        this.events.set(ev.propId, ev);

        return ev;
    }

    down(ev) {

        this.count--;

        return ev;
    }

    error(err) {

        this._error = err;
    }

    checkin() {

        if (this.count) return false;

        if (this.error) throw this._error;

        commit();

        return true;
    }

    commit() {

        const target = this.target;
        const events = this.events.values();

        events.forEach(ev => {
            if (!ev.cancel) {
                target.state[ev.propId] = ev.value
            }
        });

        target.propertiesCommited(...events);
    }
}