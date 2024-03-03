(function() {
  Object.fire({
    uri: 'axoid://define/webclient.Application',
    properties: ['title', "plugins:Plugins"],
    doc: window.document,
    domNode: window.document.body,
    methods: function(_super) {
      return {
        init: function() {
          var node, _i, _len, _ref, _results;
          _super.init.call(this);
          _ref = this.domNode.querySelectorAll("[data-widget]");
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            node = _ref[_i];
            _results.push(Object.dom.initWidget({
              domNode: node
            }));
          }
          return _results;
        },
        titleChanged: function(v) {
          return this.doc.title = v;
        }
      };
    }
  });

}).call(this);

(function() {
  Object.fire({
    uri: "axoid://define/Cache/CodeLoader",
    uriPattern: 'remote://*/js/{{host}}.js?_ver={{version}}',
    methods: function(_super) {
      return {
        fetchUnmarshaller: function(s) {
          return s;
        },
        cacheSerializer: function(s) {
          return this.evaluate(s);
        },
        cacheDeserializer: function(s) {
          return this.evaluate(s);
        },
        evaluate: function(s) {
          var ex;
          if (!s) {
            return null;
          }
          try {
            (Function.call(Function, s))();
          } catch (_error) {
            ex = _error;
            this.error(ex, "JS syntax:" + ex.message).log();
          }
          return s;
        }
      };
    }
  });

}).call(this);

(function() {
  Object.fire({
    uri: "axoid://define/CodeLoader/EntityLoader",
    methods: function(_super) {
      return {
        resolveUri: function(uri) {
          uri.host = uri.host.replace(/\./g, '/');
          return _super.resolveUri.call(this, uri);
        }
      };
    }
  });

}).call(this);

(function() {
  Object.fire({
    uri: "axoid://define/ScriptService/EntityService",
    scriptType: "text/javascript",
    methods: function(_super) {
      return {
        resolveUri: function(uri, ev) {
          uri.path = ('js/' + uri.host.replace(/\./g, '/') + '.js').split('/');
          uri.host = "";
          return _super.resolveUri.call(this, uri, ev);
        }
      };
    }
  });

}).call(this);

(function() {
  Object.fire({
    uri: "axoid://define/webclient.HashNavigator",
    properties: ["value:Values"],
    methods: function(_super) {
      var _loc, _toValue;
      _loc = window.location;
      _toValue = function(h) {
        var e, hashes, i, v, _i, _len;
        if (!h || h === '#') {
          h = '#!';
        }
        v = {
          page: ''
        };
        if (h[1] === '!') {
          hashes = h.slice(2).split('/');
          v.page = hashes[0];
          for (i = _i = 0, _len = hashes.length; _i < _len; i = ++_i) {
            e = hashes[i];
            if (i > 0) {
              v["index" + (i - 1 || '')] = e || "";
            }
          }
        }
        return v;
      };
      return {
        init: function() {
          this.value = _toValue(_loc.hash);
          _super.init.call(this);
          return window.onhashchange = (function(_this) {
            return function() {
              return _this.prop('value', _toValue(_loc.hash));
            };
          })(this);
        },
        valueChanged: function(v) {
          var e, h, i;
          if (!v) {
            return;
          }
          h = [];
          e = v.page;
          i = 0;
          while (e) {
            h.push(e);
            e = v["index" + (i || '')];
            i++;
          }
          if ((h = "#!" + (h.join('/'))) !== _loc.hash) {
            return _loc.hash = h;
          }
        }
      };
    }
  });

}).call(this);

(function() {
  Object.fire({
    uri: "axoid://define/Cache/HtmlLoader",
    uriPattern: 'remote://*/html/{{host}}.html',
    methods: function(_super) {
      return {
        init: function() {
          this.storage = this.createStorage();
          return _super.init.call(this);
        },
        createStorage: function() {
          return this.storage || {
            getItem: function(key) {
              return this[key];
            },
            setItem: function(key, value) {
              return this[key] = value;
            }
          };
        },
        cacheDeserializer: function(s) {
          return s;
        },
        cacheSerializer: function(s) {
          return s;
        }
      };
    }
  });

}).call(this);

(function() {
  Object.fire({
    uri: "axoid://define/EventHandler/HttpService",
    defaultHost: window.location.hostname + (window.location.port ? ":" + window.location.port : ''),
    defaultProtocol: window.location.protocol.slice(0, -1),
    methods: function(_super) {
      var F0, MIME, PARSERS, RQTOR, _newRequest;
      F0 = function(x) {
        return x;
      };
      MIME = {
        json: "application/json",
        js: "application/json",
        html: "text/html",
        txt: "text/plain"
      };
      RQTOR = window["XMLHttpRequest"] || (function() {
        try {
          return window.ActiveXObject("Microsoft.XMLHTTP");
        } catch (_error) {}
      })();
      PARSERS = {
        js: Object.parse,
        json: Object.parse,
        uri: Object.parseUri
      };
      _newRequest = function() {
        return new RQTOR();
      };
      return {
        negotiateResultType: function(u, ev) {
          var p, r, urlId;
          urlId = u.path.slice(-1)[0];
          r = "js";
          if (urlId && (p = urlId.lastIndexOf(".")) > -1) {
            r = urlId.slice(p + 1);
          }
          return r;
        },
        negotiateError: function(st, text, ev) {
          if (!st || (st >= 200 && st < 300) || (st === 304)) {
            return null;
          }
          return Object.error("remote: " + st + " " + ev.uri + " " + (text || '')).addDetails(ev != null ? ev._err : void 0);
        },
        resolveMethod: function(ev) {
          return ev.method || (ev.payload ? "POST" : "GET");
        },
        resolveUri: function(uri, ev) {
          if (uri.host === '*') {
            uri.host = this.defaultHost;
          }
          uri.type = uri.params._ssl || ev.ssl ? 'https' : this.defaultProtocol;
          if (uri.params.ssl) {
            delete uri.params._ssl;
          }
          return "" + uri;
        },
        onRequestReady: function(rq, ev) {
          var err, result;
          err = this.negotiateError(rq.status, rq.statusText, ev);
          result = (ev.unmarshaller || PARSERS[ev.dataType] || F0)(rq.responseText);
          return ev.callback(err, result);
        },
        resolveHeaders: function(ev) {
          return Object.update({
            'Accept': MIME[ev.dataType] || "*/*",
            'Language': String.LANGUAGE,
            'Content-Type': MIME[ev.dataType]
          }, ev.headers);
        },
        onEvent: function(ev) {
          var T, ex, h, resType, rq, v, _ref;
          try {
            T = this;
            rq = _newRequest();
            rq.open(this.resolveMethod(ev), this.resolveUri(ev.uri, ev), true);
            ev._err = new Error();
            if (!ev.dataType) {
              ev.dataType = this.negotiateResultType(ev.uri, ev);
            }
            rq.onreadystatechange = function() {
              if ((this.readyState === 4) && (!ev.completed)) {
                ev.completed = true;
                this.onreadystatechange = F0;
                T.onRequestReady(this, ev);
              }
              return false;
            };
            _ref = this.resolveHeaders(ev);
            for (h in _ref) {
              v = _ref[h];
              if (v) {
                rq.setRequestHeader(h, v);
              }
            }
            if (resType = ev.uri.params.responseType) {
              rq.responseType = resType;
            }
            if (ev.payload) {
              if (typeof ev.payload === "object") {
                ev.payload = JSON.stringify(ev.payload);
              }
              rq.send(ev.payload);
            } else {
              rq.send(null);
            }
          } catch (_error) {
            ex = _error;
            ev.callback(this.error("remote_error: " + ev.uri, ex));
          }
        }
      };
    }
  });

  Object.fire({
    uri: "axoid://define/HttpService/RawHttpService",
    methods: function(_super) {
      return {
        onEvent: function(ev) {
          var T, ex, h, headers, rq, v;
          try {
            T = this;
            rq = new XMLHttpRequest();
            ev._err = new Error();
            rq.open(this.resolveMethod(ev), this.resolveUri(ev.uri, ev), true);
            rq.onreadystatechange = function() {
              var arr, d;
              if ((this.readyState === 4) && (!ev.completed)) {
                ev.completed = true;
                this.onreadystatechange = function(x) {
                  return x;
                };
                arr = (function() {
                  var _i, _len, _ref, _results;
                  if (this.response) {
                    _ref = new Uint8Array(this.response);
                    _results = [];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                      d = _ref[_i];
                      _results.push(String.fromCharCode(d));
                    }
                    return _results;
                  } else {
                    return [];
                  }
                }).call(this);
                ev.callback(T.negotiateError(this.status, this.statusText, ev), arr.join(""));
              }
              return false;
            };
            headers = Object.update({
              Language: String.LANGUAGE
            }, ev.headers);
            for (h in headers) {
              v = headers[h];
              if (v) {
                rq.setRequestHeader(h, v);
              }
            }
            rq.responseType = "arraybuffer";
            rq.send(null);
          } catch (_error) {
            ex = _error;
            ev.callback(this.error("remote_error: " + ev.uri, ex));
          }
        }
      };
    }
  });

}).call(this);

(function() {
  var __slice = [].slice;

  (function(global) {
    return Object.fire({
      uri: "axoid://define/EventHandler/IndexedDatabase",
      properties: ['touch', "sync"],
      version: 1,
      methods: function(_super) {
        var _CURSOR, _DB, _FIND, _OPS, _PUT, _STORE, _TREE, _UPGRADE, _getDoc, _openCursorArgs;
        _openCursorArgs = function(options) {
          var desc, lower, range, upper;
          desc = options.descend || (options.dir === "desc");
          if (!(range = options.range)) {
            return [null, !desc ? NEXT : PREV];
          }
          if (range instanceof Array) {
            lower = range[0], upper = range[1];
            if (upper === null) {
              return [this.IDBKeyRange.lowerBound(lower)];
            } else if (lower === null) {
              return [this.IDBKeyRange.upperBound(upper)];
            } else {
              if (desc = lower > upper) {
                return [this.IDBKeyRange.apply(this, __slice.call([upper, lower]).concat([this.PREV]))];
              } else {
                return [this.IDBKeyRange.apply(this, __slice.call([lower, upper]).concat([this.NEXT]))];
              }
            }
          }
          return [this.IDBKeyRange.only(range)];
        };
        _getDoc = function(store, ev) {
          var index, key, val;
          if (val = ev.id) {
            return store.get(val);
          }
          for (key in store.indexNames) {
            index = store.index(key);
            if (val = ev[index.keyPath]) {
              return index.get(val);
            }
          }
          return null;
        };
        _UPGRADE = (function() {
          var createStore, _idx;
          _idx = function(idx) {
            if (idx.keyPath) {
              return idx;
            } else {
              return {
                keyPath: idx
              };
            }
          };
          createStore = function(id, idx, indices) {
            var store, _i, _len, _results;
            if (idx == null) {
              idx = 'id';
            }
            if (indices == null) {
              indices = [];
            }
            store = this.createObjectStore(id, _idx(idx));
            _results = [];
            for (_i = 0, _len = indices.length; _i < _len; _i++) {
              idx = indices[_i];
              if (idx = _idx(idx)) {
                _results.push(store.createIndex(String.camelize(idx.keyPath, ","), idx.keyPath, idx.options));
              }
            }
            return _results;
          };
          return function(ev) {
            var db, s, st, _i, _j, _len, _len1, _ref, _ref1, _results;
            this.log("Upgrade", ev.oldVersion, " => ", ev.newVersion);
            db = ev.target.result;
            _ref = db.objectStoreNames;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              s = _ref[_i];
              db.deleteObjectStore(s);
            }
            if (!this.scheme) {
              throw new Error("No scheme for db " + this.id);
            }
            _ref1 = this.scheme;
            _results = [];
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              st = _ref1[_j];
              if ((st = st.id ? st : {
                id: st
              })) {
                _results.push(createStore.call(db, st.id, st.keyPath, st.indices));
              }
            }
            return _results;
          };
        })();
        _DB = function() {
          var dbreq, home;
          home = this.home;
          dbreq = home.dbOpen();
          dbreq.onsuccess = (function(_this) {
            return function(ev) {
              var db, txn, txnMode, txnTimeout, _ref;
              db = ev.target.result;
              txnMode = (_ref = _this.operation) === "query" || _ref === "read" ? "readonly" : "readwrite";
              txnTimeout = 5000;
              if (!(txn = db.transaction(_this.scope || [_this.storeId], txnMode, txnTimeout))) {
                return _this.next('no-tx');
              }
              txn.oncomplete = function() {
                return db.close();
              };
              txn.onerror = function() {
                home.error("db: couldn't not connect", ev);
                return db.close();
              };
              txn.onblocked = function() {
                home.error("db: connection blocked", ev);
                return db.close();
              };
              txn.onabort = function() {
                home.error("db: connection aborted", ev);
                return db.close();
              };
              txn.ontimeout = function() {
                home.error("db: transaction timeout.", ev);
                return db.close();
              };
              return _this.next(null, _this.tx = txn);
            };
          })(this);
          dbreq.onerror = function() {
            return home.error("db: couldn't not connect");
          };
          return dbreq.onupgradeneeded = function(ev) {
            var _ref;
            if ((_ref = global.localStorage) != null) {
              _ref[home.id + 'LastSync'] = 0;
            }
            return _UPGRADE.call(home, ev);
          };
        };
        _STORE = function(err, tx) {
          var ex;
          try {
            this.store = this.tx.objectStore(this.storeId);
            return this.next();
          } catch (_error) {
            ex = _error;
            return this.callback(this.home.error('db', 'can\'t obtain the store ' + this.storeId, ex));
          }
        };
        _CURSOR = function(store, options, next) {
          var cursor, elements, key, processed, skipped, src;
          if (options == null) {
            options = {};
          }
          key = options.key;
          src = key ? store.index(String.camelize(key, ",")) : store;
          if (!(cursor = src.openCursor.apply(src, _openCursorArgs(options)))) {
            return next("No cursor");
          }
          cursor.onerror = function(e) {
            return next(Object.error("failed", "cursor error", e));
          };
          elements = [];
          skipped = 0;
          processed = 0;
          cursor.onsuccess = function(e) {
            cursor = e.target.result;
            if (!cursor) {
              return next(null, elements);
            }
            if (options.limit && processed >= options.limit) {
              next(null, elements);
            } else if (options.offset && options.offset > skipped) {
              skipped++;
              cursor["continue"]();
            } else {
              elements.push(cursor.value);
              processed++;
              cursor["continue"]();
            }
            return 0;
          };
          return 0;
        };
        _TREE = function(err, parent) {
          var cursor, elements, src;
          if (!parent) {
            return this.next("parent_not_specified");
          } else if (err) {
            return this.next(err);
          }
          src = this.options.key ? this.store.index(String.camelize(this.options.key, ",")) : this.store;
          if (!(cursor = src.openCursor.apply(src, _openCursorArgs(this.options)))) {
            return this.next("no_cursor");
          }
          elements = [];
          return cursor.onsuccess = (function(_this) {
            return function(e) {
              var value;
              cursor = e.target.result;
              if (!cursor) {
                return _this.next(null, elements);
              }
              value = cursor.value;
              if (value && value.parent === parent.id) {
                value.parentObj = parent;
              } else {
                return cursor["continue"]();
              }
              elements.push(value);
              return cursor["continue"]();
            };
          })(this);
        };
        _FIND = function() {
          var req;
          if (!(req = _getDoc(this.store, this.options))) {
            return this.next("not_specified");
          }
          req.onsuccess = (function(_this) {
            return function(event) {
              var data, err;
              if (!(data = event.target.result)) {
                err = "not_found";
              }
              return _this.next(err, data);
            };
          })(this);
          req.onerror = function() {
            return cb("not_found");
          };
          return 0;
        };
        _PUT = [
          function() {
            var docs, on_;
            docs = [].concat(this.payload);
            on_ = (function(_this) {
              return function() {
                var doc, req;
                if (!(doc = docs.shift())) {
                  return _this.next();
                }
                if (!doc.id) {
                  doc.id = doc._id || Object.math.uuid();
                }
                doc.ts = Date.now().valueOf();
                req = doc.deleted ? store["delete"](doc.id) : _this.store.put(doc);
                req.onsuccess = on_;
                return req.onerror = _this.next;
              };
            })(this);
            return on_();
          }, function() {
            this.home.prop('touch', Date.now());
            return this.next();
          }
        ];
        _OPS = {
          query: function() {
            return _CURSOR(this.store, this.options, this.next);
          },
          tree: [_FIND, _TREE],
          find: _FIND,
          field: [
            _FIND, function(err, data) {
              return this.next(err, data != null ? data[this.options.field] : void 0);
            }
          ],
          insert: _PUT,
          update: _PUT,
          upsert: _PUT,
          remove: function() {
            var tx;
            tx = store["delete"](this.payload[0].id);
            tx.oncomplete = this.next;
            return tx.onerror = (function(_this) {
              return function() {
                return _this.next("Not Deleted");
              };
            })(this);
          },
          clear: function() {
            var tx;
            tx = store.clear();
            tx.oncomplete = this.next;
            return tx.onerror = (function(_this) {
              return function() {
                return _this.next("Not cleared");
              };
            })(this);
          },
          sync: function() {
            var uri;
            if (uri = this.prop('syncDeltaUri')) {
              return this.prop('syncDeltaUri', uri);
            }
          }
        };
        return {
          init: function() {
            var _ref, _ref1, _ref2;
            this.IDB = global.indexedDB || global.webkitIndexedDB || global.mozIndexedDB || global.msIndexedDB;
            this.IDBKeyRange = global.IDBKeyRange || global.webkitIDBKeyRange;
            this.IDBCursor = global.IDBCursor || global.webkitIDBCursor || global.mozIDBCursor || global.msIDBCursor;
            this.PREV = ((_ref = this.IDBCursor) != null ? _ref.PREV : void 0) || "prev";
            this.NEXT = ((_ref1 = this.IDBCursor) != null ? _ref1.NEXT : void 0) || "next";
            this.prop('lastSynchedTimestamp', (_ref2 = global.localStorage) != null ? _ref2[this.id + 'LastSync'] : void 0);
            _super.init.call(this);
            if (this.socketChannel) {
              return Object.entity.create({
                id: this.id + 'Socket:SocketClient',
                channel: this.socketChannel
              });
            }
          },
          onEvent: function(ev, u) {
            if (u == null) {
              u = ev.uri;
            }
            ev.home = this;
            ev.storeId = u.path[0].toLowerCase();
            ev.operation = u.host;
            ev.payload = ev.docs || [ev.doc];
            ev.options = Object.update(u.params, ev.options);
            return Function.perform(ev, function(flow) {
              this.next = flow.next;
              return [_DB, _STORE].concat(_OPS[this.operation], this.callback);
            });
          },
          dbOpen: function() {
            return this.IDB.open(this.id, this.version);
          },
          syncChanged: function(delta) {
            if (!delta) {
              return this._newSyncTs = Date.now();
            }
            return Function.perform(this, function(flow) {
              return [
                function() {
                  var docs, storeId;
                  for (storeId in delta) {
                    docs = delta[storeId];
                    if ((storeId = storeId.split('_')[0])) {
                      Object.fire({
                        uri: "db://upsert/" + storeId,
                        docs: docs,
                        callback: flow.wait()
                      });
                    }
                  }
                  return flow.next();
                }, function() {
                  return this.prop('lastSynchedTimestamp', this._newSyncTs);
                }
              ];
            });
          },
          lastSynchedTimestampChanged: function(ts) {
            var fn, _ref;
            if ((_ref = global.localStorage) != null) {
              _ref.setItem(this.id + 'LastSync', ts);
            }
            if (this.syncPeriod) {
              fn = (function(_this) {
                return function() {
                  return _this.prop('lastSynchedTimestampByPeriod', ts);
                };
              })(this);
              return global.setTimeout(fn, this.syncPeriod);
            } else {
              if (!this.prop('lastSynchedTimestampOnce')) {
                return this.prop('lastSynchedTimestampOnce', ts);
              }
            }
          }
        };
      }
    });
  })(this);

}).call(this);

(function() {
  Object.fire({
    uri: "axoid://define/HttpService/ScriptService",
    scriptType: "text/javascript",
    methods: function(_super) {
      var counter, registry, _createScriptTag, _doc;
      registry = window._JSONP || (window._JSONP = {});
      counter = window._JSONP_COUNTER || (window._JSONP_COUNTER = 1);
      _doc = window.document;
      _createScriptTag = function(attrs) {
        var e;
        e = _doc.createElement("script");
        e.type = this.scriptType;
        e.charset = "utf-8";
        Object.update(e, attrs);
        return e;
      };
      return {
        onEvent: function(ev, u) {
          var jsonp, script, sid;
          if (u == null) {
            u = ev.uri;
          }
          script = _createScriptTag.call(this, ev.scriptAttrs);
          if (!ev.noAsynMode) {
            script.async = "async";
          }
          if (ev.scriptId) {
            script.id = ev.scriptId;
          }
          ev._err = new Error();
          if (jsonp = u.params.jsonp) {
            sid = "n" + counter++;
            u.params[jsonp] = escape("window._JSONP." + sid);
            registry[sid] = function(r) {
              return typeof ev.callback === "function" ? ev.callback(null, (ev.unmarshaller ? ev.unmarshaller(r) : r)) : void 0;
            };
            script.onload = function() {
              script.parentNode.removeChild(script);
              return delete registry[sid];
            };
          } else {
            script.onload = function() {
              var cb;
              cb = ev.callback;
              ev.callback = null;
              return typeof cb === "function" ? cb(null, this) : void 0;
            };
          }
          script.onerror = function() {
            return ev.callback(Object.error("remote_error", "Script error: " + u));
          };
          script.src = this.resolveUri(u, ev);
          return Object.dom.appendToHead(script);
        }
      };
    }
  });

}).call(this);


/*
 * Defines [Settings] entity type that works as a stored values bundle container.
 * @options
 *   - storage
 */

(function() {
  Object.fire({
    uri: "axoid://define/Settings",
    properties: ["value:Values"],
    storage: window.localStorage,
    methods: function(_super) {
      return {
        init: function() {
          this.storage = this.createStorage();
          this.initValue(this.id);
          return _super.init.call(this);
        },
        createStorage: function() {
          return this.storage || {
            getItem: function(key) {
              return this[key];
            },
            setItem: function(key, value) {
              return this[key] = value;
            }
          };
        },
        initValue: function(key) {
          var s;
          return this.value = (s = this.storage.getItem(key)) && Object.parse(s) || this.value || {};
        },
        valueChanged: function(val) {
          this.persistValue(val);
          return _super.valueChanged.apply(this, arguments);
        },
        persistValue: function(v) {
          var s;
          try {
            if (this.storage.getItem(this.id) !== (s = JSON.stringify(v))) {
              return this.storage.setItem(this.id, s);
            }
          } catch (_error) {}
        }
      };
    }
  });

}).call(this);

(function() {
  Object.fire({
    uri: "axoid://define/SocketClient",
    properties: ['requires:Requires'],
    ready: false,
    methods: function(_super) {
      return {
        launch: function(cb) {
          this.requires = ["script://" + this.channel + "/socket.io.js"];
          return _super.launch.call(this, cb);
        },
        init: function() {
          var io, socket;
          if (!(io = window.io)) {
            throw new Error('No Socket IO');
          }
          socket = io.connect(this.channel);
          socket.on("connect", ((function(_this) {
            return function() {
              return _this.onConnect();
            };
          })(this)));
          socket.on("message", ((function(_this) {
            return function(ev) {
              return _this.onMessage(ev);
            };
          })(this)));
          socket.on("disconnect", ((function(_this) {
            return function() {
              return _this.onDisconnect();
            };
          })(this)));
          return this.emit = function(ev, cb) {
            if (cb == null) {
              cb = ev.callback;
            }
            ev.uri = "" + ev.uri;
            delete ev.callback;
            return socket.json.emit("message", ev, cb);
          };
        },
        onEvent: function(ev) {
          this.log("send", ev);
          return this.emit(ev);
        },
        onConnect: function(ev) {
          this.log("onConnect", ev);
          return _super.init.call(this);
        },
        onDisconnect: function(ev) {
          return this.log("onDisconnect", ev);
        },
        onMessage: function(ev) {
          this.log("onMessage", ev);
          if (ev.uri) {
            return Object.fire(ev);
          }
        }
      };
    }
  });

}).call(this);

(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Object.LOG_LEVEL = 1;

  Object.log = (function(c) {
    var r;
    if (c == null) {
      c = {
        log: function() {}
      };
    }
    if (!c.log.apply) {
      c._log = c.log;
      c.log = function() {
        var s;
        return c._log(((function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = arguments.length; _i < _len; _i++) {
            s = arguments[_i];
            _results.push(s);
          }
          return _results;
        }).apply(this, arguments)).join(", "));
      };
    }
    if (!c.error) {
      c.error = function() {
        var s;
        return c.log.apply(c, ['ERROR: '].concat((function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = arguments.length; _i < _len; _i++) {
            s = arguments[_i];
            _results.push(s);
          }
          return _results;
        }).apply(this, arguments)));
      };
    }
    r = function(x) {
      var e;
      if (!(Object.LOG_LEVEL > 4)) {
        return x;
      }
      if (x != null ? x.printIntoLog : void 0) {
        x.printIntoLog(c);
      } else {
        c.log.apply(c, (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = arguments.length; _i < _len; _i++) {
            e = arguments[_i];
            _results.push(e);
          }
          return _results;
        }).apply(this, arguments));
      }
      return x;
    };
    r.error = r;
    return r;
  })(window.console);

  Object.error = (function() {
    var Err;
    Err = (function() {
      function Err(e) {
        this.details = [];
        if (typeof e === 'string') {
          if (e) {
            this.reason = e.split(':')[0];
          }
          if (e) {
            this.message = e;
          }
        } else {
          if (e.reason) {
            this.reason = e.reason;
          }
          if (e.message) {
            this.message = e.message;
          }
        }
      }

      Err.prototype.reason = 'unknown';

      Err.prototype.message = '';

      Err.prototype.isError = true;

      Err.prototype.addDetails = function() {
        var det, _i, _len;
        for (_i = 0, _len = arguments.length; _i < _len; _i++) {
          det = arguments[_i];
          if (!(det)) {
            continue;
          }
          this.details.unshift(det);
          if (det.stack) {
            this.stack = det.stack;
          }
        }
        return this;
      };

      Err.prototype.addPrefix = function(p) {
        if (p) {
          this.prefix = '' + p;
        }
        return this;
      };

      Err.prototype.log = function() {
        Object.log(this);
        return this;
      };

      Err.prototype.end = function(x) {
        return x;
      };

      Err.prototype.toString = function() {
        return (this.prefix || '') + " " + this.message;
      };

      Err.prototype.printIntoLog = function(c) {
        var details, stack;
        details = (typeof this.details === "function" ? this.details(length === 1) : void 0) ? this.details[0] : this.details;
        stack = this.stack || (new Error).stack;
        return c.error(this.toString(), details, stack);
      };

      return Err;

    })();
    return function(err, details) {
      return ((err != null ? err.isError : void 0) ? err : new Err(err)).addDetails(details);
    };
  })();


  /*
  Axio: Web DOM API.
   */

  Object.dom = (function(_win) {
    var _ALIVE_EVENTS_KEYS, _ALIVE_HANDLER, _createEvent, _doc;
    _doc = _win.document;
    _createEvent = function(evt) {
      var e, r;
      r = {};
      e = void 0;
      if (_win.event) {
        r.internal = _win.event;
        r.target = e = _win.event.srcElement;
      } else {
        r.internal = evt;
        e = evt.target;
        while (e && e.nodeType !== 1) {
          e = e.parentNode;
        }
        r.target = e;
      }
      while (e && !e.entity) {
        e = e.parentNode;
      }
      r.entity = e && e.entity;
      return r;
    };
    _ALIVE_EVENTS_KEYS = ["mousedown", "mouseup", "click", "mousemove", "mouseover", "mouseout"];
    _ALIVE_HANDLER = function(ev0) {
      var T, ev, type;
      T = this;
      if (!T.disabled) {
        ev = _createEvent(ev0);
        type = ev.internal.type;
        switch (type) {
          case "mousedown":
            if (T.stylePressed) {
              T.updateClass(T.stylePressed);
            }
            T.touchBegin && T.touchBegin(ev);
            break;
          case "mouseup":
            T.touchEnd && T.touchEnd(ev);
            if (T.stylePressed) {
              T.updateClass("!" + T.stylePressed);
            }
            break;
          case "click":
            T.tapped && T.tapped(ev);
            break;
          case "mousemove":
            T.mouseMove && T.mouseMove(ev);
            break;
          case "mouseover":
            if (T.styleHovered) {
              T.updateClass(T.styleHovered);
            }
            T.mouseOver && T.mouseOver(ev);
            break;
          case "mouseout":
            T.mouseOut && T.mouseOut(ev);
            if (T.styleHovered) {
              T.updateClass("!" + T.styleHovered);
            }
        }
      }
      return true;
    };
    return {
      document: _win.document,
      createEvent: _createEvent,
      STYLE_LINE_FIXED: "overflow:hidden;white-space:nowrap;cursor:pointer;",
      STYLE_TEXTLINE: "white-space:nowrap;line-height:1.5em;vertical-align:middle;",
      createElement: function(type, attrs) {
        if (type == null) {
          type = "DIV";
        }
        return Object.update(_doc.createElement(type), attrs);
      },
      createComplexElement: function(tag, attrs) {
        var div, r;
        div = this.DOM_FACTORY || (this.DOM_FACTORY = _doc.createElement("div"));
        div.innerHTML = tag;
        r = div.firstChild;
        div.removeChild(r);
        return Object.update(r, attrs);
      },
      appendToHead: function(el) {
        var fjs;
        fjs = _doc.getElementsByTagName("head")[0];
        return fjs.appendChild(el);
      },
      appendCss: function(href) {
        return this.appendToHead(this.createElement("link", {
          rel: "stylesheet",
          href: href
        }));
      },
      getElementById: function(id) {
        return _doc.getElementById(id) || null;
      },
      removeElement: function(e) {
        var _ref;
        return e != null ? (_ref = e.parentNode) != null ? _ref.removeChild(e) : void 0 : void 0;
      },
      alive: function(T) {
        return this.listenEvents(T, _ALIVE_EVENTS_KEYS, function(ev0) {
          return _ALIVE_HANDLER.call(T, ev0);
        });
      },
      listenTapped: function(T) {
        return this.listenEvents(T, ['click'], function(ev0) {
          return _ALIVE_HANDLER.call(T, ev0);
        });
      },
      listenEvents: function(T, key, fn, fl) {
        var keys, node, _i, _len;
        node = (T ? T.domNode : _doc);
        keys = (key.split ? key.split(" ") : key);
        for (_i = 0, _len = keys.length; _i < _len; _i++) {
          key = keys[_i];
          if (node.addEventListener) {
            node.addEventListener(key, fn, fl);
          } else {
            node.attachEvent("on" + key, fn, fl);
          }
        }
        return node;
      },
      stopEvent: function(e) {
        if (e = (e != null ? e.internal : void 0) || e) {
          if (typeof e.stopPropagation === "function") {
            e.stopPropagation();
          }
          e.cancelBubble = true;
          e.returnValue = false;
        }
        return false;
      },
      isKeyboardCode: function(ev, code) {
        if (ev == null) {
          ev = _win.event || {};
        }
        return ev.keyCode === code || ev.charCode === code || ev.which === code;
      },
      KEY_CODE: {
        ESCAPE: 27,
        ENTER: 13,
        TAB: 8
      },
      viewportSize: function() {
        var scr;
        scr = _win.screen;
        return {
          width: scr.availWidth,
          height: scr.availHeight
        };
      },
      getTotalOffset: function(p) {
        var r;
        r = {
          top: 0,
          left: 0,
          width: p.clientWidth,
          height: p.clientHeight
        };
        while (p) {
          r.top += p.offsetTop - p.scrollTop;
          r.left += p.offsetLeft - p.scrollLeft;
          p = p.offsetParent;
        }
        return r;
      },
      getDataset: function(v) {
        var attr, ds, n, _i, _len, _ref;
        if (ds = v.dataset) {
          return ds;
        }
        ds = {};
        _ref = v.attributes;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          attr = _ref[_i];
          if ((n = attr.name).slice(0, 5) === 'data-') {
            ds[String.camelize(n.slice(5), '-')] = v.getAttribute(n);
          }
        }
        return ds;
      },
      handleError: function(err) {
        return Object.error(err).log();
      },
      updateClass: function(elt, delta) {
        var cl, clss, p, _i, _len;
        if (!(elt && delta)) {
          return elt;
        }
        clss = elt.className.split(" ");
        delta = delta.split(" ");
        for (_i = 0, _len = delta.length; _i < _len; _i++) {
          cl = delta[_i];
          if (cl) {
            if (cl[0] === "!") {
              if (cl === "!*") {
                clss = [];
              } else {
                if ((p = clss.indexOf(cl.slice(1))) > -1) {
                  clss[p] = "";
                }
              }
            } else {
              if (__indexOf.call(clss, cl) < 0) {
                clss.push(cl);
              }
            }
          }
        }
        elt.className = ((function() {
          var _j, _len1, _results;
          _results = [];
          for (_j = 0, _len1 = clss.length; _j < _len1; _j++) {
            cl = clss[_j];
            if (cl) {
              _results.push(cl);
            }
          }
          return _results;
        })()).join(' ');
        return elt;
      },
      initWidget: (function() {
        return function(meta) {
          var elt, id, id_, n, type, z, _ref, _ref1;
          elt = meta.domNode;
          _ref = Object.dom.getDataset(elt);
          for (n in _ref) {
            z = _ref[n];
            meta[n] = z;
          }
          _ref1 = meta["widget"].split(':'), id = _ref1[0], type = _ref1[1];
          if (!type) {
            type = id;
            id = null;
          }
          if (id_ = elt.getAttribute("id")) {
            id = id_;
          }
          meta.uri = "axoid://create/" + type + "#" + (id || '');
          return Object.fire(meta);
        };
      })()
    };
  })(typeof window === 'object' ? window : this);

}).call(this);

(function() {
  Object.fire({
    uri: "axoid://define/View/webclient.AceEditor",
    properties: ['value'],
    css: "position: relative;height: 500px;",
    mode: 'coffee',
    theme: 'chrome',
    methods: function(_super) {
      return {
        init: function() {
          _super.init.call(this);
          return this.editor.getSession().on('change', (function(_this) {
            return function(e) {
              if (_this.defered) {
                return;
              }
              _this.defered = true;
              return Function.nextTick(1000, _this, function() {
                this.defered = false;
                this.isOnChange = true;
                this.prop('value', this.editor.getValue());
                return this.isOnChange = false;
              });
            };
          })(this));
        },
        domNodeChanged: function(domNode) {
          this.editor = window.ace.edit(domNode);
          this.editor.setTheme("ace/theme/" + this.theme);
          return this.editor.getSession().setMode("ace/mode/" + this.mode);
        },
        valueChanged: function(value) {
          if (!this.isOnChange) {
            return this.editor.setValue(value);
          }
        }
      };
    }
  });

}).call(this);

(function() {
  Object.fire({
    uri: "axoid://define/View/Button",
    properties: ["disabled:Disabled", "caption:Caption", 'counter'],
    domNodeTag: "button",
    busyCaption: 'in_progress',
    methods: function(_super) {
      return {
        tapped: function(ev) {
          var _ref;
          this.prop("disabled", true);
          if (ev = this.createAsyncEvent()) {
            this.domNodeClass("ui-busy");
            if (this.busyCaption) {
              this.savedCaption = (_ref = this.getCaptionElt()) != null ? _ref.domNode.innerHTML : void 0;
              this.prop("caption", this.busyCaption);
            }
            return Object.fire(Object.clone(ev, {
              callback: (function(_this) {
                return function(err, result) {
                  var _ref1;
                  if (typeof ev.callback === "function") {
                    ev.callback(err, result);
                  }
                  if (err) {
                    _this.onError(err);
                  } else {
                    _this.incrementCounter();
                    _this.onSuccess();
                  }
                  _this.domNodeClass("!ui-busy");
                  _this.prop("disabled", false);
                  if (_this.savedCaption) {
                    if ((_ref1 = _this.getCaptionElt()) != null) {
                      _ref1.domNode.innerHTML = _this.savedCaption;
                    }
                    return _this.savedCaption = null;
                  }
                };
              })(this)
            }));
          } else {
            if (this.doAction()) {
              this.incrementCounter();
            }
            return Function.nextTick((function(_this) {
              return function() {
                return _this.prop("disabled", false);
              };
            })(this));
          }
        },
        createAsyncEvent: function() {
          return null;
        },
        doAction: function() {
          return true;
        },
        incrementCounter: function() {
          return this.prop('counter', (this.prop('counter') || 0) + 1);
        },
        counterChanged: function() {
          return this.prop('odd', (this.prop('counter') || 0) % 2 === 1);
        },
        onError: function(err) {},
        onSuccess: function() {}
      };
    }
  });

}).call(this);


/*
UI D3 List view.
 */

(function() {
  Object.fire({
    uri: "axoid://define/List/D3List",
    properties: ["delta"],
    methods: function(_super) {
      var _reg;
      _reg = function(data, key, r) {
        var e, val, _i, _len;
        if (r == null) {
          r = {};
        }
        if (data) {
          for (_i = 0, _len = data.length; _i < _len; _i++) {
            e = data[_i];
            if (val = e[key]) {
              r[val] = e;
            }
          }
        }
        return r;
      };
      return {
        dataChanged: function(data, ev) {
          var val;
          if (!data) {
            this.prop('dataCount', ev.error ? -2 : -1);
            return;
          }
          this.dataRegistry = _reg(data, this.dataIdKey);
          this.childrenRegistry = {};
          this.setChildren(data, {
            noReset: true
          });
          if ((val = this.getValue()) && !this.dataRegistry[val]) {
            return this.prop("value", null);
          }
        },
        deltaChanged: function(delta) {
          this.dataRegistry = Object.update(this.dataRegistry || {}, _reg(delta, this.dataIdKey));
          if (!this.childrenRegistry) {
            this.childrenRegistry = {};
          }
          return this.setChildren(delta, {
            noReset: true
          });
        },
        childrenAdapter: function(data) {
          var attrs, ch, counter, datum, e, existing, i, id, lastNode, meta, node, r, _i, _j, _len, _len1;
          r = [];
          ch = this._children;
          this._children = [];
          counter = 0;
          if (ch) {
            for (_i = 0, _len = ch.length; _i < _len; _i++) {
              e = ch[_i];
              if (id = e.value) {
                if (this.dataRegistry[id]) {
                  this._children.push(e);
                  this.childrenRegistry[id] = e;
                  counter++;
                } else {
                  e.done();
                }
              }
            }
          }
          if (data) {
            for (i = _j = 0, _len1 = data.length; _j < _len1; i = ++_j) {
              datum = data[i];
              if (!(id = datum[this.dataIdKey])) {
                throw new Error('Empty datum id in list data');
              }
              if (existing = this.childrenRegistry[id]) {
                lastNode = existing.domNode;
                this.updateChild(existing, datum);
              } else {
                counter++;
                meta = this.childrenItemAdapter(datum, i);
                attrs = {};
                if (meta.id) {
                  attrs.id = meta.id;
                }
                node = Object.dom.createElement(meta.domNodeTag, Object.update(attrs, meta.domNodeAttrs));
                this.contentNode.insertBefore(node, lastNode != null ? lastNode.nextSibling : void 0);
                meta.domNode = node;
                r.push(meta);
              }
            }
          }
          this.prop('dataCount', counter);
          return r;
        },
        updateChild: function(e, d) {
          return e.prop('data', d, {
            force: true
          });
        }
      };
    }
  });

}).call(this);

(function() {
  Object.fire({
    uri: "axoid://define/Input/Dropdown",
    properties: ["data"],
    dataIdKey: 'id',
    methods: function(_super) {
      var _newOption;
      _newOption = function(id, name, isv) {
        if (name == null) {
          name = '' + id;
        }
        if (isv == null) {
          isv = false;
        }
        return new Option(name, id, isv, isv);
      };
      return {
        getInputChildrenMeta: function(ch) {
          var T;
          T = this;
          return [
            {
              id: this.id + "_input:View",
              onInited: function() {
                return T.valueElt = this;
              },
              domNodeTag: "select",
              style: this.valueStyle,
              domNodeAttrs: {
                onchange: this.create_onchange_handler()
              }
            }
          ];
        },
        tapped: function(ev) {
          var _ref;
          return (_ref = this.valueElt) != null ? _ref.domNode.focus() : void 0;
        },
        create_onchange_handler: function() {
          var T;
          T = this;
          return function(ev) {
            T.doneEditor(this.selectedIndex ? T.data[this.selectedIndex - 1][T.dataIdKey] : '');
            return true;
          };
        },
        dataChanged: function(data, ev) {
          var d, i, id, isv, options, _i, _len;
          _super.dataChanged.call(this, data, ev);
          options = this.valueElt.domNode.options;
          options.length = 0;
          if (data === null) {
            options[0] = _newOption('', 'Loading...');
          } else {
            options[0] = _newOption('', '', !this.value);
            for (i = _i = 0, _len = data.length; _i < _len; i = ++_i) {
              d = data[i];
              if (!(id = d[this.dataIdKey])) {
                continue;
              }
              isv = id === this.value;
              this.valueElt.domNode.options[i + 1] = _newOption(id, d.name, isv);
              if (isv) {
                this.prop('datum', d);
              }
            }
          }
          return ev;
        },
        redrawValue: function() {
          var d, i, id, _i, _len, _ref;
          if (this.data) {
            _ref = this.data;
            for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
              d = _ref[i];
              if (!((id = d[this.dataIdKey]) === this.value)) {
                continue;
              }
              this.prop('datum', d);
              this.valueElt.domNode.selectedIndex = i + 1;
              return;
            }
          }
          return this.valueElt.domNode.selectedIndex = 0;
        }
      };
    }
  });

}).call(this);


/*
UI List view.
 */

(function() {
  Object.fire({
    uri: "axoid://define/View/List",
    properties: ["children:Children", 'itemTemplate', "data", "selection", "value:Value"],
    style: 'list-group',
    domNodeTag: 'ul',
    itemType: 'Widget',
    itemStyle: 'list-group-item',
    itemTemplate: '<a href="#" onclick="return false;">{{name}}</a>',
    dataIdKey: 'id',
    itemDomNodeTag: 'li',
    asyncDataPropertyName: null,
    itemActiveStyle: 'active',
    methods: function(_super) {
      var _reg;
      _reg = function(data, key, r) {
        var e, val, _i, _len;
        if (r == null) {
          r = {};
        }
        if (data) {
          for (_i = 0, _len = data.length; _i < _len; _i++) {
            e = data[_i];
            if (val = e[key]) {
              r[val] = e;
            }
          }
        }
        return r;
      };
      return {
        valueChanged: function(value) {
          var _ref;
          this.prop('datum', (_ref = this.dataRegistry) != null ? _ref[value] : void 0);
          return this.syncSelection();
        },
        itemTemplateChanged: function(template) {
          var ch, key, _ref, _results;
          if (template) {
            _ref = this.childrenRegistry;
            _results = [];
            for (key in _ref) {
              ch = _ref[key];
              _results.push(ch.prop('template', template));
            }
            return _results;
          }
        },
        childrenChanged: function() {
          this.childrenRegistry = _reg(this.getChildren(), 'value');
          return this.syncSelection();
        },
        dataChanged: function(data, ev) {
          var val;
          if (data) {
            this.prop('dataCount', data.length);
          } else {
            this.prop('dataCount', ev.error ? -2 : -1);
            data = [];
          }
          this.dataRegistry = _reg(data, this.dataIdKey);
          this.childrenRegistry = {};
          this.setChildren(data);
          if (this.dataCount >= 0 && (val = this.getValue()) && !this.dataRegistry[val]) {
            return this.prop("value", null);
          }
        },
        syncSelection: function() {
          var _ref;
          return this.prop("selection", (_ref = this.childrenRegistry) != null ? _ref[this.getValue()] : void 0);
        },
        selectionChanged: function(sel, ev) {
          var _ref;
          if ((_ref = ev.oldValue) != null) {
            _ref.domNodeClass('!' + this.itemActiveStyle);
          }
          return sel != null ? sel.domNodeClass(this.itemActiveStyle) : void 0;
        },
        childrenAdapter: function(data) {
          var datum, i, _i, _len, _results;
          if (!data) {
            return [];
          }
          _results = [];
          for (i = _i = 0, _len = data.length; _i < _len; i = ++_i) {
            datum = data[i];
            _results.push(this.childrenItemAdapter(datum, i));
          }
          return _results;
        },
        childrenItemAdapter: function(d, i, nextNode) {
          return {
            type: this.itemType,
            domNodeTag: this.itemDomNodeTag,
            style: this.itemStyle,
            template: this.itemTemplate,
            value: d[this.dataIdKey],
            data: d
          };
        },
        tapped: function(ev) {
          var v, w, _ref;
          w = ev.entity;
          while (w && (w !== this)) {
            if ((v = w.value) && ((_ref = this.childrenRegistry) != null ? _ref[v] : void 0)) {
              this.setValue(v);
              break;
            }
            w = w.parentView;
          }
          return w;
        }
      };
    }
  });

}).call(this);

(function() {
  Object.emit({
    uri: "axoid://define/Html/Widget",
    properties: ["data", "template"],
    methods: function(_super) {
      var _doneSubs;
      _doneSubs = function() {
        var s, _i, _len, _ref;
        if (this._subs) {
          _ref = this._subs;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            s = _ref[_i];
            s.done();
          }
        }
        return this._subs = [];
      };
      return {
        done: function() {
          _doneSubs.call(this);
          return _super.done.call(this);
        },
        htmlChanged: function() {
          var node, _i, _len, _ref, _results;
          _doneSubs.call(this);
          _ref = this.domNode.querySelectorAll("[data-widget]");
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            node = _ref[_i];
            _results.push(Object.dom.initWidget({
              domNode: node,
              callback: (function(_this) {
                return function(err, obj) {
                  if (err) {
                    return _this.handleSubError(err, meta);
                  }
                  return _this._subs.push(obj);
                };
              })(this)
            }));
          }
          return _results;
        },
        templateChanged: function(v) {
          return this.redraw();
        },
        dataChanged: function(v) {
          return this.redraw();
        },
        redraw: function() {
          var ctx, tmpl;
          if ((tmpl = this.prop('template')) && (ctx = this.prop('data'))) {
            return this.prop('html', this.compileHtml(tmpl, ctx));
          }
        },
        compileHtml: function(tmpl, ctx) {
          return String.template(tmpl, ctx);
        },
        handleSubError: function(err, meta) {
          Object.error(err("wrong_widget", meta)).log();
          return Object.emit({
            uri: "axoid://create/Html",
            domNode: meta.domNode,
            style: "alert-error",
            html: "Error: " + (err.message || ("can't create UI view: " + meta.id))
          });
        }
      };
    }
  });

}).call(this);


/*
Basic Dom UI properties.
 */

(function() {
  Object.emit({
    uri: "axoid://define/Property/Node",
    methods: function() {
      return {
        init: function(T, defs) {
          var node;
          if (!(node = defs.domNode)) {
            throw new Error("domNode is not specified for [" + T + "]");
          }
          T.domNode = T.contentNode = node;
          node.entity = T;
          if (T.css) {
            node.style.cssText += T.css;
          }
          if (defs.styleExpression) {
            Object.property.bind(T, 'style', defs.styleExpression);
          }
          T.domNodeClass((defs.style || '') + " " + (node.className || '') + " " + (node.disabled ? 'disabled' : ''));
          if (defs.hidden || defs.hiddenExpression) {
            node.style.display = 'none';
          }
          if (T.tapped) {
            Object.dom.listenTapped(T);
          }
          return T.propertyChanged({
            entity: T,
            propId: 'domNode',
            value: node
          });
        },
        done: function(T) {
          var e;
          if (e = T.domNode) {
            Object.dom.removeElement(e);
            e.entity = null;
            return T.domNode = T.contentNode = null;
          }
        }
      };
    }
  });

  Object.emit({
    uri: "axoid://define/Property/Style",
    methods: function() {
      return {
        init: function(T, defs) {},
        getter: function(T) {
          return T.domNode.className;
        },
        setter: function(T, v, ev) {
          if (typeof v === "string") {
            return T.domNodeClass(v);
          } else {
            return T.domNodeStyle(v);
          }
        }
      };
    },
    mixin: function(_super) {
      return {
        domNodeStyle: function(delta) {
          var n, st, v;
          if (!((st = this.domNode.style) && delta)) {
            return st;
          }
          for (n in delta) {
            v = delta[n];
            if (st[n] !== v) {
              st[n] = v;
            }
          }
          return st;
        },
        domNodeClass: function(delta) {
          return Object.dom.updateClass(this.domNode, delta);
        },
        toggleDomNodeClass: function(cl, flag) {
          return Object.dom.updateClass(this.domNode, (flag ? cl : "!" + cl));
        }
      };
    }
  });

  Object.emit({
    uri: "axoid://define/Property/Hidden",
    methods: function() {
      return {
        getter: function(T) {
          return T.domNode.style.display === "none";
        },
        setter: function(T, v) {
          return T.domNode.style.display = (v ? "none" : this.displayType || "");
        }
      };
    },
    mixin: function(_super) {
      return {
        display: function(f, bForceParents) {
          var p;
          this.setHidden(!f);
          if (f && bForceParents && (p = this)) {
            while ((p = p.parentView)) {
              p.display(f);
            }
          }
          return this;
        },
        switchDisplay: function() {
          return this.setHidden(!this.isHidden());
        },
        isHidden: function() {
          return this.prop("hidden");
        },
        setHidden: function(f) {
          return this.prop("hidden", f);
        }
      };
    }
  });

  Object.emit({
    uri: "axoid://define/Property/Caption",
    methods: function() {
      return {
        setter: function(T, v, ev) {
          var e, ex, hidden;
          if (v == null) {
            v = '';
          }
          T[this.id] = v;
          e = T.getCaptionElt();
          hidden = v === "none";
          if (e) {
            e.display(!(e.hidden || hidden));
            v = T.getCaptionHtml(v, ev);
            try {
              return e.domNode.innerHTML = (hidden || !v ? "" : v);
            } catch (_error) {
              ex = _error;
              return T.error(ex, "Caption");
            }
          }
        },
        comparator: function() {
          return false;
        }
      };
    },
    mixin: function(_super) {
      return {
        getCaptionElt: function() {
          if (this.isDone) {
            return null;
          } else {
            return this.captionElt || this;
          }
        },
        getCaptionHtml: function(v, ev) {
          var icon;
          return ((icon = this.prop('icon')) ? '<i class="icon-#{icon}"></i> ' : "") + String.localize(v, ev.quantity);
        }
      };
    }
  });

  Object.emit({
    uri: "axoid://define/Property/Html",
    methods: function(_super) {
      return {
        setValueAsync: function(T, ev, asyncUrl) {
          this.setter(T, T.asyncPlaceholder || null, ev);
          return _super.setAsyncValue.call(this, T, ev, asyncUrl);
        },
        getter: function(T) {
          var _ref;
          return (_ref = T.contentNode) != null ? _ref.innerHTML : void 0;
        },
        setter: function(T, v) {
          var ex, msg;
          if (v == null) {
            v = "<div>&nbsp;</div>";
          }
          try {
            if (v != null ? v.error : void 0) {
              throw v.error;
            }
            return T.contentNode.innerHTML = v;
          } catch (_error) {
            ex = _error;
            msg = String.localize("html_error") + ": " + ex.message;
            return T.contentNode.innerHTML = "<div style='color:red;'>" + msg + "</div>";
          }
        }
      };
    }
  });

  Object.emit({
    uri: "axoid://define/Property/Disabled",
    methods: function() {
      return {
        setter: function(T, v) {
          return T[this.id] = !!v;
        },
        comparator: function(a, b) {
          return !a === !b;
        }
      };
    },
    mixin: function(_super) {
      return {
        init: function() {
          _super.init.call(this);
          return Object.dom.alive(this);
        },
        disabledChanged: function(v) {
          this.domNode.disabled = (v ? "disabled" : "");
          return this.toggleDomNodeClass("disabled", v);
        }
      };
    }
  });

  Object.emit({
    uri: "axoid://define/Property/Children",
    methods: function(_super) {
      var _child;
      _child = function(e, cb) {
        var attrs, node;
        if (!e.domNode) {
          attrs = {};
          if (e.id) {
            attrs.id = e.id;
          }
          node = Object.dom.createElement(e.domNodeTag, Object.update(attrs, e.domNodeAttrs));
          e.domNode = node;
        }
        if (!e.domNode.parentNode) {
          this.contentNode.appendChild(e.domNode);
        }
        return Object.emit(Object.update({
          type: "Box",
          uri: 'axoid://create',
          callback: cb
        }, e));
      };
      return {
        createAsyncValueCallback: function(T) {
          return (function(_this) {
            return function(err, value) {
              if (!T._done) {
                T.domNodeClass("!ui-busy");
                return T.prop(_this.id, T.childrenAsyncAdapter(err, value));
              }
            };
          })(this);
        },
        setValueForUri: function(T, uri) {
          T.domNodeClass("ui-busy");
          return Object.emit({
            uri: uri,
            callback: this.createAsyncValueCallback(T)
          });
        },
        setValue: function(T, ch0, opts) {
          var ev;
          ev = Object.update({
            value: ch0
          }, opts);
          Function.perform(T, function(flow) {
            return [
              function() {
                var ch, e, meta, _add, _i, _len;
                meta = this.childrenAdapter(ev.value, ev);
                if (!ev.noReset) {
                  this.removeAllChildren();
                }
                ch = this.getChildren();
                _add = (function(_this) {
                  return function(e) {
                    var cb, pos;
                    pos = ch.length;
                    ch.push(null);
                    cb = flow.wait();
                    return _child.call(_this, e, function(err, e) {
                      ch[pos] = e;
                      return cb(err, e);
                    });
                  };
                })(this);
                if (meta) {
                  for (_i = 0, _len = meta.length; _i < _len; _i++) {
                    e = meta[_i];
                    if (e) {
                      _add.call(this, e);
                    }
                  }
                }
                return flow.next();
              }, function() {
                var e, i, v;
                v = (function() {
                  var _i, _len, _results;
                  _results = [];
                  for (i = _i = 0, _len = arguments.length; _i < _len; i = ++_i) {
                    e = arguments[i];
                    if (i > 1) {
                      _results.push(e);
                    }
                  }
                  return _results;
                }).apply(this, arguments);
                return this.childrenChanged(v, {
                  value: v
                });
              }
            ];
          });
          if (ev.uri) {
            return this.setValueForUri(T, ev.uri);
          }
        },
        done: function(T) {
          T.removeAllChildren();
          return _super.done.call(this, T);
        }
      };
    },
    mixin: function(_super) {
      return {
        createChild: function(e, cb) {
          return _child.call(this, e, (function(_this) {
            return function(err, e) {
              var ch;
              ch = _this.getChildren();
              ch.push(e);
              if (typeof _this.childrenChanged === "function") {
                _this.childrenChanged(ch, {
                  value: ch
                });
              }
              return typeof cb === "function" ? cb(err, e) : void 0;
            };
          })(this));
        },
        childrenAdapter: function(x) {
          return x;
        },
        childrenChanged: function(v, ev) {
          return ev;
        },
        getChildren: function() {
          return this._children || (this._children = []);
        },
        removeAllChildren: function() {
          var e, _i, _len, _ref;
          if (this._children) {
            _ref = this._children;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              e = _ref[_i];
              if (e) {
                e.done();
              }
            }
          }
          return this._children = [];
        },
        setChildren: function(meta, opts) {
          return this.prop("children", meta, opts);
        },
        childrenAsyncAdapter: function(err, value) {
          if (err) {
            return {
              id: "Html",
              html: String.localize(err.reason || "unknown_error")
            };
          } else {
            return value;
          }
        }
      };
    }
  });


  /*
  Basic Dom UI views.
   */

  Object.emit({
    uri: "axoid://define/View",
    properties: ["domNode:Node", "style:Style", "hidden:Hidden"]
  });

  Object.emit({
    uri: "axoid://define/View/Html",
    properties: ["html:Html"]
  });

  Object.emit({
    uri: "axoid://define/View/Label",
    properties: ["caption:Caption"],
    domNodeTag: "span"
  });

  Object.emit({
    uri: "axoid://define/View/Box",
    properties: ["children:Children"]
  });

}).call(this);


/*
UI field ancestor.
 */

(function() {
  Object.fire({
    uri: "axoid://define/Box/Field",
    properties: ["caption:Caption", "value:Value", "disabled:Disabled", 'hint'],
    children: [],
    caption: "",
    style: "form-group",
    valueBoxStyle: "form-input-container",
    valueStyle: "form-control",
    captionStyle: "control-label",
    methods: function(_super) {
      return {
        init: function() {
          var _ref;
          this.caption = this.caption || ((_ref = this.id) != null ? _ref.split(".")[-1] : void 0);
          return _super.init.call(this);
        },
        childrenAdapter: function(ch) {
          var T;
          T = this;
          if (!(ch != null ? ch.length : void 0)) {
            ch = [
              {
                type: "View",
                onInited: function() {
                  return T.valueElt = this;
                },
                style: this.valueStyle,
                tapped: function(ev) {
                  return T.doFocus(ev);
                }
              }
            ];
          }
          return [
            {
              type: "Label",
              onInited: function() {
                return T.captionElt = this;
              },
              domNode: Object.dom.createComplexElement(String.format("<label class=\"{0}\" for=\"{1}_input\"/>", this.captionStyle, this.id))
            }, {
              type: "Box",
              style: this.valueBoxStyle,
              children: ch
            }
          ];
        },
        launchEditor: function() {},
        doFocus: function(ev) {
          return this.launchEditor(ev);
        },
        isEditable: function() {
          return !this.readOnly;
        },
        valueChanged: function() {
          return this.redrawValue();
        },
        redrawValue: function() {
          if (this.valueElt) {
            this.valueElt.domNode.innerHTML = this.getCValue();
          }
          return this.domNodeClass("!error");
        },
        doneEditor: function(value) {
          if (value === this.getValue()) {
            return;
          }
          return this.setValue(value);
        },
        addValidationRule: function(rule) {
          this.rules = (this.rules || []).concat(rule);
        },
        checkIfValid: function() {
          var e, err, rule, valid, _i, _j, _len, _len1, _ref, _ref1;
          err = {
            stack: []
          };
          if (this.isValueRequired() && this.isEmptyValue()) {
            err.stack.push({
              reason: "empty_required_field",
              message: String.localize("empty_required_field", String.localize(this.caption || this.id))
            });
          }
          if (rules) {
            _ref = this.rules;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              rule = _ref[_i];
              rule.call(this, err);
            }
          }
          valid = !err.stack.length;
          if (!valid) {
            _ref1 = err.stack;
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              e = _ref1[_j];
              e.entity = this;
            }
          }
          this.toggleDomNodeClass("error", !valid);
          return err;
        },
        isValueRequired: function() {
          return this.valueRequired;
        },
        getCValue: function() {
          return this.getValue();
        },
        getCaptionHtml: function(v, ev) {
          return String.localize(v || this.id) + (this.valueRequired ? " <span class=\"required\">*</span>" : "");
        },
        disabledChanged: function(v) {
          _super.disabledChanged.apply(this, arguments);
          return Object.prop(this, "valueElt.domNode.disabled", v);
        },
        hintChanged: function(v) {
          var _ref;
          return (_ref = this.hintElt) != null ? _ref.prop('caption', v) : void 0;
        }
      };
    }
  });

  Object.fire({
    uri: "axoid://define/Field/Input",
    alive: true,
    maxLength: 128,
    inputTag: "input",
    inputType: "text",
    methods: function(_super) {
      return {
        childrenAdapter: function(ch) {
          ch = this.getInputChildrenMeta();
          return _super.childrenAdapter.call(this, ch);
        },
        getInputChildrenMeta: function(ch) {
          var T;
          T = this;
          return [
            {
              id: this.id + "_input:View",
              domNode: this.create_inputNode(),
              style: this.valueStyle,
              onInited: function() {
                return T.valueElt = this;
              }
            }
          ];
        },
        create_inputNode: function() {
          var _done;
          _done = this.create_onblur_handler();
          return Object.dom.createComplexElement(String.format("<{0} type=\"{1}\" name=\"{2}\" maxLength=\"{3}\"/>", this.inputTag, this.inputType, this.id, this.maxLength), Object.update({
            placeholder: String.localize(this.placeholder),
            onblur: _done,
            onfocusleave: _done,
            onkeydown: this.create_onkeydown_handler()
          }, this.inputNodeAttrs));
        },
        create_onblur_handler: function() {
          var T;
          T = this;
          return function(ev) {
            T.doneEditor(this.value);
            return true;
          };
        },
        create_onkeydown_handler: function() {
          var T;
          T = this;
          return function(ev) {
            ev = ev || window.event;
            if (ev.keyCode === 13) {
              T.doneEditor(this.value);
            }
            return true;
          };
        },
        redrawValue: function() {
          var _ref;
          if ((_ref = this.valueElt) != null) {
            _ref.domNode.value = this.getValue();
          }
          return this.domNodeClass("!ui-error");
        },
        tapped: function(ev) {
          var _ref;
          return (_ref = this.valueElt) != null ? _ref.domNode.focus() : void 0;
        },
        hintChanged: function(v) {
          var _ref;
          return (_ref = this.valueElt) != null ? _ref.domNode.placeholder = v : void 0;
        }
      };
    }
  });

  Object.fire({
    uri: "axoid://define/Input/Textarea",
    inputTag: "textarea",
    maxLength: 8192
  });

  Object.fire({
    uri: "axoid://define/Input/PasswordInput",
    inputType: "password"
  });

  Object.fire({
    uri: "axoid://define/Input/DateInput",
    inputType: "date"
  });

  Object.fire({
    uri: "axoid://define/Field/Checkbox",
    captionStyle: "checkbox",
    methods: function(_super) {
      return {
        childrenAdapter: function(ch) {
          var T, _done;
          T = this;
          _done = function(ev) {
            T.doneEditor(!!this.checked);
            return true;
          };
          return [
            {
              type: "Box",
              style: this.valueBoxStyle,
              children: [
                {
                  type: "View",
                  onInited: function() {
                    return T.valueElt = this;
                  },
                  domNodeTag: "input",
                  style: this.valueStyle1,
                  domNodeAttrs: {
                    onchange: _done,
                    type: "checkbox",
                    value: true,
                    disabled: this.disabled,
                    checked: !!this.getValue()
                  }
                }, {
                  type: "View",
                  onInited: function() {
                    return T.captionElt = this;
                  },
                  domNodeTag: "span",
                  css: "display:inline;padding-left:8px"
                }
              ]
            }
          ];
        }
      };
    },
    redrawValue: function() {
      if (this.valueElt) {
        this.valueElt.domNode.checked = !!this.getValue();
      }
    }
  });

  Object.fire({
    uri: "axoid://define/Box/Fieldset",
    domNodeTag: "fieldset",
    methods: function(_super) {
      return {
        childrenAdapter: function(ch) {
          ch.unshift({
            id: this.id + "_label:Label",
            domNodeTag: "legend",
            style: this.captionStyle,
            caption: this.caption
          });
          return ch;
        }
      };
    }
  });

}).call(this);

(function() {
  Object.fire({
    uri: "axoid://define/Property/SubmitSupport",
    mixin: function(_super) {
      var RE_TILDA;
      RE_TILDA = /~/g;
      return {
        validateFields: function() {
          var ev, ev0, f, firstInput, valid, _i, _len, _ref;
          ev = {
            stack: []
          };
          valid = true;
          if (this.fields) {
            _ref = this.fields;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              f = _ref[_i];
              ev0 = Object.entity.get(f).checkIfValid();
              if (ev0.stack.length) {
                ev.stack.push.apply(ev.stack, ev0.stack);
              }
            }
            if (!(valid = !ev.stack.length)) {
              if (firstInput = ev.stack[0].entity.valueElt) {
                firstInput.domNode.focus();
              }
              this.error(ev);
            }
          }
          return valid;
        },
        fieldsValues: function() {
          var key, r, _i, _j, _len, _len1, _ref, _ref1;
          r = {};
          if (this.fields) {
            _ref = this.fields;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              key = _ref[_i];
              Object.prop(r, key.replace(RE_TILDA, "."), Object.entity.get(key).getValue());
            }
          }
          if (this.inputs) {
            _ref1 = this.inputs;
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              key = _ref1[_j];
              Object.prop(r, key.replace(RE_TILDA, "."), window.document.getElementById(key).value);
            }
          }
          return r;
        },
        getFields: function() {
          var key, r, _i, _len, _ref;
          r = {};
          if (this.fields) {
            _ref = this.fields;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              key = _ref[_i];
              r[key] = Object.entity.get(key);
            }
          }
          return r;
        },
        create_onload_handler: function() {
          var T;
          T = this;
          return function(ev) {
            var doc, err, frame, value, win;
            if (!T.frameElt) {
              return;
            }
            frame = T.frameElt.domNode;
            doc = frame.contentDocument;
            win = frame.contentWindow || doc.window || frame;
            if (win.location.href === "about:blank") {
              return;
            }
            err = null;
            value = Object.parse(doc.body.innerText || doc.body.textContent || doc.body.innerHTML);
            if (!value) {
              value = {
                errors: [
                  {
                    reason: "server_error"
                  }
                ]
              };
            }
            if (value.errors && value.errors.length) {
              err = {
                stack: value.errors
              };
            }
            return T.onResult(err, value);
          };
        },
        onResult: function(err, value) {
          if (err) {
            return this.error(err);
          } else {
            return this.success(value);
          }
        },
        error: function(err) {
          return Object.dom.handleError(err, this);
        },
        success: function(x) {
          return x;
        }
      };
    }
  });

  Object.fire({
    uri: "axoid://define/Button/AsyncButton",
    properties: ["support:SubmitSupport"],
    busyCaption: "in_progress",
    methods: function(_super) {
      return {
        createAsyncDoc: function() {
          return this.fieldsValues();
        },
        async: function() {
          return this.validateFields() && this.createAsyncEvent();
        },
        createAsyncEvent: function() {
          return {
            uri: this.asyncUrl,
            doc: this.createAsyncDoc(),
            callback: this.createAsyncCallback()
          };
        },
        createAsyncCallback: function() {
          return this.onResult;
        }
      };
    }
  });

  Object.fire({
    uri: "axoid://define/Box/Form",
    properties: ["disabled:Disabled", "support:SubmitSupport", "value:Values"],
    domNodeTag: "form",
    domNodeAttrs: {
      onsubmit: function() {
        return false;
      }
    },
    submit: function() {
      return this.domNode.submit();
    }
  });

  Object.fire({
    uri: "axoid://define/Form/SubmitForm",
    enctype: "application/x-www-form-urlencoded",
    method: "post",
    action: "#",
    methods: function(_super) {
      return {
        init: function() {
          var T, id;
          T = this;
          id = this.id;
          if (!this.domNode) {
            this.domNode = Object.dom.createComplexElement(String.format("<form enctype=\"{0}\" method=\"{1}\" target=\"{2}_target\" action=\"{3}\"></form>", this.enctype, this.method, this.id, this.action), this.domNodeAttrs);
          }
          Object.dom.listenEvents(this, "submit", function() {
            return T.validateFields();
          });
          _super.init.call(this);
          return this.createChild({
            id: id + "_target:View",
            onInited: function() {
              return T.frameElt = this;
            },
            domNode: Object.dom.createComplexElement("<iframe src=\"about:blank\" style=\"display:none;\" name=\"" + this.id + "_target\"></iframe>")
          }, function(err, e) {
            e && Object.dom.listenEvents(e, "load", this.create_onload_handler());
          });
        },
        childrenAdapter: function(ch) {
          return [].concat(ch);
        }
      };
    }
  });

  Object.fire({
    uri: "axoid://define/View/SubmitButton",
    methods: function(_super) {
      return {
        init: function() {
          this.domNode = Object.dom.createComplexElement("<input type=\"submit\"/>", {
            value: String.localize(this.caption)
          });
          return _super.init.call(this);
        }
      };
    }
  });

  Object.fire({
    uri: "axoid://define/Field/FileContent",
    methods: function(_super) {
      return {
        childrenAdapter: function(ch) {
          var T;
          return _super.childrenAdapter.call(T = this, [
            {
              id: this.id + "_input:View",
              onInited: function() {
                return T.valueElt = this;
              },
              domNode: Object.dom.createComplexElement(String.format("<input type=\"file\" class=\"{0}\" name=\"{1}\"/>", this.valueStyle, this.fileFieldName || this.id), {
                onchange: this.create_onchange_handler()
              })
            }
          ].concat(ch));
        },
        create_onchange_handler: function() {
          return (function(_this) {
            return function(ev) {
              var f, reader, _i, _len, _ref;
              _ref = ev.target.files;
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                f = _ref[_i];
                reader = new FileReader();
                reader.onload = function(e) {
                  _this.prop('file', f);
                  return _this.prop('value', e.target.result);
                };
                reader.readAsBinaryString(f);
                return;
              }
            };
          })(this);
        }
      };
    }
  });

  Object.fire({
    uri: "axoid://define/Field/FileUploader",
    properties: ["attempt", "submitSupport:SubmitSupport"],
    methods: function(_super) {
      return {
        init: function() {
          if (!this.domNode) {
            this.domNode = Object.dom.createComplexElement(String.format("<form enctype=\"multipart/form-data\", method=\"post\" target=\"{0}_target\" action=\"{1}\"></form>", this.id, this.action), this.domNodeAttrs);
          }
          _super.init.call(this);
          Object.dom.listenEvents(this.frameElt, "load", this.create_onload_handler());
        },
        childrenAdapter: function(ch) {
          var T, id;
          T = this;
          id = this.id;
          return _super.childrenAdapter.call(this, [
            {
              id: id + "_input:View",
              onInited: function() {
                return T.valueElt = this;
              },
              domNode: Object.dom.createComplexElement(String.format("<input type=\"file\" class=\"{0}\" name=\"{1}\"/>", this.valueStyle, this.fileFieldName || id), {
                onchange: this.create_onchange_handler()
              })
            }, {
              id: id + "_link:View",
              onInited: function() {
                return T.linkElt = this;
              },
              domNodeTag: "a",
              domNodeAttrs: {
                target: "_blank"
              }
            }, {
              onInited: function() {
                return T.frameElt = this;
              },
              id: id + "_target:View",
              domNode: Object.dom.createComplexElement("<iframe src=\"about:blank\" style=\"display:none;\" name=\"" + this.id + "_target\"></iframe>", {
                onload: this.create_onload_handler()
              })
            }
          ].concat(ch));
        },
        submit: function() {
          var _base;
          return typeof (_base = this.domNode).submit === "function" ? _base.submit() : void 0;
        },
        create_onchange_handler: function() {
          return function(ev) {
            return true;
          };
        },
        error: function(ev) {
          ev.alertEntity = this.linkElt;
          return _super.error.call(this, ev);
        },
        success: function(ev) {
          var a, url;
          url = "" + (ev && ev.uri || "");
          if (url) {
            a = this.linkElt.domNode;
            a.className = "";
            a.innerHTML = "link";
            this.setValue(a.href = "//" + url);
          }
          return this.prop("attempt", 1 + (this.prop("attempt" || 0)));
        }
      };
    }
  });

}).call(this);
