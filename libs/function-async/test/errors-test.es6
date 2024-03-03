import Flow from '../index.es6';
import chai from 'chai';

var expect = chai.expect;

function assertError(err, msg='error') {

    expect(err).to.be.an('object').to.have.property('message').equal(msg)

}

describe('Errors', function () {

    before(function (cb) {
        cb();
    });

    it('throw', function (done) {

        Flow(()=> {
            throw new Error('error');
        })
            .options({timeout: 20})
            .initialValue(1)
            .start((err)=> {
                assertError(err);
                done();
            });
    });

    it('pass', function (done) {

        Flow((r,next)=>{setTimeout(()=>next('error'), 20)})
            .options({timeout: 200})
            .initialValue(1)
            .start((err)=> {
                assertError(err);
                done();
            });
    });


    it('timeout error', function (done) {

        Flow((r,next)=>{setTimeout(()=>next('error'), 40)})
            .options({timeout: 20})
            .initialValue(1)
            .start((err)=> {
                assertError(err,'504: Timeout exceeded: 20ms');
                done();
            });

    });

    after(function () {
        console.log('DONE');
    });

});