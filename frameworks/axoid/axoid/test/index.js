var should = chai.should();

describe('Axoid entity', function () {

    before(function(cb){
        cb();
    });

    it('Define and Create entity', function (done) {

        Object.emit({
            uri:'axoid://define/Sample'
            ,
            properties:['name', 'output']
            ,
            name:"world"
            ,
            outputExpression:"'Hello, '+<@name required>"
        });
        
        Object.emit({
            uri:'axoid://create/Sample#s1'
            ,
            callback: function (err, obj) {

                should.exist(obj);
                
                obj.should.have.property('id').which.equal('s1');
                
                obj.should.have.property('output').which.equal('Hello, world');

                done();
            }
        });
        
    });

    after(function(){
    });
    
});
