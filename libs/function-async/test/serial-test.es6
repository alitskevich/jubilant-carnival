import Flow from '../index.es6';
import chai from 'chai';

var should = chai.should();

function log(...args){

    console.log(...['\n--'].concat(args));
}

describe('Basic', function () {

    before(function (done) {
        done();
    });

    it('sequence', function (done) {

        Flow(
            function (result, next) {

                log('initial value: 1 == ', result);

                result.should.be.equal(1);

                return 2;
            },
            function (result, next) {

                log('instant result: 2 == ', result);

                result.should.be.equal(2);

                setTimeout(()=>next(null, 3));
            },
            function (result, next) {

                log('async result: 3 == ', result);

                result.should.be.equal(3);

                return Promise.resolve(4);

            },
            function (result) {

                log('promised result: 4 == ', result);

                result.should.be.equal(4);

                return 4;
            },
            function (result) {

                log('promised result: 4 == ', result);

                result.should.be.equal(4);

                return 4;
            }
        ).options({timeout:20}).initialValue(1).start(done);
    });

    after(function () {
        log('DONE');
    });

});

