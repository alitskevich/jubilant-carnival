/**
 * Created by Aliaksandr_Litskevic on 7/17/2015.
 */

const ALL = new AsyncRegistry((id)=> {
});
//if $(id)?.entity throw new Error (`Duplicate entity id //{id}`)
//$.instance(@id).entity = @

PropHandler = (function() {
    function PropHandler(parent, propId1, fn1) {
        var reg;
        this.parent = parent;
        this.propId = propId1;
        this.fn = fn1;
        reg = this.parent.handlers || (this.parent.handlers = {});
        (reg[this.propId] || (reg[this.propId] = [])).push(this);
    }

    PropHandler.prototype.handle = function(ev) {
        var ex;
        try {
            return this.fn.call(null, ev);
        } catch (_error) {
            ex = _error;
            return Object.log.error('bad-handler: ' + ('' + this.fn).replace(/\n+/g, '').slice(9, 151), ex);
        }
    };

    PropHandler.prototype.done = function() {
        var a, index;
        if ((a = this.parent.handlers[this.propId]) && ((index = a.indexOf(this)) > -1)) {
            a.splice(index, 1);
        }
        if (!a.length) {
            delete this.parent.handlers[this.propId];
        }
        return this.parent = this.fn = null;
    };

    return PropHandler;

})();

var Perceptor, r;
Perceptor = (function() {
    var PropHandler;



    function Perceptor(id1) {
        this.id = id1;
    }

    Perceptor.prototype.startListen = function(handler) {
        var dfrd, ev, i, len, results;
        this.handler = handler;
        if (dfrd = this.defered) {
            delete this.defered;
            Object.log("!!! Emit " + dfrd.length + " defered event(s) for [" + this.id + "] ");
            results = [];
            for (i = 0, len = dfrd.length; i < len; i++) {
                ev = dfrd[i];
                results.push(this.handler(ev));
            }
            return results;
        }
    };

    Perceptor.prototype.emit = function(ev) {
        if (this.handler) {
            return this.handler(ev);
        }
        (this.defered || (this.defered = [])).push(ev);
        return Object.log("!!! Defer event [" + this.id + "]");
    };

    Perceptor.prototype.registerRefered = function(h) {
        return (this.referedToMe || (this.referedToMe = [])).push(h);
    };

    Perceptor.prototype.addPropertyChangedHandler = function(propId, fn, targetId) {
        var h;
        h = new PropHandler(this, propId, fn);
        return $.instance(targetId).registerRefered(h);
    };

    Perceptor.prototype.notifyPropertyChanged = function(propId, ev) {
        var h, hh, i, len, ref, results;
        if (hh = (ref = this.handlers) != null ? ref[propId] : void 0) {
            results = [];
            for (i = 0, len = hh.length; i < len; i++) {
                h = hh[i];
                results.push(h != null ? h.handle(ev) : void 0);
            }
            return results;
        }
    };

    Perceptor.prototype.done = function() {
        var h, i, len, ref, results;
        this.handler = this.entity = null;
        if (this.referedToMe) {
            ref = this.referedToMe;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
                h = ref[i];
                results.push(h.done());
            }
            return results;
        }
    };

    return Perceptor;

})();

// @nodoc
var $;
$ = (function(ALL) {

    r = function(id) {
        return ALL[id];
    };
    r.instance = function(id) {
        return ALL[id] || (ALL[id] = new Perceptor(id));
    };
    r.release = function(id) {
        var e;
        if (e = ALL[id]) {
            delete ALL[id];
            e.done();
        }
        return e;
    };
    return r;
})({});
