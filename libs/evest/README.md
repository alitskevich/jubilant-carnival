# Evest

A message hub that enables comprehensive event-driven application architecture 
allowing loose [coupling](https://en.wikipedia.org/wiki/Coupling_(computer_programming)) between software modules. 

[![view on npm](http://img.shields.io/npm/v/evest.svg)](https://www.npmjs.org/package/evest)
[![npm module downloads](http://img.shields.io/npm/dt/evest.svg)](https://www.npmjs.org/package/evest)
[![travis-ci status](https://api.travis-ci.org/alitskevich/evest.svg?branch=master)](https://travis-ci.org/alitskevich/evest)
[![code climate status](https://codeclimate.com/github/alitskevich/evest/badges/gpa.svg)](https://codeclimate.com/github/alitskevich/evest)

__Contents:__
* [Features](#features)
* [Installation](#installation)
* [Dependencies](#dependencies)
* [Usage](#usage)
* [Recipies](#recipies)
* [API documentation](https://github.com/alitskevich/evest/tree/master/doc)
* [Test cases](https://github.com/alitskevich/evest/tree/master/spec)

## Features

* Terse API relied on well-known URL concept.
* Implements both [publish–subscribe](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) and [request-response](https://en.wikipedia.org/wiki/Request%E2%80%93response) communication patterns.
* Functional style with immutable events objects.
* Supports 1)immediate results, 2)callbacks and 3)Promises 
* Universal code written in pure ES2015

## Installation

```
$ npm install --save evest
```

## Dependencies

Since evest heavily uses ES6 features, it depends on [core-js](https://github.com/zloirock/core-js) standard library 
when hosted in legacy environment and relies on [babeljs](babeljs.io) to transpile ES6 code into ES5.

## Usage

```js
var evest = require('evest');
```

> The [scripts section](https://github.com/alitskevich/evest/blob/master/package.json) of the package.json file contains set of build, lint and test scripts.

Build both the library and tests, minify the library:
```
$ npm run build
```

Run tests:
```
$ npm run test
```

Run [eslint](http://eslint.org/) for both the library and tests:
```
$ npm run lint
```

Run jsdoc and specs generators:
```
$ npm run doc
```

> Index.html (located in the repository root folder) can be used for running tests in browser as well as playing with library in the developer console.

## Recipies

Get evest factory:
```js
import evest from 'evest';
```

Subscribe to:
```js
evest.on('type://target', (event, callback) => callback(null, event.data.code));
```

Create an event object:
```js
var event = evest(['type://target?mode=direct', {data:{code:'ok'}}]);
```

Invoke action addressed to single handler and get results immediately:
```js
result = event.action();
```

Do action addressed to single handler with callback:
```js
event.action('type://target?code=ok', (error, result) => console.log(result));
```

Get promise for single handler result:
```js
var resultPromise = event.promiseAction();
```

Notify all handler and receive array of results from:
```js
event.emit((error, [result]) => console.log(result));
```

Get promise for all handlers results:
```js
var resultsPromise = event.promise();
```

Unsubscribe from:
```js
evest.off(event);
```

See [API documentation](https://github.com/alitskevich/evest/tree/master/doc) and 
[Test cases](https://github.com/alitskevich/evest/tree/master/test) for additional information and recepies.

## Event object serialization grammar

    [method!][channel:]//target[/path...][?{params...}][#value^{data}]

## Repo

[https://github.com/alitskevich/evest]

## Legal

The MIT License (MIT)

Copyright (c) 2015 Alex Litskevich
