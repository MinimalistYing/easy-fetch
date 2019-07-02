import combineURL from './combineURL'
import InterceptorManager from './InterceptorManager'

function Fetch (defaults) {
  this.defaults = defaults

  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  }
}

function dispatchRequest (config) {
  const resolver = config.resolver
  const url = config.url
  delete config.url
  return new Promise((resolve, reject) => {
    window.fetch(url, config).then(res => {
      if (!res.ok) {
        res[resolver]().then(err => reject(err))
      } else {
        resolve(res[resolver]())
      }
    })
  })
}

Fetch.prototype.request = function (url, init = {}) {
  const config = {
    ...this.defaults,
    ...init
  }
  config.url = combineURL(config.base, url)
  const chain = [dispatchRequest, undefined]
  
  let promise = Promise.resolve(config)

  for (let handler of this.interceptors.request.handlers) {
    if (handler) {
      chain.unshift(handler.fulfilled, handler.rejected)
    }
  }

  for (let handler of this.interceptors.response.handlers) {
    if (handler) {
      chain.push(handler.fulfilled, handler.rejected)
    }
  }

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise
  // url = combineURL(this.defaults.base, url)
  // const resolver = init.resolver || this.defaults.resolver
  // return window.fetch(url, {
  //   ...this.defaults,
  //   ...init
  // }).then(res => {
  //   if (!res.ok && typeof this.defaults.onError === 'function') {
  //     return res[resolver]().then(err => {
  //       this.defaults.onError(err, res)
  //       return Promise.reject(err, res)
  //     })
  //   } else {
  //     return res[resolver]()
  //   }
  // })
}

;['get', 'delete', 'head', 'options'].map(method => {
  Fetch.prototype[method] = function (url, init = {}, params) {
    if (typeof params === 'undefined') {
      params = init
      init = {}
    }

    const search = new URLSearchParams()
    Object.entries(params).forEach(kv => {
      if (typeof kv[1] !== 'undefined') {
        if (Array.isArray(kv[1])) {
          for (let item of kv[1]) {
            search.append(kv[0], item)
          }
        } else {
          search.append(kv[0], kv[1])
        }
      }
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
