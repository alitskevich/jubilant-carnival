/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	// main registry

	// Cache.coffee
	__webpack_require__(2);

	// date.coffee
	__webpack_require__(7);

	// EventHandler.coffee
	__webpack_require__(3);

	// l10n.coffee
	__webpack_require__(8);

	// math.coffee
	__webpack_require__(9);

	// properties.coffee
	__webpack_require__(10);

	// PropertyPlugins.coffee
	__webpack_require__(4);

	// PropertyRequires.coffee
	__webpack_require__(5);

	// PropertyValues.coffee
	__webpack_require__(6);

	// templating.coffee
	__webpack_require__(11);

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	 * Defines [Cache] entity type that provides caching feature.
	 * @options
	 *   version
	 *   uriPatterm
	 *   storage
	 */
	Object.emit({
	  uri: "axoid://define/EventHandler/Cache",
	  uriPattern: 'remote://{{host}}/{{path}}?_ver={{version}}',
	  methods: function(_super) {
	    var CACHE;
	    CACHE = {};
	    return {
	      resolveUri: function(u) {
	        u = Object.clone(u, u.params);
	        u.path = u.path.join('/');
	        if (!u.version) {
	          u.version = this.getVersion();
	        }
	        return Object.Uri.parse(String.template(this.uriPattern, u));
	      },
	      cacheDeserializer: function(s) {
	        if (!s) {
	          return null;
	        }
	        if (typeof s === "object") {
	          return s;
	        } else {
	          return Object.parse(s);
	        }
	      },
	      cacheSerializer: function(s) {
	        if (!s) {
	          return null;
	        }
	        s = typeof s === "object" ? JSON.stringify(s) : s;
	        if (s && s !== "{}") {
	          return s;
	        } else {
	          return null;
	        }
	      },
	      getVersion: function() {
	        return '' + (this.version || 1);
	      },
	      fetch: function(uri, cb) {
	        return Object.emit({
	          uri: this.resolveUri(uri),
	          callback: cb,
	          unmarshaller: this.fetchUnmarshaller
	        });
	      },
	      restore: function(key) {
	        var ref, s, ver;
	        if (!(s = (ref = this.storage) != null ? ref[key] : void 0)) {
	          return null;
	        }
	        ver = this.getVersion();
	        if (ver === s.slice(0, +(ver.length - 1) + 1 || 9e9)) {
	          return s.slice(ver.length + 1);
	        } else {
	          return null;
	        }
	      },
	      store: function(key, s) {
	        var ref;
	        try {
	          return (ref = this.storage) != null ? ref.setItem(key, this.getVersion() + ":" + s) : void 0;
	        } catch (_error) {}
	      },
	      dispatchEvent: function(ev) {
	        var key, r, u;
	        u = ev.uri;
	        key = this.id + ':' + u.id;
	        if ((r = CACHE[key] || (CACHE[key] = this.cacheDeserializer(this.restore(key))))) {
	          return ev.callback(null, r);
	        }
	        return this.fetch(u, (function(_this) {
	          return function(err, data) {
	            var s;
	            if ((err = (typeof s !== "undefined" && s !== null ? s.error : void 0) || err)) {
	              err = _this.error(err, "fetch data for versioned cache");
	            }
	            if (!err && (s = _this.cacheSerializer(data))) {
	              CACHE[key] = data = _this.cacheDeserializer(s);
	              _this.store(key, s);
	            }
	            return ev.callback(err, data);
	          };
	        })(this));
	      }
	    };
	  }
	});


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	 * Defines [EventHandler] entity type that provides featured event handling.
	 * @param readyForEventsExpression [Expression]
	 */
	Object.emit({
	  uri: "axoid://define/EventHandler",
	  properties: ['readyForEvents'],
	  readyForEventsExpression: 'true',
	  methods: function(_super) {
	    return {
	      listenEvents: function() {},
	      readyForEventsChanged: function(ready) {
	        if (ready) {
	          return _super.listenEvents.call(this);
	        }
	      },
	      resolveOperationId: function(ev) {
	        var key, opId;
	        if ((key = ev.uri.host) && key !== '*' && this[opId = 'on' + String.capitalize(key) + 'Event']) {
	          return opId;
	        }
	        if (this[opId = (ev.method || 'get') + String.capitalize(ev.uri.path[0] || 'default')]) {
	          return opId;
	        }
	        return null;
	      },
	      onEvent: function(ev) {
	        ev.uri = Object.Uri.parse(ev.uri);
	        return this.dispatchEvent(ev);
	      },
	      dispatchEvent: function(ev) {
	        var ex, opId;
	        if (!(opId = this.resolveOperationId(ev))) {
	          return typeof ev.callback === "function" ? ev.callback(this.error(new Error("not-found: Operation not found: " + ev.uri))) : void 0;
	        }
	        try {
	          return this[opId](ev);
	        } catch (_error) {
	          ex = _error;
	          Object.log.error("bad: Error in event handler " + this + "." + opId, ex);
	          return typeof ev.callback === "function" ? ev.callback(ex) : void 0;
	        }
	      }
	    };
	  }
	});


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	Object.emit({
	  uri: "axoid://define/Property/Plugins",
	  mixin: function(_super) {
	    return {
	      launch: function(cb) {
	        return Function.perform(this, function(flow) {
	          return [
	            function() {
	              var j, len, meta, ref;
	              if (this.plugins) {
	                ref = this.plugins;
	                for (j = 0, len = ref.length; j < len; j++) {
	                  meta = ref[j];
	                  Object.emit(Object.clone(meta, {
	                    _parent: this,
	                    uri: "axoid://create",
	                    callback: flow.wait()
	                  }));
	                }
	              }
	              return flow.next();
	            }, function(err, plugins) {
	              var e, i, id, j, len, p, ref;
	              if (err) {
	                this.error(err, this + ".onPluginsInitializing");
	              }
	              this.plugins = (function() {
	                var j, len, results;
	                results = [];
	                for (i = j = 0, len = arguments.length; j < len; i = ++j) {
	                  e = arguments[i];
	                  if (i > 1) {
	                    results.push(e);
	                  }
	                }
	                return results;
	              }).apply(this, arguments);
	              ref = this.plugins;
	              for (j = 0, len = ref.length; j < len; j++) {
	                p = ref[j];
	                if (id = p.id) {
	                  this[id] = p;
	                }
	              }
	              return _super.launch.call(this, cb);
	            }
	          ];
	        });
	      },
	      done: function() {
	        var j, len, p, ref, results;
	        _super.done.call(this);
	        if (this.plugins) {
	          ref = this.plugins;
	          results = [];
	          for (j = 0, len = ref.length; j < len; j++) {
	            p = ref[j];
	            p.done();
	            p._parent = null;
	            if (p.id) {
	              results.push(this[p.id] = null);
	            } else {
	              results.push(void 0);
	            }
	          }
	          return results;
	        }
	      }
	    };
	  }
	});


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	Object.emit({
	  uri: 'axoid://define/Property/Requires',
	  mixin: function(_super) {
	    return {
	      launch: function(cb) {
	        return Object.emit({
	          uri: 'axoid://require',
	          dependencies: this.requires,
	          callback: (function(_this) {
	            return function(err) {
	              var e;
	              if (typeof _this.onRequiredLoaded === "function") {
	                _this.onRequiredLoaded.apply(_this, (function() {
	                  var i, len, results;
	                  results = [];
	                  for (i = 0, len = arguments.length; i < len; i++) {
	                    e = arguments[i];
	                    results.push(e);
	                  }
	                  return results;
	                }).apply(_this, arguments));
	              }
	              return _super.launch.call(_this, cb);
	            };
	          })(this)
	        });
	      }
	    };
	  }
	});


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
	  hasProp = {}.hasOwnProperty;

	Object.emit({
	  uri: "axoid://define/Property/Value",
	  mixin: function(_super) {
	    return {
	      getValue: function() {
	        return this.prop("value");
	      },
	      setValue: function(v) {
	        return this.prop("value", v);
	      },
	      isEmptyValue: function(e) {
	        return !this.getValue();
	      },
	      equalsToValue: function(v) {
	        return v && (this.getValue() === ("" + v));
	      }
	    };
	  }
	});

	Object.emit({
	  uri: "axoid://define/Property/MultiValue",
	  mixin: function(_super) {
	    return {
	      valueChanged: function(v) {
	        this.prop("mvalue", (v ? (v.split && v.length ? v.split(this.mvalueSeparator || ",") : ["" + v]) : []));
	        _super.valueChanged.apply(this, arguments);
	      },
	      getMultiValue: function() {
	        return this.mvalue || [];
	      },
	      equalsValue: function(v) {
	        var ref;
	        return v && (ref = "" + v, indexOf.call(this.getMultiValue(), ref) >= 0);
	      },
	      putIntoMultiValue: function(pk, v) {
	        var changed, contained, i, j, len, mv;
	        if (!pk) {
	          return;
	        }
	        mv = this.getMultiValue();
	        pk = "" + pk;
	        contained = indexOf.call(mv, pk) >= 0;
	        changed = false;
	        if (v === -1) {
	          v = (contained ? 0 : 1);
	        }
	        if (v && !contained) {
	          mv.push(pk);
	          changed = true;
	        }
	        if ((!v) && contained) {
	          for (i = j = 0, len = mv.length; j < len; i = ++j) {
	            pk = mv[i];
	            if (pk === mv[i]) {
	              mv.splice(i, 1);
	              changed = true;
	              break;
	            }
	          }
	        }
	        return changed && this.setValue(mv.sort().join(this.mvalueSeparator));
	      }
	    };
	  }
	});


	/*
	 * Defines [Values] property that is a values bundle.
	 */

	Object.emit({
	  uri: "axoid://define/Property/Values",
	  methods: function() {
	    return {
	      comparator: function() {
	        return false;
	      }
	    };
	  },
	  mixin: function(_super, property) {
	    return {
	      prop: function(key, value, opts) {
	        var isRegisteredProperty, ref;
	        if (this.isDone) {
	          return null;
	        }
	        isRegisteredProperty = this.constructor.properties[key.slice(-3) === 'Uri' ? key.slice(0, -3) : key];
	        if (arguments.length === 1) {
	          return (isRegisteredProperty ? _super.prop.call(this, key) : (ref = this.value) != null ? ref[key] : void 0);
	        }
	        if (isRegisteredProperty) {
	          return _super.prop.call(this, key, (key === 'value' ? Object.clone(value) : value), opts);
	        } else {
	          if (!this.value) {
	            this.value = {};
	          }
	          if (this.value[key] !== value) {
	            this.value[key] = value;
	            return this.propertyChanged.call(this, {
	              entity: this,
	              propId: key,
	              value: value,
	              oldValue: this.value[key]
	            });
	          }
	        }
	      },
	      propertyChanged: function(ev) {
	        var isRegisteredProperty, key, olds, p, ref, ref1, v;
	        _super.propertyChanged.call(this, ev);
	        key = ev.propId;
	        if (key === 'valueUri') {
	          return;
	        }
	        if (key === 'value') {
	          olds = ev.oldValue;
	          if (olds) {
	            for (p in olds) {
	              if (!hasProp.call(olds, p)) continue;
	              v = olds[p];
	              if (((ref = ev.value) != null ? ref[p] : void 0) === void 0) {
	                _super.propertyChanged.call(this, {
	                  entity: this,
	                  propId: p === 'value' ? 'valueValue' : p,
	                  value: null,
	                  oldValue: v
	                });
	              }
	            }
	          }
	          if (ev.value) {
	            ref1 = ev.value;
	            for (p in ref1) {
	              if (!hasProp.call(ref1, p)) continue;
	              v = ref1[p];
	              if (v !== (olds != null ? olds[p] : void 0)) {
	                _super.propertyChanged.call(this, {
	                  entity: this,
	                  propId: p === 'value' ? 'valueValue' : p,
	                  value: v,
	                  oldValue: olds != null ? olds[p] : void 0
	                });
	              }
	            }
	          }
	        } else {
	          if (!(isRegisteredProperty = this.constructor.properties[key.slice(-3) === 'Uri' ? key.slice(0, -3) : key])) {
	            _super.propertyChanged.call(this, {
	              entity: this,
	              propId: 'value',
	              value: this.value,
	              oldValue: this.value
	            });
	          }
	        }
	        return ev;
	      }
	    };
	  }
	});


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	Dates.
	 */
	(function(MAXD, CURR) {
	  var _nn;
	  _nn = function(s) {
	    return s && (s = "" + s) && (s.length < 2 ? "0" + s : s) || "00";
	  };
	  Date.PATTERN_PARSE = "yyyy-MM-dd";
	  Date.PATTERN_FORMAT = "dd MMM yyyy";
	  Date.daysInMonth = function(m, y) {
	    return ((m === 1) && ((y % 4) === 0) ? 1 : 0) + MAXD[m];
	  };
	  Date.getTimeZone = function() {
	    var l, m, t;
	    l = -CURR.getTimezoneOffset();
	    t = "" + Math.abs(l / 60);
	    m = "" + Math.abs(l % 60);
	    return "GMT" + (((l === 0) && "") || ("%2" + (l > 0 ? "B" : "D") + _nn(t) + ":" + _nn(m)));
	  };
	  Date.parse = function(s, pattern) {
	    var d, p, r;
	    if (pattern == null) {
	      pattern = Date.PATTERN_PARSE;
	    }
	    if (!s) {
	      return null;
	    }
	    if (s instanceof Date) {
	      return s;
	    }
	    d = new Date();
	    d.setDate(1);
	    d.setHours(12);
	    d.setMinutes(0);
	    d.setSeconds(0);
	    r = "" + pattern;
	    if ((p = r.indexOf("yyyy")) > -1) {
	      d.setFullYear(s.substr(p, 4));
	    } else {
	      if ((p = r.indexOf("yy")) > -1) {
	        d.setFullYear(2000 + s.substr(p, 2));
	      }
	    }
	    if ((p = r.indexOf("MM")) > -1) {
	      d.setMonth(+s.substr(p, 2) - 1);
	    }
	    if ((p = r.indexOf("dd")) > -1) {
	      d.setDate(+s.substr(p, 2));
	    }
	    if ((p = r.indexOf("HH")) > -1) {
	      d.setHours(+s.substr(p, 2));
	      if ((p = r.indexOf("mm")) > -1) {
	        d.setMinutes(+s.substr(p, 2));
	      }
	      if ((p = r.indexOf("ss")) > -1) {
	        d.setSeconds(+s.substr(p, 2));
	      }
	    }
	    return d;
	  };
	  Date.shift = function(d, lag) {
	    var r;
	    r = new Date();
	    r.setTime((d || r).getTime() + ((lag || 0) * 86400000));
	    return r;
	  };
	  Date.days = function(d) {
	    if (!(d && d.getTime)) {
	      return 0;
	    }
	    d = d.getTime();
	    return (d - d % 86400000) / 86400000;
	  };
	  Date.compare = function(x, y) {
	    if (x && y) {
	      if (x.getTime && y.getTime) {
	        if (x.getTime() > y.getTime()) {
	          return 1;
	        } else {
	          return -1;
	        }
	      } else {
	        return 0;
	      }
	    } else {
	      if (!x && !y) {
	        return 0;
	      } else {
	        if (!!x) {
	          return 1;
	        } else {
	          return -1;
	        }
	      }
	    }
	  };
	  Date.monthName = function(m, lang, key) {
	    var ref;
	    if (key == null) {
	      key = "MONTH";
	    }
	    return (ref = String.localize.get(key, lang)) != null ? ref[_nn(m + 1)] : void 0;
	  };
	  return Date.format = function(d, pattern, lng) {
	    var r;
	    if (pattern == null) {
	      pattern = Date.PATTERN_FORMAT;
	    }
	    r = "";
	    if (d && d.getFullYear) {
	      r += pattern || Date.PATTERN_FORMAT;
	      r = r.replace("yyyy", "" + d.getFullYear());
	      r = r.replace("yy", "" + d.getFullYear());
	      r = r.replace("MMMM", Date.monthName(d.getMonth(), lng));
	      r = r.replace("MMM", Date.monthName(d.getMonth(), lng, "MONTH_SHORT"));
	      r = r.replace("MM", _nn(d.getMonth() + 1));
	      r = r.replace("dd", _nn(d.getDate()));
	      r = r.replace("hh", _nn(d.getHours()));
	      r = r.replace("mm", _nn(d.getMinutes()));
	      r = r.replace("ss", _nn(d.getSeconds()));
	    }
	    return r;
	  };
	})([31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31, 31], new Date());


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	String.LANGUAGE = 'en';

	String.localize = (function(_cache) {
	  var $;
	  $ = function(s, l) {
	    var ref;
	    if (l == null) {
	      l = String.LANGUAGE;
	    }
	    if (s) {
	      return ((ref = _cache[l]) != null ? ref[s] : void 0) || String.capitalize(String.camelize(s));
	    } else {
	      return "";
	    }
	  };
	  $.get = function(s, l) {
	    var ref;
	    if (l == null) {
	      l = String.LANGUAGE;
	    }
	    if (s) {
	      return ((ref = _cache[l]) != null ? ref[s] : void 0) || null;
	    } else {
	      return null;
	    }
	  };
	  $.add = function(l, delta) {
	    if (arguments.length === 1) {
	      (delta = l) && (l = null);
	    }
	    if (!l) {
	      l = String.LANGUAGE;
	    }
	    return Object.update(_cache[l] || (_cache[l] = {}), delta);
	  };
	  $.asEnum = function(s, l) {
	    var id, k, r, results, v;
	    if (!(r = this.get(s, l))) {
	      return null;
	    }
	    results = [];
	    for (k in r) {
	      v = r[k];
	      if (id = +k || k) {
	        if (typeof v === 'object') {
	          v.id = id;
	          results.push(v);
	        } else {
	          results.push({
	            id: id,
	            name: '' + v
	          });
	        }
	      }
	    }
	    return results;
	  };
	  return $;
	})({});

	String.localize.add("en", {
	  "DOW": {
	    '1': "Su",
	    '2': "Mo",
	    '3': "Tu",
	    '4': "We",
	    '5': "Th",
	    '6': "Fr",
	    '7': "Sa"
	  },
	  "MONTH_SHORT": {
	    '01': "Jan",
	    '02': "Feb",
	    '03': "Mar",
	    '04': "Apr",
	    '05': "May",
	    '06': "Jun",
	    '07': "Jul",
	    '08': "Aug",
	    '09': "Sep",
	    '10': "Oct",
	    '11': "Nov",
	    '12': "Dec"
	  },
	  "MONTH": {
	    '01': "January",
	    '02': "February",
	    '03': "March",
	    '04': "April",
	    '05': "May",
	    '06': "June",
	    '07': "July",
	    '08': "August",
	    '09': "September",
	    '10': "October",
	    '11': "November",
	    '12': "December"
	  }
	});

	Object.emit({
	  uri: "axoid://define/L10nService/EnumService",
	  methods: function(_super) {
	    var CACHE;
	    CACHE = {};
	    return {
	      onEvent: function(ev, u, key) {
	        var r;
	        if (u == null) {
	          u = ev.uri;
	        }
	        if (key == null) {
	          key = u.host;
	        }
	        if (r = CACHE[key]) {
	          return ev.callback(null, r);
	        }
	        if (!(r = String.localize.asEnum(key))) {
	          return ev.callback("not-found: enum [" + key + "]");
	        }
	        return ev.callback(null, CACHE[key] = r);
	      }
	    };
	  }
	});

	Object.emit({
	  uri: "axoid://define/L10nService",
	  properties: ["requires:Requires"],
	  methods: function(_super) {
	    return {
	      onRequiredLoaded: function(err) {
	        var b, i, len, results;
	        if (err) {
	          return;
	        }
	        results = [];
	        for (i = 0, len = arguments.length; i < len; i++) {
	          b = arguments[i];
	          if (b) {
	            results.push(String.localize.add(b));
	          }
	        }
	        return results;
	      },
	      onEvent: function(ev) {
	        return ev.callback(null, String.localize(ev.uri.host));
	      }
	    };
	  }
	});


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	Math.
	@mixin
	 */
	Object.math = {
	  decimalAdjust: function(type, value, exp) {
	    if (typeof exp === "undefined" || +exp === 0) {
	      return Math[type](value);
	    }
	    value = +value;
	    exp = +exp;
	    if (isNaN(value) || !(typeof exp === "number" && exp % 1 === 0)) {
	      return NaN;
	    }
	    value = value.toString().split("e");
	    value = Math[type](+(value[0] + "e" + (value[1] ? +value[1] - exp : -exp)));
	    value = value.toString().split("e");
	    return +(value[0] + "e" + (value[1] ? +value[1] + exp : exp));
	  },
	  round: function(value, exp) {
	    if (exp == null) {
	      exp = 0;
	    }
	    return this.decimalAdjust("round", value, exp);
	  },
	  uuid: function() {
	    var d;
	    d = Date.now();
	    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	      var r;
	      r = (d + Math.random() * 16) % 16 | 0;
	      d = Math.floor(d / 16);
	      return (c === 'x' ? r : r & 0x7 | 0x8).toString(16);
	    });
	  },
	  sort: function(a, key, dir) {
	    var getter, rdir;
	    if (!dir) {
	      dir = 1;
	    }
	    rdir = dir * -1;
	    getter = typeof key === "string" ? function(s) {
	      return s != null ? s[key] : void 0;
	    } : key || function(s) {
	      return s;
	    };
	    return a.sort(function(s1, s2) {
	      var v1, v2;
	      if ((v1 = getter(s1)) > (v2 = getter(s2))) {
	        return dir;
	      } else {
	        if (v1 < v2) {
	          return rdir;
	        } else {
	          return 0;
	        }
	      }
	    });
	  }
	};


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	 Very common properties.
	 */
	Object.emit({
	  uri: "axoid://define/Property/Liquid",
	  methods: function() {
	    return {
	      comparator: function() {
	        return false;
	      }
	    };
	  }
	});

	Object.emit({
	  uri: "axoid://define/Property/Boolean",
	  methods: function() {
	    return {
	      comparator: function(a, b) {
	        return (!a) === (!b);
	      },
	      setter: function(T, v, ev) {
	        return T[this.id] = !!v;
	      }
	    };
	  }
	});

	Object.emit({
	  uri: "axoid://define/Property/Uri",
	  methods: function() {
	    return {
	      comparator: function(a, b) {
	        return ('' + a) === ('' + b);
	      },
	      setter: function(T, v, ev) {
	        return T[this.id] = Object.Uri.parse(v);
	      }
	    };
	  }
	});

	Object.emit({
	  uri: "axoid://define/Property/Number",
	  methods: function() {
	    return {
	      comparator: function(a, b) {
	        return Number(a) === Number(b);
	      },
	      setter: function(T, v, ev) {
	        return T[this.id] = Number(v);
	      }
	    };
	  },
	  mixin: function(_super, prop) {
	    var propid, r;
	    r = {};
	    propid = prop.id;
	    r['increment' + String.capitalize(propid)] = function(delta) {
	      if (delta == null) {
	        delta = 1;
	      }
	      return this.prop(propid, ((this.prop(propid)) || 0) + delta);
	    };
	    return r;
	  }
	});

	Object.emit({
	  uri: "axoid://define/Property/Date",
	  methods: function() {
	    return {
	      comparator: function(a, b) {
	        return Date.compare(a, b) === 0;
	      }
	    };
	  }
	});


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	String.tokenize = function(s, re, op) {
	  var e, pastLastIndex, text;
	  if (s == null) {
	    s = '';
	  }
	  if (re == null) {
	    re = /\W/g;
	  }
	  pastLastIndex = 0;
	  while (e = re.exec(s)) {
	    if (e.index && (text = s.slice(pastLastIndex, +(e.index - 1) + 1 || 9e9))) {
	      op(text);
	    }
	    op(e[0], true);
	    pastLastIndex = re.lastIndex;
	  }
	  if ((text = s.slice(pastLastIndex))) {
	    return op(text);
	  }
	};

	String.template = (function() {
	  var $, encoder, fn, parse;
	  parse = function(s, x) {
	    var RE, e, lastIndex, r, r0, stack, tag, text;
	    r = {
	      tag: 'top',
	      children: []
	    };
	    stack = [];
	    lastIndex = 0;
	    RE = /{{([?\/:#]?)([a-zA-Z0-9\._]+)(\|[a-z]+)?}}/g;
	    while (e = RE.exec(s)) {
	      if (e.index && (text = s.slice(lastIndex, +(e.index - 1) + 1 || 9e9))) {
	        r.children.push({
	          tag: '_',
	          value: text
	        });
	      }
	      tag = e[2];
	      if ((e[1] === '?') || (e[1] === '#')) {
	        stack.unshift(r);
	        r.children.push(r0 = {
	          tag: tag,
	          children: [],
	          flag: e[1]
	        });
	        r = r0;
	      } else if (e[1] === '/') {
	        r = stack.shift();
	      } else if (e[1] === ':') {
	        r = r['_' + tag] = {
	          children: []
	        };
	      } else {
	        r.children.push({
	          tag: tag,
	          opts: e[3]
	        });
	      }
	      lastIndex = RE.lastIndex;
	    }
	    if (s = s.slice(lastIndex)) {
	      r.children.push({
	        tag: '_',
	        value: s
	      });
	    }
	    return r;
	  };
	  fn = function(node, obj) {
	    var e, j, k, k0, l, len, len1, len2, n, r, ref, tag, v, v0;
	    r = [];
	    if (node.children) {
	      ref = node.children;
	      for (j = 0, len = ref.length; j < len; j++) {
	        n = ref[j];
	        if ((tag = n.tag) === '_') {
	          r.push(n.value);
	        } else {
	          if ((v = tag === '.' ? obj : Object.prop(obj, tag))) {
	            if (Array.isArray(v)) {
	              if (v.length) {
	                if (n.flag === '?') {
	                  r.push(fn(n, obj));
	                } else {
	                  for (k = 0, len1 = v.length; k < len1; k++) {
	                    e = v[k];
	                    if (e) {
	                      r.push(fn(n, e));
	                    }
	                  }
	                }
	              } else {
	                if (n._else) {
	                  r.push(fn(n._else, n.flag === '?' ? obj : v));
	                }
	              }
	            } else {
	              r.push(fn(n, n.flag === '?' ? obj : v));
	            }
	          } else {
	            if (n.flag === '#') {
	              if (v) {
	                for (v0 = l = 0, len2 = v.length; l < len2; v0 = ++l) {
	                  k0 = v[v0];
	                  if (v0) {
	                    r.push(fn(n, {
	                      id: k0,
	                      value: v0
	                    }));
	                  }
	                }
	              }
	            } else {
	              if (n._else) {
	                r.push(fn(n._else, n.flag === '?' ? obj : v));
	              }
	            }
	          }
	        }
	      }
	    } else {
	      r.push($.writeValue(obj, r, node.opts));
	    }
	    return r.join('');
	  };
	  $ = function(s, obj) {
	    return fn(parse(s), obj);
	  };
	  $.filters = {
	    t: function(t) {
	      return String.localize(t);
	    },
	    d: function(d) {
	      return Date.format(d);
	    }
	  };
	  encoder = function(i) {
	    return '&#' + i.charCodeAt(0) + ';';
	  };
	  $.writeValue = function(obj, r, opts) {
	    var f, fn0, j, len;
	    if (opts) {
	      for (j = 0, len = opts.length; j < len; j++) {
	        f = opts[j];
	        if (fn0 = this.filters[f]) {
	          obj = fn0(obj);
	        }
	      }
	    }
	    r = '' + obj;
	    if (!(opts && opts.indexOf('u'))) {
	      r = r.replace(/[\u00A0-\u9999<>\&]/g, encoder);
	    }
	    return r;
	  };
	  return $;
	})();


/***/ }
/******/ ]);