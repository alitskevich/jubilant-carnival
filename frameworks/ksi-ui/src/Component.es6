import {functionName, getter, getStatic} from './utils/Utils.es6';
import {getDataset} from './utils/DOMUtils.es6';
import {h, keye} from './jsx/JsxAdapter.es6';
import Pipes from './utils/Pipes.es6';

let COUNTER = 0;

/**
 * The component base.
 */
export default class Component {

    static addPipe = Pipes.add;

    constructor(defaults, opts) {

        Object.assign(this, opts);

        this._id = functionName(this.constructor) + (++COUNTER);

        this.$={};

        this.state =  {...getStatic(this, 'DEFAULTS'), ...defaults};

        this.jsx = this.constructor.$TEMPLATE || (this.constructor.$TEMPLATE=keye(this.render()));

        this.render = ()=> h.apply(this, this.jsx);

    }

    done() {

        this._id = this.$ = this.state = this.jsx = undefined;
    }

    render() {

        return getStatic(this, 'TEMPLATE');
    }

    invalidate() {
    }

    ////////////////////////
    //// State
    ///////////////////////

    get(key) {

        // try Getter
        let value = this['get' + key[0].toUpperCase() + key.slice(1)];
        if (value !== undefined) {

            return value.call(this);
        }

        value = this.$[key];
        if (value !== undefined) {

            return value;
        }

        value = this[key];
        if (value !== undefined && value.bind) {

            return this.$[key] = value.bind(this);
        }

        return this.getState(key);
    }   
    
    getState(key) {

        return getter.call(this.state, key);
    }

    set(key, value, cb) {

        this.update({[key]: value}, cb);
    }

    update(delta) {

        if (delta) {

            const changedKeys = Object.keys(delta).filter(key=>(this.getState(key) !== delta[key]));

            if (changedKeys.length) {

                //this.log('update', changedKeys);

                Object.assign(this.state, delta);

                this.invalidate();

                changedKeys.forEach(key=>{
                    delete this.$[key];
                    this.hook(`${key}Changed`, delta[key], this.state)
                });
            }
        }
    }

    updateProps(delta) {

        if (delta) {

            const changedKeys = Object.keys(delta).filter(key=>(this.getState(key) !== delta[key]));

            if (changedKeys.length) {

                //this.log('updateProps', changedKeys);

                const old ={...this.state};

                Object.assign(this.state, delta);

                changedKeys.forEach(key=>{
                    delete this.$[key];
                });

                this.didUpdatedProps(this.state, old)
            }
        }
    }


    didUpdatedProps(state, old){
    }
    ////////////////////////
    //// Routines
    ///////////////////////

    updateOnClick(ev){
        const target = ev.currentTarget;
        if(!target.disabled){
            
            this.update({...getDataset(target)});
            
        }
    }

    hook(key, ...args) {

        const cb = this.state[key];

        return cb && cb.apply(this, args) || null;
    }

    pipe(value, pipes) {

        return Pipes.apply(value, pipes);
    }

    log(message, ...data) {

        console.log(this.toString(), message, ...data);

        return message;
    }

    toString() {

        return this._id;
    }
}