require('babel-register')({
    "presets": [
        "es2015",
        "stage-0"
    ],

    "only": "**/*.es6"
});

require('./main.es6');