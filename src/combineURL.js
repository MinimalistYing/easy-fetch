// if the url is not absolute combine the base URL with the request URL into a absolute URL
export default function combineURL (base, relative) {
  if (!base || !relative || isAbsoluteURL(relative)) return relative
  return base.replace(/\/+$/, '') + '/' + relative.replace(/^\/+/, '')
}

function isAbsoluteURL (url) {
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}
