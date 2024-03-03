import KeyValueStorage from './impl/KeyValueStorage.es6';
import event from 'evest';

const _R = {};

function addResources(chunk, rr=_R) {

    chunk && Object.keys(chunk).forEach(key=> {

        const value = chunk[key];



        if ((typeof value === 'object') && !Array.isArray(value)) {

            let rrx = rr[key] || (rr[key]={});

            addResources(value, rrx);

        } else {

            rr[key] = value;
        }

    });
    
    return true;
}

function getItem(key) {

    const keys = Array.isArray(key) ? key : `${key}`.split('.');

    let rr = _R;

    for(let i = 0, l = keys.length; i<l; i++ ){
        
        rr = rr[keys[i]];
        
        if (!rr) return null;
    }
    console.log('getItem:keys', keys, rr);

    return rr;
}

const FEATURE = {

    /**
     * Gets resource.
     */
    resource(key) {

        return event(`resource://get/${key}`).action();
    },

    /**
     * Gets string resource.
     */
    string(key, lang = 'en') {

        return event(`resource://string/${key}?lang=${lang}`).action();
    },

    addResources(data) {

        return data ? event([`resource://add`,{data}]).action(Promise) : false;
    },

    fetchResources(sources) {

        return sources ? event([`resource://fetch`,{data:sources}]).action(Promise) : false;
    }
};

/**
 * This Plugin provides access to static resources defined in the system.
 */
export default class ResourcesPlugin{

    constructor(config, app) {

        this.init = function() {

            addResources(app.config.resources)

            app.each((p)=>{

                Object.assign(p, FEATURE)

                addResources(p.config.resources);

                addResources(p.constructor.RESOURCES);
            });

            return app.each((p)=>p.fetchResources(p.config.resourcesFrom));

        };
    }

    fetchResources (path) {

        const key = `res:${path}`;

        let r = event(`storage://get/${key}`).action();

        if (r) {

            return addResources(r);
        }

        return this.remote(path).then((data) => {

            event(`storage://set/${key}`,{data}).action();

            return addResources(data);

        }).catch((err)=>{

            this.error(err.message, err);

        })

    }
    
    /**
     * Gets resource.
     */
    onResource_get ({path}) {

        return getItem(path.join('.'));

    };

    /**
     * Gets string resource.
     */
    onResource_string({path, params}) {

        const item = getItem(`string.${path.join('.')}`);

        return item ? item[params.lang||'en'] || item.en || `${item}` : path.join(' ');

    }

    onResource_add({data}) {

        return addResources(data);
    }

    async onResource_fetch({data}) {
        const all =[].concat(data);
        for (let path of all) {
            await this.fetchResources(path);
        }
    };

}