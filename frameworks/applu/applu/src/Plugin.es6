
/**
 * An Application plugin.
 *
 * Represents an independent module of the system.
 *
 * To be descended with business logic.
 *
 * @see ./Application.js
 *
 */
export default class Plugin {

    constructor(config, app) {

    }

    /**
     *  Initializes the plugin.
     *
     *  Invoked from Application.init()
     *
     *  May return promise.
     */
    init() {

        this.log('inited');
    }

    /**
     *  Finalizes the plugin.
     *
     *  Invoked from Application.done()
     */
    done() {

        this.log('done');
    }
}