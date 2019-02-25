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
    mode: 'same-origin'
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
    return window.fetch(url, {
      ...defaults,
      ...init
    })
  }

  ;['get', 'delete', 'head', 'options'].map(method => {
    Fetch.prototype[method] = function (url, init = {}) {
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
    base: ''
  };

  const fetch = new Fetch(config);

  return fetch;

}));
