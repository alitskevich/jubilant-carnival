var axoid = require('axoid');
var axoid = require('axoid-commons');
var lib = require('../index.js');

var should = chai.should();

describe('Axoid entity', function () {

    before(function(cb){
        cb();
    });

    it('Define and Create entity', function (done) {

        Object.emit({
            uri:'axoid://define/Application/MyApp'
            ,
            properties:['value:Values']
            ,
            value:{name:'world'}
            ,
            titleExpression:"'Hello, '+<@name required>"
        });
        
        Object.emit({
            uri:'axoid://create/MyApp#app'
            ,
            callback: function (err, obj) {

                should.exist(obj);
                
                obj.should.have.property('id').which.equal('app');
                
                obj.should.have.property('title').which.equal('Hello, world');

                done();
            }
        });
        
    });

    after(function(){
    });
    
});
