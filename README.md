# the-fetch
Original Fetch API with some additional helpful feature

# Feature
* Global onError callback function
* Global base URL
* Request & Response Intecpetors

# Browser Support
Sorry ~ Only support the modern browsers

# Installation
```
npm i the-fetch --save
```

# Quick Start

```js
import fetch from 'the-fetch'

fetch.defaults.base = 'https://www.xxx.com/' // set base URL

/**
 * If not set the response will resolve to json like
 * `fetch('').then(res => res.json())`
 * so in the example below you will see you can get json data only resolve once
 * If you want to resolve the res in another format you can pass the resolver in options like
 * `fetch('', { resolver: 'text' })` will resolve as `res.text()`
 * 
 */
fetch.get('/getData').then(res => console.log(res))
// or
fetch('/getData').then(res => console.log(res))

fetch.post('/addData', data, init).then(res => console.log(res))
// or
fetch('/addData', {
  method: 'POST',
  body: data
}).then(res => console.log(res))
```

# Interceptor
```js
import fetch from 'the-fetch'

// Use request interceptor to change the initial config
fetch.interceptors.request.use(config => {
  // this config is the final config that will pass to fetch(url, config)
  config.extra = 'Hello'
  return config
}, err => {
  return Promise.reject(err)
})

// Use response interceptor to do some extra work when request finished
fetch.interceptors.response.use(response => {
  return response
}, err => {
  console.log(err.message)
  return Promise.reject(err)
})
```