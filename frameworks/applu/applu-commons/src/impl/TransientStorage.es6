
/**
 * Simple storage map .
 */
export default class TransientStorage {

    constructor() {

        this.data = {};
    }

    getItem(key) {

        return this.data[key];
    }

    setItem(key, data) {

        this.data[key] = data;
    }

}