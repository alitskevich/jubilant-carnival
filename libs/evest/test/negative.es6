import {event, expect, expectError,expectOk, EVENT, CB_SYNC} from './infra.es6';

describe('Negative', function () {
    
    before(function(){
       
    });

    
    it('no-action-handler', function (next) {

        EVENT.action((err)=>{
            
            console.log('>>',arguments);
            expectError(err, '404');
            next();
        });
    });
    
    it('too-many-action-handlers', function (next) {
        
        event.on(EVENT, CB_SYNC);
        event.on(EVENT, CB_SYNC);

 
        EVENT.action((err)=>{
            
            console.log('>>',arguments);
            expectError(err, '500');
            next();
        });
        
    });

    
    it('off', function (next) {

        event.off(EVENT);

        EVENT.action((err)=>{
            
            console.log('>>',arguments);
            
            expectError(err, '404');
            
            next();
        });
    });
    
    
    it('immediate-results', function (next) {
        
        event.off(EVENT);
        event.on(EVENT, (p, cb)=>{console.log(p,cb)});

        try {
            
            const r = EVENT.action();
            expect(1).equal(0);
            
        } catch(err){
            
            expectError(err);
            
        };
        next();
        
    });
    
    after(function(){
        event.off(EVENT);
    });
});
