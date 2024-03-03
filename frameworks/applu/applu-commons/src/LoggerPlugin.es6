import Logger from 'object-log';
import event from 'evest';

export function decoratePlugins (app){

    app.each((p)=>Object.assign(p,  {

        log(message, ...data) {

            return event({channel:'log', target:'info', data:[`${this.id}: ${message}`, ...data]}).action();
        },

        error(message, ...data) {

            return event({channel:'log', target:'error', data:[`${this.id}: ${message}`, ...data]}).action();
        }

    }));

}
/**
 * Plugin that provides logging feature
 */
export default class LoggerPlugin {

    constructor(config, app) {

        const logLevel = config.level || app.config.logLevel;

        this.logger = Logger(logLevel, config);

        this.init = function() {

            decoratePlugins (app);

        }


    }
    
    onLog({target, data={}}) {
        
        this.logger(target, ...data);

        return true;
    }
}

