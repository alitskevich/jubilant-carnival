/**
 *==========================================================================
 * Axio: Working with Dates.
 *==========================================================================
 */
    
(function(MAXD, CURR) {

    var _nn = String.to0N = function(s) {
        
        return s && (s = '' + s) && ((s.length < 2) ? ('0' + s) : s) || '00';
        
    }
    
    Date.PATTERN_PARSE = 'yyyyMMdd';
    Date.PATTERN_FORMAT = 'dd MMM yyyy';

    // @return zero-based month index
    Date.daysInMonth =  function(m, y) {
        
        return ((m === 1) && ((y % 4) === 0) ? 1 : 0) + MAXD[m];
        
    };

    // @return current time zone
    Date.getTimeZone = function() {
        
        var l = -CURR.getTimezoneOffset(), t = '' + Math.abs(l / 60), m = '' + Math.abs(l % 60);
        
        return "GMT"+ (((l == 0) && '') || ("%2" + (l > 0 ? "B" : "D") + _nn(t)+ ':' + _nn(m)));
        
    };

    Date.parse = function(s, pattern) {
        
        if (!s) {
            return null;
        }
        
        if (s instanceof Date) {
            return s;
        }
        
        var d = new Date();
        d.setDate(1);
        
        var r = '' + (pattern || Date.PATTERN_PARSE), p;
        
        if ((p = r.indexOf('yyyy')) > -1) {
            d.setFullYear(s.substr(p, 4));
        } else if ((p = r.indexOf('yy')) > -1) {
            d.setFullYear(2000 + s.substr(p, 2));
        }
        
        if ((p = r.indexOf('MM')) > -1) {
            d.setMonth(Number(s.substr(p, 2)) - 1);
        }
        
        if ((p = r.indexOf('dd')) > -1) {
            d.setDate(Number(s.substr(p, 2)));
        }
        
        d.setHours(((p = r.indexOf('HH')) > -1)?s.substr(p, 2):12);
        d.setMinutes(((p = r.indexOf('mm')) > -1)?s.substr(p, 2):0);
        d.setSeconds(((p = r.indexOf('ss')) > -1)?s.substr(p, 2):0);
        
        return d;
    };

    Date.shifted = function(d, lag) {
        var r = new Date();
        
        r.setTime((d||r).getTime() + ((lag || 0) * 86400000));
        
        return r;
    };

    Date.days = function(d) {
        
        return (d && d.getTime) ? (d= d.getTime(), (d-d%86400000)/86400000) : 0;
        
    };

    Date.compare = function(x, y) {
        
        return (x && y) ? ((x.getTime && y.getTime) ? (x.getTime() > y.getTime() ? 1 : -1) : 0) : ((!x && !y)? 0 :(!!x?1:-1))  ;
    
    };

    Date.monthName = function(m, lang, id) {
        
        return String.localize.withLanguage(lang || String.LANGUAGE, id||'MONTH')['' + _nn(m + 1)];
        
    };

    Date.format = function(d, pattern, lng) {
        
        var r = '' 
        
        if (d && d.getFullYear) {
            r += (pattern || Date.PATTERN_FORMAT);
            r = r.replace('yyyy', '' + d.getFullYear());
            r = r.replace('yy', '' + d.getFullYear());
            r = r.replace('MMMM', Date.monthName(d.getMonth(), lng));
            r = r.replace('MMM', Date.monthName(d.getMonth(), lng, 'MONTH_SHORT'));
            r = r.replace('MM', _nn(d.getMonth() + 1));
            r = r.replace('dd', _nn(d.getDate()));
            r = r.replace('hh', _nn(d.getHours()));
            r = r.replace('mm', _nn(d.getMinutes()));
            r = r.replace('ss', _nn(d.getSeconds()));
        }
        
        return r;
    };
            
    String.localize.put('DOW',{
        "1" : "Su",
        "2" : "Mo",
        "3" : "Tu",
        "4" : "We",
        "5" : "Th",
        "6" : "Fr",
        "7" : "Sa"
    },'en');
    String.localize.put('MONTH_SHORT',{
        "01" : "Jan",
        "02" : "Feb",
        "03" : "Mar",
        "04" : "Apr",
        "05" : "May",
        "06" : "Jun",
        "07" : "Jul",
        "08" : "Aug",
        "09" : "Sep",
        "10" : "Oct",
        "11" : "Nov",
        "12" : "Dec"
    },'en');
    String.localize.put('MONTH',{
        "01" : "January",
        "02" : "February",
        "03" : "March",
        "04" : "April",
        "05" : "May",
        "06" : "June",
        "07" : "July",
        "08" : "August",
        "09" : "September",
        "10" : "October",
        "11" : "November",
        "12" : "December"
    },'en');


})(
    [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31, 31 ]
    , new Date()
    );
            

    

