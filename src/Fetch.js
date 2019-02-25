import defaults from './defaults'
import combineURL from './combineURL'

function Fetch(initConfg) {
  this.config = initConfg
}

Fetch.prototype.request = (url, init = {}) => {
  url = combineURL(url)
  whidow.fetch(url, {
    ...defaults,
    ...init
  })
}

;['get', 'delete', 'head', 'options'].map(method => {
  Fetch.prototype[method] = (url, init = {}) => {
    return this.request(url , {
      ...init,
      method: method.toUpperCase()
    })
  }
})

;['post', 'put', 'patch'].map(method => {
  Fetch.prototype[method] = (url, body = {}, init = {}) => {
    return this.request(url , {
      ...init,
      method: method.toUpperCase(),
      body
    })
  }
})

export default Fetch
