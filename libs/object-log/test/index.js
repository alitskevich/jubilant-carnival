require('babel-register')({
    "presets": [
        "es2015"
    ],

    "only": "**/*.es6"
});

require('./basic.es6');