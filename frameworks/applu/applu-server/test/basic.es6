import {create, Plugin, event} from 'applugins';
import {LoggerPlugin, DispatcherPlugin} from '../index.es6';
import MockExpressPlugin from './MockExpressPlugin.es6';
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

const config={
    plugins:[
        {
            type:AsyncPlugin
        }
        ,
        LoggerPlugin,
        MockExpressPlugin,
        DispatcherPlugin
 
    ]
}

describe('Basic', function () {

    before(function(cb){
        
        create(config).init().then((app)=>{
            console.log('inited',app);
            cb();
        })
        
    });

    it('emit', function (next) {
        
        event('request://send',{data:{path:'/some/action1'}}).emit((err, r)=>{
            console.log(err, r)
            //expect(err).not.ok();
            expect(r && r.result).to.equal(1);
            next()
        },{timeout:50})
        
    });
    
    after(function(){
    });
    
});
