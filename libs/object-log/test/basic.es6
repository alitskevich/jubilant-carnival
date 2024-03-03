import Logger from '../index.es6';
import chai from 'chai';

const log = Logger(Logger.LEVELS.DEBUG);

const expect = chai.expect;

describe('Log', function () {

    it('basic', function () {
        
        expect(log('error', 'e')).to.be.equal('e');

        // By levels
        let r=''
        r+= log.error('e');
        r+= log.warn('w');
        r+= log.info('i');
        r+= log.debug('d');
        r+= log.verbose('v');
        
        expect(r).to.be.equal('ewid')

    });

});
