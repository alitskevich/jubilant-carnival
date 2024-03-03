/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


// 
// Animates something.
// 
// ev = {
//      duration: time to do along,
//      interpolator : argument interpolator
//      callback : animation action repeated
//      onEnd: some callback executed after animation
//  }
// 
(function(ev){
    var O=Object, timerId=0, stack= [],
    
    _runOne= (function (ev) {
        ev.callback(ev.interpolator(ev.value),ev.value, ev);
        if (--ev.__counter) {
            ev.value+=ev.lag;
            this.push(ev);
        } else {
            ev.onEnd && ev.onEnd();
        }
    }).iterator()
    ,
    _run=function () {
        _runOne(stack, stack=[]);
        if (!stack.length){
            clearTimeout(timerId);
            timerId = 0;
        }
    };
    
    O.animate= function(ev) {
        if (!timerId){
            timerId = setInterval(_run,20);
        }
        ev = O.update({
            duration:1000, 
            interpolator:Function.NONE
        },ev);
        ev.__counter = Math.round(ev.duration/20);
        ev.value= 0;
        ev.lag = 1/ev.__counter;
        stack.push(ev)
    };
    
    O.animate.linear= function(x0, x1, px) {
        x1 = new Number(x1).valueOf();
        x0 = new Number(x0).valueOf();
        return function(x){
            return x0+(x1-x0)*x + (px||0);
        }
    }

})();
