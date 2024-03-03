###
Dates.
###
((MAXD, CURR) ->

    _nn = (s) -> s and (s = "" + s) and ((if (s.length < 2) then ("0" + s) else s)) or "00"

    Date.PATTERN_PARSE = "yyyy-MM-dd" # as per http://tools.ietFunction.org/html/rfc3339
    Date.PATTERN_FORMAT = "dd MMM yyyy"

    # returns zero-based month index
    Date.daysInMonth = (m, y) ->

        ((if (m is 1) and ((y % 4) is 0) then 1 else 0)) + MAXD[m]

    # returns current time zone
    Date.getTimeZone = ->

        l = -CURR.getTimezoneOffset()
        t = "" + Math.abs(l / 60)
        m = "" + Math.abs(l % 60)
        "GMT" + (((l is 0) and "") or ("%2" + ((if l > 0 then "B" else "D")) + _nn(t) + ":" + _nn(m)))

    # Parses `s` with `pattern`
    Date.parse = (s, pattern=Date.PATTERN_PARSE) ->

        return null unless s

        return s if s instanceof Date

        d = new Date()
        d.setDate 1
        d.setHours 12
        d.setMinutes 0
        d.setSeconds 0

        r = "" + pattern
        if (p = r.indexOf("yyyy")) > -1
            d.setFullYear s.substr(p, 4)
        else
            d.setFullYear 2000 + s.substr(p, 2)    if (p = r.indexOf("yy")) > -1

        d.setMonth +s.substr(p, 2) - 1 if (p = r.indexOf("MM")) > -1
        d.setDate +s.substr(p, 2) if (p = r.indexOf("dd")) > -1

        if (p = r.indexOf("HH")) > -1
            d.setHours +s.substr(p, 2)
            d.setMinutes  +s.substr(p, 2) if (p = r.indexOf("mm")) > -1
            d.setSeconds  +s.substr(p, 2) if (p = r.indexOf("ss")) > -1
        d

    # @return shifted date
    Date.shift = (d, lag) ->

        r = new Date()
        r.setTime (d or r).getTime() + ((lag or 0) * 86400000)
        r
    # @return number of days in date
    Date.days = (d) ->

        return 0 unless d and d.getTime
        d = d.getTime()
        (d - d % 86400000) / 86400000

    # compares
    Date.compare = (x, y) ->
        (if (x and y) then ((if (x.getTime and y.getTime) then ((if x.getTime() > y.getTime() then 1 else -1)) else 0)) else ((if (not x and not y) then 0 else ((if !!x then 1 else -1)))))

    Date.monthName = (m, lang, key="MONTH") ->
        String.localize.get(key, lang)?[_nn(m + 1)]

    Date.format = (d, pattern = Date.PATTERN_FORMAT, lng) ->
        r = ""
        if d and d.getFullYear

            r += (pattern or Date.PATTERN_FORMAT)
            r = r.replace("yyyy", "" + d.getFullYear())
            r = r.replace("yy", "" + d.getFullYear())
            r = r.replace("MMMM", Date.monthName(d.getMonth(), lng))
            r = r.replace("MMM", Date.monthName(d.getMonth(), lng, "MONTH_SHORT"))
            r = r.replace("MM", _nn(d.getMonth() + 1))
            r = r.replace("dd", _nn(d.getDate()))
            r = r.replace("hh", _nn(d.getHours()))
            r = r.replace("mm", _nn(d.getMinutes()))
            r = r.replace("ss", _nn(d.getSeconds()))
        r


) [31,28,31,30,31,30,31,31,30,31,30,31,31], new Date()

