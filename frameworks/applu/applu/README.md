# Applu

Simple Application/Plugins architecture.

Features
--------

   - written in JS6
   - easy to learn/use
   - universal code 
   - async init/done for plugins using `async/await` 

Usage
-----

    ```js
    import App from 'applugins';
    
    // once at start
    (App.create(config)).init().then((app)=>{...});
     
    ...
    // Custom plugin
    class ThePlugin extends App.Plugin {
    
        constructor(config, app){
        
            // may add some api method        
            app.someApi = ()=>{};
        }
        
        init(){
        
            return new Promise(op);
        }

        done(){
            return new Promise(op);
        }
    }
```

See `test/test.js` for more use cases.

Legal
-----

The MIT License (MIT)

Copyright (c) 2015 Alex Litskevich

