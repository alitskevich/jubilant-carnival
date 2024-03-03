require('babel-register')({
    "presets": [
        "es2015",
        "stage-0"
    ],

    "only": "**/*.es6"
});

//require('./serial-test.es6');
//require('./errors-test.es6');

require('./parallel-test.es6');