import axios from 'axios'
import Vue from 'vue'

export const callDiscoveryAPI = (query) => {
  const URL = `${window.SearcherAPI}/?q=${query}`
  return axios(URL, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      Authorization: 'Bearer ' + Vue.prototype.$auth.accessTokenFn,
    },
  })
    .then(response => response.data)
    .catch(error => {
      throw error
    })
}
