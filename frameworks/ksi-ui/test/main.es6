import {initialize} from 'reangulact-r';
import {initialize as initializeNg} from 'reangulact-ng';

import Tester from './Tester.es6';
import AllTests from './AllTests.es6';

initialize();
//initializeNg();

Tester.doAll(AllTests);
