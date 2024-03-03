import {event, expect, expectError} from './infra.es6';

describe('Advanced', function () {

     it('Asterisk', function (next) {
         
        event.on('type://*', (uri, cb)=> { setTimeout(()=>cb(null,42),20)});

        event('type://key1').emit(function (err, [r]){
            console.log('>>',arguments);
            expect(r).equal(42);
            next();
        });

    });

    it('Multi', function (done) {
        
        event.on('//key1', (uri, cb)=>cb(null, 1));
        event.on('//key1', (uri, cb)=>cb(null, 2));

        const direct = event('//key1?a=1').emit( (err, [r, r2]) => {

            console.log('sum', r,r2);

            expect(r).to.equal(1);
            expect(r2).to.equal(2);

            done();
        });
        
        expect(direct).to.be.an('array').with.length(2);
        expect(direct[0]+direct[1]).to.equal(3);

    });
    
    it('offOwner', function (next) {
        
        event.on('//key3#ownerId', (uri, cb)=>cb(null, uri.params.a+2));

        event.off('#ownerId');

        event('//key3').action(function (err, r1){
            console.log('>>',arguments);
            expect(err).be.an('object');
            next();
        });
    });
    
    it('timeout', function (next) {

        event.once('//timeout', function(params, cb) { setTimeout(function(){cb(null,params)},1000)});

        event(['//timeout',{timeout:600}]).emit(function (err, r1){
            console.log('>>',arguments);
            expect(err).be.an('object').and.to.have.property('message').to.contain('504');
            next();
        });

    });

});
