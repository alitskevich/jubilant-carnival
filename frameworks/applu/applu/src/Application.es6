import Flow from 'function-flow';


/**
 * An Application singleton class that represents the system as a whole.
 * Basically, It is just a container for plugins: creates, initializes and done them
 * Plugins may apply some additional featured to the application instance(like eventing, logging etc.)
 */
export default class Application {

    constructor(config) {

        this.config = {...config};

        const meta = this.config.plugins;

        if (!meta || !Array.isArray(meta) || !meta.length){

            throw new Error(`No plugins configuration array defined.`)
        }

        this.each = (op) => {throw new Error(`Can't invoke app.each() inside plugin constructor.`)};

        const list = meta.filter(m=>!m.disabled).map((m0, index) => {

            const config = !m0.plugin ? {plugin: m0} : m0;

            const PluginConstructor = config.plugin;

            if (typeof PluginConstructor !== 'function') {

                throw new Error(`No plugin constructor: ${config.id || config.source}`);
            }

            const p = new PluginConstructor(config, this);

            p.config = p.config || config;

            p._id = p._id || (PluginConstructor.name + index);

            p.id = p.config.id || p._id;

            p.log = p.log || function(message, ...data) {

                console.log(`${p.id}: ${message}`, ...data);

                return message;
            };

            p.error = p.error || function(message, ...data) {

                console.error(`${p.id}: ${message}`, ...data);

                return message;
            }

            return p;
        });

        this.each = (functor) => Flow({list, functor},()=>this).promise();
    }

    /**
     *  Initializes the application.
     *
     *  To be invoked immediately after app instance is created.
     */
    init() {

        return this.each((p)=> (p.init && p.init() || false));
    }

    /**
     *  Finalizes the application.
     *
     *  To be invoked when process is stopped.
     */
    done() {

        return this.each((p)=> (p.done && p.done() || false));
    }

}