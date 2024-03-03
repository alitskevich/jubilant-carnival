
var __CNT=1;

function async(cb) {
    var i = __CNT++;
    setTimeout(function(){
        cb(null, 'ok'+i)
    },(Math.random()+1)*100);
}

var assert = function (s, a1, a2) {

    var ok = a1===a2;

    document.body.innerHTML += ('<p style="margin-left:20px;"><span style="color:'+(ok?'green':'red')+'">['+(ok?'OK':('Fail: '+a1+' != '+a2)) +']</span><code>'+s+'</code></p>')
    if (!ok) {
        console.log (s, 'No: ',a1,' != ',a2);
    }
};

