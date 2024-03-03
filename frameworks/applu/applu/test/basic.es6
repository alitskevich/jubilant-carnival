import {create, Plugin, event, expect, expectError,expectOk, EVENT, CB_SYNC} from './infra.es6';

const _R ={}
event.on('log://*',(uri)=>(console.log(uri.hash),uri));
event.on('resource://get',(uri)=>_R[uri.path[0]]);
event.on('resource://string',({path:[key]})=>_R[key]||key);
event.on('resource://add',({data})=>Object.keys(data).map((key)=>_R[key]=data[key]));

class AsyncPlugin extends Plugin {
    
    init () {
        return new Promise((resolve)=>setTimeout(()=>resolve(super.init()),20));
    }
    
    onAsync_action(){
        return new Promise((resolve)=>setTimeout(()=>resolve('ok'),20));
    }
}

class ThePlugin extends Plugin {
    
    init () {
        super.init();
    }
    
    onThe_action(){
        
        return this.config.value
    }
    
    onThe_string(){
        
        return this.string('_ok')
    }
}

const config={
    plugins:[{
        type:AsyncPlugin
    }
    ,
    {
        type:ThePlugin,
        value:'ok',
        resources:{
            _ok:'ok'
        }
    }
    ]
}

describe('Basic', function () {


    it('create-app', function (next) {
        
        create(config).init().then((app)=>{
            
            console.log('inited',app, _R);
           
            expect(app).to.be.an('object');
            
            next()
            
        }).catch(::console.log)
       

    });

    it('action', function (next) {
        
        const r = event('the://action').action();
    
        expectOk(r);
        
        next()

    });

    it('emit', function (next) {
        
        event('async://action').emit((err, [r])=>{
            console.log(err, r)
            
            expectOk(r);
            
            next()
        },{timeout:50})
        
    });
    
    it('string', function (next) {
        
        event('the://string').action((err, r)=>{
            console.log(err, r)
            
            expectOk(r);
            
            next()
        },{timeout:50})
        
    });
    
    after(function(){
    });
    
});
