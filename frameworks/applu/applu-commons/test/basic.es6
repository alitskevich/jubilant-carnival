import {create, Plugin, event} from 'applugins';
import {LoggerPlugin, ResourcesPlugin, StoragePlugin} from '../index.es6';
import chai from 'chai';

const expect = chai.expect;

class AsyncPlugin extends Plugin {
    
    init () {
        return new Promise((resolve)=>setTimeout(()=>resolve(super.init()),20));
    }
    onSome_action1(){
        return new Promise((resolve)=>setTimeout(()=>resolve(1),20));
    }
}

const resources={
    string:{
        s1:'S1'
    }
}

const config={
    plugins:[
        {
            type:AsyncPlugin
        }
        ,
        LoggerPlugin,
        StoragePlugin,
        ,{
            type: ResourcesPlugin,
            resources
        }
    ]
}

describe('Basic', function () {

    before(function(cb){
        
        create(config).init().then((app)=>{
            console.log('inited',app);
            cb();
        })
        
    });

    it('string', function (next) {
        
        const r = event('resource://string/s1').action();
    
        expect(r).to.equal('S1');
        next()

    });

    it('storage', function (next) {
        
        event('storage://set/s1',{data:{r:3}}).action();
        
        const r = event('storage://get/s1').action();
    
        expect(r.r).to.equal(3);
        next()

    });

    it('emit', function (next) {
        
        event('some://action1').emit((err, r)=>{
            console.log(err, r)
            //expect(err).not.ok();
            expect(r).to.equal(1);
            next()
        },{timeout:50})
        
    });
    
    after(function(){
    });
    
});
