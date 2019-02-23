function Fetch() {

}

Fetch.prototype.request = (url, init = {}) => {
  whidow.fetch(url, init)
}

export default Fetch
