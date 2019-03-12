import defaults from './defaults'
import combineURL from './combineURL'

function Fetch (initConfg) {
  this.config = initConfg
}

Fetch.prototype.request = function (url, init = {}) {
  url = combineURL(this.config.base, url)
  const resolver = init.resolver || defaults.resolver
  return window.fetch(url, {
    ...defaults,
    ...init
  }).then(res => {
    if (!res.ok && typeof this.config.onError === 'function') {
      return res[resolver]().then(err => {
        this.config.onError(err, res)
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
    if (typeof body === 'object') {
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
