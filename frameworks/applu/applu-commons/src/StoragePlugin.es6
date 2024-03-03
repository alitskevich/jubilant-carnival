import KeyValueStorage from './impl/KeyValueStorage.es6';
import event from 'evest';

/**
 * This Plugin provides access to client key-value storage.
 */
export default class StoragePlugin {

    constructor(config, app) {

        this.cache = new KeyValueStorage(config.persistence|| app.config.storagePersistence);

        app.storage = (key, data, reset)=> getset.call(this, key, data, reset);

    }

    onStorage_get(ev) {
        const {path, data} = ev;
        const key = path.join('.');

        if (!key) throw new Error('onStorage_get: "key" was not defined');

        // this.log('get', ev, this.cache.getItem(key))

        return this.cache.getItem(key) || data || null;

    }

    onStorage_set({data,path, params}) {

        const key = path.join('.');

        const prev = this.cache.getItem(key) || {};

        // update prev
        const value = (!params.reset) ? {...prev, ...data} : data;

        //this.log('set', value)

        this.cache.setItem(key, value);

        event(`storage://changed/${key}`).emit();

        return value;
    }
}