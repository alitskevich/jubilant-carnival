>> { '0': [Function] }
>> { '0': [Function] }
>> { '0': [Function] }
>> { '0': [Function] }
Evest {
  type: 'type',
  path: [],
  target: 'target',
  params: {},
  id: 'type://target/' } [Function]
>> { '0': undefined, '1': [ 42 ] }
sum 1 2
>> { '0': [Error: 404: No handlers: //key3/] }
>> { '0': [Error: 504: timeout: //timeout/], '1': [  ] }
# TOC
   - [Instantiate](#instantiate)
   - [Basic](#basic)
   - [Negative](#negative)
   - [Advanced](#advanced)
<a name=""></a>
 
<a name="instantiate"></a>
# Instantiate
Serialize.

```js
SAMPLES.forEach(function (s) {
            return expect('' + (0, _index2.default)(s)).to.be.equal(s);
        });
```

Parse.

```js
var uri = URI;
        expect(uri.id).to.be.equal('http://example.com/path0/path1');
        expect(uri.type).to.be.equal('http');
        expect(uri.method).to.be.equal('post');
        expect(uri.index).to.be.equal('80');
        expect(uri.target).to.be.equal('example.com');
        expect(uri.value).to.be.equal('value');
        expect(uri.path[0]).to.be.equal('path0');
        expect(uri.path[1]).to.be.equal('path1');
        expect(uri.params['id']).to.be.equal('some');
        expect(uri.params['num']).to.be.equal(5);
        expect(uri.params['bool']).to.be.equal(true);
        expect(uri.data['a']).to.be.equal(1);
```

modify.

```js
var uri = (0, _index2.default)(URI, '?id=other', { params: { b: 2 }, data: { a: 2 } });
        expect(uri.params['id']).to.be.equal('other');
        expect(uri.params['b']).to.be.equal(2);
        expect(uri.data['a']).to.be.equal(2);
```

withData.

```js
var uri = URI.withData({ a: 3 });
        expect(uri.data['a']).to.be.equal(3);
```

<a name="basic"></a>
# Basic
emit.

```js
_infra.EVENT.emit(function (err, _ref) {
            var _ref2 = _slicedToArray(_ref, 1);
            var r = _ref2[0];
            (0, _infra.expectOk)(r);
            done();
        });
```

action.

```js
var r = _infra.EVENT.action(function (err, r) {
            (0, _infra.expectOk)(r);
        });
        (0, _infra.expectOk)(r);
        done();
```

promise.

```js
_infra.EVENT.promise().then(function (_ref3) {
            var _ref4 = _slicedToArray(_ref3, 1);
            var r = _ref4[0];
            (0, _infra.expectOk)(r);
            done();
        }).catch(done);
```

promiseAction.

```js
_infra.EVENT.promiseAction().then(function (r) {
            (0, _infra.expectOk)(r);
            done();
        }).catch(done);
```

off.

```js
var _arguments = arguments;
_infra.event.off(_infra.EVENT);
_infra.EVENT.action(function (err) {
    console.log('>>', _arguments);
    (0, _infra.expectError)(err, '404');
    next();
});
```

<a name="negative"></a>
# Negative
no-action-handler.

```js
var _arguments = arguments;
_infra.EVENT.action(function (err) {
    console.log('>>', _arguments);
    (0, _infra.expectError)(err, '404');
    next();
});
```

too-many-action-handlers.

```js
var _arguments2 = arguments;
_infra.event.on(_infra.EVENT, _infra.CB_SYNC);
_infra.event.on(_infra.EVENT, _infra.CB_SYNC);
_infra.EVENT.action(function (err) {
    console.log('>>', _arguments2);
    (0, _infra.expectError)(err, '500');
    next();
});
```

off.

```js
var _arguments3 = arguments;
_infra.event.off(_infra.EVENT);
_infra.EVENT.action(function (err) {
    console.log('>>', _arguments3);
    (0, _infra.expectError)(err, '404');
    next();
});
```

immediate-results.

```js
_infra.event.off(_infra.EVENT);
        _infra.event.on(_infra.EVENT, function (p, cb) {
            console.log(p, cb);
        });
        try {
            var r = _infra.EVENT.action();
            (0, _infra.expect)(1).equal(0);
        } catch (err) {
            (0, _infra.expectError)(err);
        };
        next();
```

<a name="advanced"></a>
# Advanced
Asterisk.

```js
_infra.event.on('type://*', function (uri, cb) {
            setTimeout(function () {
                return cb(null, 42);
            }, 20);
        });
        (0, _infra.event)('type://key1').emit(function (err, _ref) {
            var _ref2 = _slicedToArray(_ref, 1);
            var r = _ref2[0];
            console.log('>>', arguments);
            (0, _infra.expect)(r).equal(42);
            next();
        });
```

Multi.

```js
_infra.event.on('//key1', function (uri, cb) {
            return cb(null, 1);
        });
        _infra.event.on('//key1', function (uri, cb) {
            return cb(null, 2);
        });
        var direct = (0, _infra.event)('//key1?a=1').emit(function (err, _ref3) {
            var _ref4 = _slicedToArray(_ref3, 2);
            var r = _ref4[0];
            var r2 = _ref4[1];
            console.log('sum', r, r2);
            (0, _infra.expect)(r).to.equal(1);
            (0, _infra.expect)(r2).to.equal(2);
            done();
        });
        (0, _infra.expect)(direct).to.be.an('array').with.length(2);
        (0, _infra.expect)(direct[0] + direct[1]).to.equal(3);
```

offOwner.

```js
_infra.event.on('//key3#ownerId', function (uri, cb) {
            return cb(null, uri.params.a + 2);
        });
        _infra.event.off('#ownerId');
        (0, _infra.event)('//key3').action(function (err, r1) {
            console.log('>>', arguments);
            (0, _infra.expect)(err).be.an('object');
            next();
        });
```

timeout.

```js
_infra.event.once('//timeout', function (params, cb) {
            setTimeout(function () {
                cb(null, params);
            }, 2000);
        });
        (0, _infra.event)('//timeout').emit(function (err, r1) {
            console.log('>>', arguments);
            (0, _infra.expect)(err).be.an('object').and.to.have.property('message').to.contain('504');
            next();
        }, { timeout: 600 });
```

