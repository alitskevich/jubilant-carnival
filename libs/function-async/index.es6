import _flow from './src/Flow.es6';
import _Expiration from './src/Expiration.es6';

export const Flow = _flow;

export const Expiration = _Expiration;

export default function (...operations) {

    return new _flow(operations)
};
