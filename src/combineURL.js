export default function combineURL(base, relative) {
  if(!base || !relative || isAbsoluteURL(relative)) return relative
  return base.replace(/\/+&/, '') + '/' + relative.replace(/^\/+/, '')
}

function isAbsoluteURL(url) {
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}