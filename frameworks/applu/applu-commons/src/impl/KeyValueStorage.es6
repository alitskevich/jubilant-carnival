import TransientStorage from './TransientStorage.es6';

/**
 * provides access to settings assets.
 * Supports transient, session, and persistent scopes
 */
export default class KeyValueStorage {

    /**
     * Tests if local storage is available in the browser. Falls back to using {StorageStub} if
     * local storage is not available.
     *
     * @param app {Application} application object
     * @param config {Object} configuration metadata
     */
    constructor(persistence) {

        this.transient = new TransientStorage();

        this.persistence = persistence;
    }

    /**
     * Extracts JSON from the stored string.
     *
     * @param key {String} storage key
     * @returns {Object} JSON parsed from the stored string
     */
    getItem(key) {
        return this.transient.getItem(key) || ( this.persistence && JSON.parse(this.persistence.getItem(key) || 'null'));
    }

    /**
     * Puts object's string representation to the storage.
     *
     * @param key {String} storage key
     * @param b {Object} object to store
     */
    patchItem(key, delta) {

        let value = this.getItem(key);
        var affected = 0;

        Object.keys(delta).forEach((k)=> {
            if (value[k] !== delta[k]) {
                value[k] = delta[k];
                affected = 1;
            }
        });

        if (affected) {

            return this.setItem(key, value);
        }

        return null;

    }

    /**
     * Puts object's string representation to the storage.
     *
     * @param key {String} storage key
     * @param b {Object} object to store
     */
    setItem(key, value) {

        this.transient.setItem(key, value);

        if (this.persistence){
            this.persistence.setItem(key, JSON.stringify(value));
        }

        return value;
    };

}