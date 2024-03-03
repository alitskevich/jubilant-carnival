import {event, expect, expectError,expectOk, EVENT, CB_SYNC} from './infra.es6';

describe('Basic', function () {
    
    before(function(){
        
        event.on(EVENT, CB_SYNC );
        
    });

    it('emit', function (done) {

        EVENT.emit( (err, [r]) => {

            expectOk(r);

            done();
        });

    });

    it('action', function (done) {
        
        const r = EVENT.action((err, r) => {

            expectOk(r);
        });
        
        expectOk(r);
        done();

    });


    it('promise', function (done) {

        EVENT.emit(Promise).then(([r]) => {

                expectOk(r);

                done();

            }
        ).catch(done);
    });

    it('promiseAction', function (done) {

        EVENT.action(Promise).then((r) => {

                expectOk(r);

                done();

            }
        ).catch(done);
    });
    
    it('off', function (next) {

        event.off(EVENT);

        EVENT.action((err)=>{
            
            console.log('>>',arguments);
            
            expectError(err, '404');
            
            next();
        });
    });

    after(function(){
        event.off(EVENT);
    });
});
