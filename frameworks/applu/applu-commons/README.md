# Applugins

Set of common plugins for 'applugins':

   - ResourcesPlugin
   - LoggerPlugin
   - SettingsPlugin

Usage
-----

    import {LoggerPlugin} from 'applugins-commons';
    
    config.plugins.push({
        type: LoggerPlugin
    });
    
    // once at start
    App.create(config).init().then((app)=>{});
    
See `test/test.js` for more use cases.

Repo
----

[https://github.com/alitskevich/applugins-commons]


Legal
-----

The MIT License (MIT)

Copyright (c) 2015 Alex Litskevich

