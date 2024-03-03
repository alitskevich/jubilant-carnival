let COUNTER = 0;

const ALL = new Map();

const _id = (ev)=>`${ev.channel || ''}://${ev.target || '*'}`;

export function getBundle(ev) {
    return ALL.get(_id(ev)) || ALL.get(`${ev.channel}://*`);
}

export function count(ev) {

    const bundle = getBundle(ev);

    return bundle ? bundle.size : 0;
}

export function has(ev) {

    return !!count(ev);
}

export function once(ev, handler) {

    const ownerId = `C${COUNTER++}`;

    const id = _id(ev);

    const bundle = ALL.get(id) || ALL.set(id, new Map()).get(id);

    bundle.set(ownerId, (_ev, cb)=> {

        ALL.get(id).delete(ownerId);

        handler(_ev, cb);
    });

    return ownerId;
}

export function on(ev, handler) {

    const ownerId = ev.data || `C${COUNTER++}`;

    const id = _id(ev);

    const bundle = ALL.get(id) || ALL.set(id, new Map()).get(id);

    if (bundle.has(ownerId)) {

        throw new Error(`Event listener already registered: ${ev} for ${ownerId}`);
    }

    bundle.set(ownerId, handler);

    return ownerId;
}

export function off(ev) {

    const ownerId = ev.data;
    const id = _id(ev);
    const idLen = id.length;

    let found = 0;

    for (let [key, bundle] of ALL) {

        if (ownerId && bundle && bundle.has(ownerId)) {
            bundle.delete(ownerId);
            found++;
            if (!bundle.size) {
                ALL.delete(key);
            }
        }

        if (idLen > 1 && key && key.slice(0, idLen) === id) {
            ALL.delete(key);
            found++;
        }
    }

    return found;
}
