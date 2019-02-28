(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.theFetch = factory());
}(this, function () { 'use strict';

  var defaults = {
    method: 'GET',
    headers: {
      'Accept': 'application/json, text/plain, */*'
    },
    mode: 'cors',

    resolver: 'json'
  };

  function combineURL (base, relative) {
    if (!base || !relative || isAbsoluteURL(relative)) return relative
    return base.replace(/\/+$/, '') + '/' + relative.replace(/^\/+/, '')
  }

  function isAbsoluteURL (url) {
    return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
  }

  function Fetch (initConfg) {
    this.config = initConfg;
  }

  Fetch.prototype.request = function (url, init = {}) {
    url = combineURL(this.config.base, url);
    const resolver = init.resolver || defaults.resolver;
    return window.fetch(url, {
      ...defaults,
      ...init
    }).then(res => {
      if (!res.ok && typeof this.config.onError === 'function') {
        res[resolver]().then(err => {
          this.config.onError(err);
        });
      } else {
        return res[resolver]()
      }
    })
  }

  ;['get', 'delete', 'head', 'options'].map(method => {
    Fetch.prototype[method] = function (url, init = {}, params) {
      if (typeof params === 'undefined') {
        params = init;
        init = {};
      }

      const search = new URLSearchParams();
      Object.entries(params).forEach(kv => {
        typeof kv[1] !== 'undefined' && search.append(kv[0], kv[1]);
      });
      url = search.toString() ? `${url}?${search.toString()}` : url;

      return this.request(url, {
        ...init,
        method: method.toUpperCase()
      })
    };
  })

  ;['post', 'put', 'patch'].map(method => {
    Fetch.prototype[method] = function (url, body = {}, init = {}) {
      if (typeof body === 'object') {
        body = JSON.stringify(body);
        if (!init.headers || !init.headers['Content-Type']) {
          if (!init.headers) init.headers = {};
          init.headers['Content-Type'] = 'application/json';
        }
      }
      return this.request(url, {
        ...init,
        method: method.toUpperCase(),
        body
      })
    };
  });

  var config = {
    base: '',
    onError: () => {}
  };

  const fetch = new Fetch(config);

  // Now we can use like both `fetch(url, init)` or `fetch.get(url, init)`
  function bind (fn, thisArg) {
    return function (...args) {
      return fn.apply(thisArg, args)
    }
  }

  const instance = bind(Fetch.prototype.request, fetch);
  Object.setPrototypeOf(instance, fetch);
  Object.assign(instance, fetch);

  return instance;

}));
