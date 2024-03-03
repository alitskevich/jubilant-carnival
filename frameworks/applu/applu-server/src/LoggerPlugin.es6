import {Plugin,event} from 'applugins';
import Winston from './impl/log-provider-winston.es6';

/**
 * Plugin that provides logging feature
 */
export default class LoggerPlugin extends Plugin {

    constructor(config, app) {

        super(config, app);

        this.logger = Winston(config);

    }
    
    onLog_any({target,value, data}) {
        
        (this.logger[target]||this.logger.debug)(value, ...data);
    }
}

