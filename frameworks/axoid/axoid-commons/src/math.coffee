###
Math.
@mixin
###
Object.math =

    # adjust decimal numer
    decimalAdjust: (type, value, exp) ->

      # If the exp is undefined or zerObject...
      return Math[type](value)  if typeof exp is "undefined" or +exp is 0
      value = +value
      exp = +exp

      # If the value is not a number or the exp is not an integer...
      return NaN  if isNaN(value) or not (typeof exp is "number" and exp % 1 is 0)

      # Shift
      value = value.toString().split("e")
      value = Math[type](+(value[0] + "e" + ((if value[1] then (+value[1] - exp) else -exp))))

      # Shift back
      value = value.toString().split("e")
      + (value[0] + "e" + ((if value[1] then (+value[1] + exp) else exp)))

    # round number 
    round: (value, exp=0) -> @decimalAdjust "round", value, exp

    # @return uuid string
    uuid: ->
        d = Date.now()
        'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) ->
            r = (d + Math.random()*16)%16 | 0
            d = Math.floor(d/16)
            (if c is 'x' then r else (r&0x7|0x8)).toString(16)
        )

    # sort given {#a}rray in {#dir}ection using {#getter} for criteria
    sort: (a, key, dir) ->
        dir = 1 unless dir
        rdir = dir * -1
        getter = if typeof key is "string" then (s) -> s?[key] else key or (s)-> s
        a.sort (s1, s2) ->
            if (v1 = getter(s1)) > (v2 = getter(s2)) then dir else (if v1 < v2 then rdir else 0)
