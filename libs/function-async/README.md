# function-flow

Asynchronous sequence/parallel execution flow.

Features
-------

    Unified method
    chaining notation
    both serial/parallel at one flow
    timeouts
    supports Promises


Basic Usage
-------
  
        Flow(
            (result, next) =>  result+1;
            ,
            (result, next) => {setTimeout(()=>next(null, result+1))}
            ,
            [
                (result, next) => Promise.resolve(result+1);
                ,
                (result) => result+1;
                
            ]
        )
            .options({timeout:20})
            .initialValue(1)
            .start((error, result) => {
                         result.should.be.equal(5);
                   });

See also [Tests](https://github.com/alitskevich/function-async/tree/master/test) for more samples.

Repo
----

[https://github.com/alitskevich/function-async]


Legal
-----

The MIT License (MIT)

Copyright (c) 2015 Alex Litskevich