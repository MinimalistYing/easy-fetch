export default {
  method: 'GET',
  headers: {
    'Accept': 'application/json, text/plain, */*'
  },
  mode: 'cors', // allow cors

  resolver: 'json', // reslove response to json
  base: '',
  onError: () => {}
}
