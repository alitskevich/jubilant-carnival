import Flow from '../index.es6';
import chai from 'chai';

var expect = chai.expect;

function check101(results) {
    //console.log(results);
    expect(results).to.eql([101,102,103]);
    return true
}

describe('parallel', function () {

    it('instant', function (done) {

        Flow([1,2,3].map(n=>(p, cb)=>n+p), check101)
            .initialValue(100)
            .start(done);
    });

    it('instant-functor', function (done) {

        Flow({list:[1,2,3], functor: (p, cb, n)=>(n+p)}, check101)
            .initialValue(100)
            .start(done);
    });

    it('async', function (done) {

        Flow([1,2,3].map(n=>(p, cb)=>{setTimeout(()=>cb(null,n+p),10)}), check101)
            .initialValue(100)
            .start(done);
    });

    after(function () {
        console.log('DONE');
    });

});