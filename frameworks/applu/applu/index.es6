import Application from './src/Application.es6';

// the singleton application instance
let isCreated = false;

export {default as Plugin} from './src/Plugin.es6'

// creates application instance if none created yet
export function create(config) {

    if (isCreated) {

        throw new Error('Application instance has been already created.');
    }

    isCreated = true;

    return new Application(config);
}

