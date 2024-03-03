/**
 * Created by Aliaksandr_Litskevic on 7/17/2015.
 */

class TheEntity extends Entity {


}


core.defineProperty({
    id:'binding'
    ,
    setup(proto){

    }
    ,
    init(T){

    }
    ,
    done(T){

    }
});

core.define({
    id:'binding'
    ,
    methods(_super){
        return {
            launch(){

                this.init();

                //listen for events of type equals `@id` if has onEvent()
                if (this.onEvent) {
                    this.listenEvents()
                }
                return this
            },
            init(){
                _super.init.call(this);


            },
            // invoked at property changes
            propertyChanged(ev) {
                _super.done.propertyChanged(this, ev);

                // notifies listeners
                IMPL.notifyPropertyChanged(ev);
            },
            done(){
                _super.done.call(this);

                // remove related
                IMPL.release(this.id);
            },
            // subscribe to listen events
            listenEvents() {
                //throw new Error `//{@} attempts to listen events, but has no explicit id`        if @id[0] is        '//'
                //throw new Error `No event id to listen` unless id
                IMPL.startListen(this);
            }

        }
    }
});

Object.emit = (uri, extraParams, payload) -> Object.uri(uri).updateParams(extraParams).setPayload(payload).emit();

// create a new Uri instance parsed from string
Object.uri = (s, params) => {

    const r = new Uri();

    if (params) r.updateParams(params);

    if (!s) return r;

    if (s.constructor === Uri) return r.assign(s);

    return r.parse(s);
};
