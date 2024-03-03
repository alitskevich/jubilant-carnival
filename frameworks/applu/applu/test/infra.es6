export {create as create, Plugin as Plugin,event as event} from '../index.es6';
import {event} from '../index.es6';
import chai from 'chai';

export const expect = chai.expect;

export function expectError(err, incl){
    
    expect(err).be.an('object').and.to.have.property('message').to.contain(incl||'500');
            
    return expect;       
}

export function expectNull(r){
    expect(r).equal(null);
    return expect        
}

export function expectOk(r){
    expect(r).equal('ok');
    return expect        
}
export const EVENT = event('type://target');

export const CB_SYNC = function (uri, cb) {cb(null, 'ok')}

