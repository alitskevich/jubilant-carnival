import {createEvest, isEvest} from './Evest.es6';
import {on,once,off,has} from './All.es6';

/**
 * Factory function to create an instance of event
 * @ param ...sources
 * string or objects containing event properties to set
 * @type {Evest}
 */
const create = createEvest;

/**
 * Adds event listener for given reference
 * @param ref
 * reference containing event id to listen to
 * @param handler
 * handler function(event, callback){}
 * @returns {*}
 */
create.on = function(ref, handler) {

    return on(create(ref),handler);
};

/**
 * Adds once executed event listener for given reference
 * @param ref
 * reference containing event id to listen to
 * @param handler
 * handler function(event, callback){}
 * @returns {*}
 */
create.once = function(ref, handler) {

    return once(create(ref),handler);
};

/**
 * Removes all event listeners for given reference
 * @param ref
 * reference containing event id to remove
 * @returns {*}
 */
create.off = function(ref) {

    return off(create(ref));
};

/**
 * Checks if event listeners registered for given reference
 * @param ref
 * reference containing event id to check
 * @returns {*}
 */
create.has = function(ref) {

    return has(create(ref));
};

/**
 * Checks if given object has `Evest` type
 * @param obj
 * object to check
 * @returns {boolean}
 */
create.is = isEvest;

/**
 * Checks if two given objects have `Evest` type and equals.
 * @param a
 * 1st object to check
 * @param b
 * 2nd object to check
 * @returns {boolean}
 */
create.equal = function(a, b) {

    return a && b && create.is(a) && create.is(b) && a.id === b.id && `${a}`===`${b}`;
};


export default create;