import Fetch from './Fetch'
import config from './config'

const fetch = new Fetch(config)

function bind (fn, thisArg) {
  return function (...args) {
    return fn.apply(thisArg, args)
  }
}

// Now we can use like both `fetch(url, init)` or `fetch.get(url, init)`
const instance = bind(Fetch.prototype.request, fetch)
Object.setPrototypeOf(instance, fetch)
Object.assign(instance, fetch)

export default instance
