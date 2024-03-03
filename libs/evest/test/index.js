require('babel-register')({
    "presets": [
      "es2015",
        "stage-0"
    ],

    "only": "**/*.es6"
  });
  
require('./instance.es6');
  
require('./basic.es6');
require('./negative.es6');
require('./advanced.es6');
//require('./featured.es6');
