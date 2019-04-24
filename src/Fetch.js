import combineURL from './combineURL'

function Fetch (defaults) {
  this.defaults = defaults
}

Fetch.prototype.request = function (url, init = {}) {
  url = combineURL(this.defaults.base, url)
  const resolver = init.resolver || this.defaults.resolver
  return window.fetch(url, {
    ...this.defaults,
    ...init
  }).then(res => {
    if (!res.ok && typeof this.defaults.onError === 'function') {
      return res[resolver]().then(err => {
        this.defaults.onError(err, res)
        return Promise.reject(err, res)
      })
    } else {
      return res[resolver]()
    }
  })
}

;['get', 'delete', 'head', 'options'].map(method => {
  Fetch.prototype[method] = function (url, init = {}, params) {
    if (typeof params === 'undefined') {
      params = init
      init = {}
    }

    const search = new URLSearchParams()
    Object.entries(params).forEach(kv => {
      typeof kv[1] !== 'undefined' && search.append(kv[0], kv[1])
    })
    url = search.toString() ? `${url}?${search.toString()}` : url

    return this.request(url, {
      ...init,
      method: method.toUpperCase()
    })
  }
})

;['post', 'put', 'patch'].map(method => {
  Fetch.prototype[method] = function (url, body = {}, init = {}) {
    if (typeof body === 'object' && !(body instanceof FormData)) {
      body = JSON.stringify(body)
      if (!init.headers || !init.headers['Content-Type']) {
        if (!init.headers) init.headers = {}
        init.headers['Content-Type'] = 'application/json'
      }
    }
    return this.request(url, {
      ...init,
      method: method.toUpperCase(),
      body
    })
  }
})

export default Fetch
