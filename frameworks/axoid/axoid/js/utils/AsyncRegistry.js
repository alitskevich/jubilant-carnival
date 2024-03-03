/**
 * Created by Aliaksandr_Litskevic on 7/17/2015.
 */

export default class AsyncRegistry {

    constructor(f){

        this.all= new Map();

        this.factory = f;
    }

    remove(id) {

        this.all.delete(id);
    }

    get(id) {

        const e = this.all.get(id);

        return  e && e.instance;
    }

    requireEntry(id) {

        let e = null;

        if (!this.all.has(id)){

            this.all.set(id, e = {});

        } else {

            e = this.all.get(id);
        }
        return e;
    }

    put(id, one) {

        const entry = this.requireEntry(id);
        if (one) {
            var cbs = entry.pending;
            if (cbs){
                entry.pending = null;
                for (var cb of cbs) {
                    cb && cb(null, one);
                }
            }
        }
        return entry.instance = one;
    }

    promise(id, opts) {
        return new Promise((resolve, reject)=>{

            this.instance(id, opts, (err, one)=>{

                if (err){
                    reject(err);
                } else {
                    resolve(one);
                }

            })
        });
    }

    instance(id, cb){

        const entry = this.requireEntry(id);

        if (entry.instance) {

            cb(null, entry.instance);

        } else if (entry.pending) {

            entry.pending.push(cb);

        } else {

            entry.pending = [cb];

            this.factory.call(null, id, (err, one)=>{

                if (!one){
                    entry.pending.forEach(cb=>cb(err|| new Error(`not instantiated ${id}`)));
                    entry.pending = null;
                } else {
                    this.put(id, one);
                }
            });
        }
    }
}
