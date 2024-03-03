import {Plugin,event} from 'applugins';

/**
 * The Express plugin.
 *
 *  - starts/stops a http server instance powered by Express.
 *  - adds Application.use() method
 *
 * @param viewsDir views Directory, 'views' by default.
 * @param viewEngine views Engine, 'jade' by default.
 * @param port http port, '8080' by default.
 * @param ipaddress http IP address, '127.0.0.1' by default.
 *
 */
export default class MockExpressPlugin extends Plugin {

    /**
     * Creates Express application. Adds use() method to the Application that allows other plugins to
     * handle requests.
     */
    constructor(config, app) {

        super(config, app);
        
        this.middleware = [];

        app.use = (mw)=>{
            this.middleware.push(mw)
        }

    }

    onRequest_send({data}, cb){
            this.log('send', data);
            let counter = -1;
            const req={...data};
            const res={
                send: (r)=>{ cb(null, r)}
                ,
                status:()=>res
            };
            const next = ()=>{
                if (++counter<this.middleware.length){
                    this.middleware[counter](req,res,next)
                }else {
                    cb(new Error('middleware exceed.'))
                }
            };
            next();
        }
}