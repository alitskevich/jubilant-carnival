import {bootstrap} from 'ui/Renderer.es6';
import State from './utils/Storage.es6';
import Application from './Application.jsx';
import config from './configs/DefaultState.es6';
import Strings from './configs/Strings.es6';
import Lookups from './configs/Lookups.es6';
import Localization from './utils/Localization.es6';

(function() {
    if (!(Object.setPrototypeOf || {}.__proto__)) {
        var nativeGetPrototypeOf = Object.getPrototypeOf;

        Object.getPrototypeOf = function(object) {
            if (object.__proto__) {
                return object.__proto__;
            } else {
                return nativeGetPrototypeOf.call(Object, object);
            }
        }
    }
})();

Localization.init(Strings);
Lookups.init();

State.init(config, (state) => {

    let root = window.rootComponent;

    let existingState=null;
    if (root){

        existingState = root.state;
   
        root.done();
    }

    window.rootComponent = bootstrap(Application, {...state,...existingState}, document.body)
});
 
if(module.hot) {
    module.hot.accept();
}