import event from '../src/index.es6';
import chai from 'chai';

var expect = chai.expect;

const SAMPLE = 'post!http://user@example.com:80/path0/path1?id=some&num=5&bool=true#%7B%22a%22%3A1%7D';
const URI = event(SAMPLE);
const SAMPLES = [
    'post!http://user@example.com:80/path0/path1?id=some&num=5&bool=true#%7B%22a%22%3A1%7D'
    ];

describe('Instantiate', function () {

    before(function(cb){
        cb();
    });

    it('Serialize', function () {
        
        SAMPLES.forEach( s=> expect(`${event(s)}`).to.be.equal(s) );
    });

    it('Parse', function () {

        var uri = URI;
        
        expect(uri.id).to.be.equal('http://example.com/path0/path1');
    
        expect(uri.channel).to.be.equal('http');
        expect(uri.method).to.be.equal('post');
        expect(uri.index).to.be.equal('80');
        expect(uri.target).to.be.equal('example.com');

        expect(uri.path[0]).to.be.equal('path0');
        expect(uri.path[1]).to.be.equal('path1');

        expect(uri.params['id']).to.be.equal('some');
        expect(uri.params['num']).to.be.equal(5);
        expect(uri.params['bool']).to.be.equal(true);

        expect(uri.data['a']).to.be.equal(1);

    });

    it('modify', function () {

        var uri = event([URI, '?id=other', {params:{b:2}, data:{a:2}}]);
        expect(uri.params['id']).to.be.equal('other');
        expect(uri.params['b']).to.be.equal(2);
        expect(uri.data['a']).to.be.equal(2);

    });

    it('withData', function () {

        var uri = event([URI,{data:{a:3}}]);
        expect(uri.data['a']).to.be.equal(3);
    });


    after(function(){
    });
    
});
