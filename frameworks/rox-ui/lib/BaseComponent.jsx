import {Component} from 'react';
import classnames from 'classnames';
import {event} from 'applugins';

let COUNTER = 0;

/**
 * Base component. Hides React nature, refers to application instance, and adds some useful features.
 */
export default class BaseComponent extends Component {

    constructor(props, context) {

        super(props, context);

        this._id = `${this.getTypeName()}_${this.uniqueKey()}`;

        this.id = this.props.id || this._id;

        this.state = Object.assign({}, this.props);
    }

    //////////////////////
    // Life-time
    /////////////////////

    componentWillMount() {
    }

    componentDidMount() {
    }

    componentWillUnmount() {

        this.done = true;

        event.off(`#${this.id}`);
    }

    setState(delta) {

        if (!this.done && delta) {

            //this.log('state', delta);
            super.setState(delta);
        }
    }
    /**
     * Adds event handlers with this ownership.
     *
     * @param ev
     */
    addEventListener(key, handler) {

        event.on(`${key}#${this.id}`, handler);

    }

    //////////////////////
    // Logging
    /////////////////////

    log(message, ...data) {

        return event(`log://info`,{value: `${this.id}: ${message}`, data}).action();
    }

    /**
     * Logging warning.
     *
     * @param args
     * @returns {*}
     */
    warn(message, ...data) {

        return event(`log://warn`,{value: `${this.id}: ${message}`,data}).action();
    }

    /**
     * Error handling by default.
     * @param err
     */
    error(message, ...data) {

        const err = new Error(this.string(message || 'unknown'));

        Object.assign(err, {data});

        event(`log://error`,{value: `${this.id}: ${err.message}`, data:err}).action();

        return err;
    }

    //////////////////////
    // Resources
    /////////////////////

    /**
     * Gets resource.
     */
    resource(key) {

        return event(`resource://get/${key}`).action();
    }

    /**
     * Gets string resource.
     */
    string(key, lang) {

        return event(`resource://string/${key}?lang=${lang||''}`).action();
    }

    //////////////////////
    // Routines
    /////////////////////

    /**
     * Gets display name of component.
     */
    getName() {

        return this.props.name || this._id;
    }


    /**
     * Gets string representation of component.
     */
    toString() {

        return this.getName();
    }

    getTypeName() {

        const fn = this.constructor;

        return fn.displayName || fn.name || /^function\s+([\w\$]+)\s*\(/.exec(fn.toString())[1];
    }


    callPropsHook(key, ...args) {

        const cb = this.props[key];

        return cb && cb.apply(this, args) || null;
    }

    uniqueKey() {

        return `C${COUNTER++}`;
    }



    event(...sources) {

        return event(...sources);

    }

    emit(key, params, cb) {

        event(key, {data: params}).action(cb);

    }

    promit(key, params) {

        return event(key, {data: params}).promise();
    }

    resolveClassNames(...args) {

        return classnames(...args);
    }

    style(st) {

        return typeof st == 'string' ? st.split(';').reduce((p, q, i, arr, kv = q.split(':'))=>(p[kv[0]] = kv[1], p), {}) : st;
    }
}