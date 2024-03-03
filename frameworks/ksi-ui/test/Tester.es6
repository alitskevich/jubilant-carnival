import React from 'react';

import {stringifyComponent} from './ReactRenderer.es6';
import {stringifyComponentNg} from './NgRenderer.es6';

export default {

    doAll(all) {

        all.forEach(test=>this.doTest(test));
    }
    ,
    doTest(test) {


        test.reactCases.forEach(caze=> {

            const el = React.createElement(test.type, caze.props);

            const str = stringifyComponent(el);

            if (str !== caze.result) {
                console.error('-test case failed', test.type.name, caze.id);
                console.log('expected:', caze.result);
                console.log('actual  :', str);
            } else {
                console.log('+test case passed', test.type.name, caze.id);
            }
        })

        const strNg = stringifyComponentNg(test.type);
        const strNgExpected = test.ngResult.replace(/\n\s*/g, '');

        if (strNg !== strNgExpected) {
            console.error('-ng test failed', test.type.name);
            console.log('expected:', strNgExpected);
            console.log('actual  :', strNg);
        } else {
            console.log('+ng test passed', test.type.name);
        }
    }

}