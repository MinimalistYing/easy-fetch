# the-fetch
Original Fetch API with some additional helpful feature

# Feature
* Global onError callback function
* Global base URL

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
fetch.defaults.onError = err => console.log(err) // set error callback

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