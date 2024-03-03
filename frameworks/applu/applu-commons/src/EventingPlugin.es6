import Logger from 'object-log';
import event from 'evest';

function addListeners(){

    const keys={};
    let t = this.constructor.prototype, tt;
    while(t){
        Object.getOwnPropertyNames(t)
            .filter(key=>(key.substring(0,2)==='on'))
            .forEach(key=>{
                const id =  `${key[2].toLowerCase()}${key.substring(3)}`;
                if (id.includes('_')){
                    keys[key] = id.replace('_','://').replace('://any','://*')
                } else {
                    keys[key] = id+'://*';
                }
             });
        //console.log(t,Object.getOwnPropertyNames(t),Object.keys(t))
        tt = t.__proto__;
        t = (t===tt)?null:tt;
    }

    Object.keys(keys).forEach(key => event.on(`${keys[key]}#${this._id}`, this[key].bind(this)));

    return true;
}

/**
 * This Plugin adds eventing feature into the system.
 */
export default class EventingPlugin {

    constructor(config, app) {

        this.init = function() {

            Object.event = event;
            Object.action = (ev, cb)=>event(ev).action(cb);
            Object.emit = (ev, cb)=>event(ev).emit(cb);

            app.each((p)=>(p::addListeners()));

            app.each((p)=>{
                p.event = Object.event;
                p.action = Object.action;
                p.emit = Object.emit;
            });
        }

        this.done = function() {

            return app.each((p)=>(event.off(`#${p._id}`)));
        }
    }
}