import defaults from './defaults'
import combineURL from './combineURL'

function Fetch (initConfg) {
  this.config = initConfg
}

Fetch.prototype.request = function (url, init = {}) {
  url = combineURL(this.config.base, url)
  return window.fetch(url, {
    ...defaults,
    ...init
  }).then(res => {
    if (res.ok) {
      return res.json()
    } else {
      res.json().then(err => {
        typeof this.config.onError === 'function' && this.config.onError(err)
      })
    }
  })
}

;['get', 'delete', 'head', 'options'].map(method => {
  Fetch.prototype[method] = function (url, init = {}) {
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
