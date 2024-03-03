import Uri from '../src/index.es6';
import chai from 'chai';

var should = chai.should();

describe('Hub', function () {


    it('defered', function (next) {


        hub.emit('defered', {a:'defered'}, function (err, r1, r2){
            console.log('defered >>',arguments);
            should.equal(r1.a, 'defered');
            next();
        });

        console.log('defered >>>>>');

        hub.once('defered', function(params, cb) { setTimeout(function(){cb(null,params)},200)});

        console.log('defered 2>>>>>');

    });

    it('non-defered', function (next) {


        hub.emit('non-defered', {a:1, deferTimeout:0}, function (err, r1, r2){
            console.log('>>',arguments);
            should.exist(err);
            should.equal(err.code, 404);
            next();
        });

        hub.once('non-defered', function(params, cb) { setTimeout(function(){cb(null,params)},10)});

    });


    it('key-as-function', function (next) {

        hub.once('keyFn', function(params, cb) { setTimeout(function(){cb(null,params)},100)});

        hub.emit(function(params){params.a=2; return 'keyFn'}, {a:1}, function (err, r1){
            console.log('>>',arguments);
            should.equal(r1.a, 2);
            next();
        });

    });

    it('key-as-object', function (next) {

        hub.once('keyObj', function(params, cb) { setTimeout(function(){cb(null,params)},100)});

        hub.emit({key:'keyObj', params:{a:2} }, {a:1}, function (err, r1){
            console.log('>>',arguments);
            should.equal(r1.a, 2);
            next();
        });

    });

    it('key-as-fn-object', function (next) {

        hub.once('keyFnObj', function(params, cb) { setTimeout(function(){cb(null,params)},100)});

        hub.emit(function(){return {key:'keyFnObj', params:{a:2} }}, {a:3}, function (err, r1){
            console.log('>>',arguments);
            should.equal(r1.a, 2);
            next();
        });

    });

    it('async-params', function (next) {

        hub.once('paramSource', function(params, cb) { cb(null,{a:1+params.add})});
        hub.once('target', function(params, cb) { cb(null,params)});

        hub.emit('target#paramSource', {add:2}, function (err, r1){
            console.log('>>',arguments);
            should.equal(r1.a, 3);
            next();
        });

    });

    it('400', function (next) {

        hub.emit(null, {}, function (err, r1, r2){
            console.log('>>',arguments);
            should.exist(err);
            should.equal(err.code, 400);
            next();
        });
    });

    
});
