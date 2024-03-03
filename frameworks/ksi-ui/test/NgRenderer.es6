import {createElement} from 'reangulact-ng';

export function stringifyComponentNg(ctor) {

    return (createElement.apply(ctor, ctor.prototype.render()))
}

