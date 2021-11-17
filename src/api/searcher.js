import axios from 'axios'
import Vue from 'vue'

export const callDiscoveryAPI = (query, modules, namespaces) => {
  const params = new URLSearchParams()
  if (modules?.length > 0) modules.forEach(m => params.append('moduleAggs', m))
  if (namespaces?.length > 0) namespaces.forEach(n => params.append('namespaceAggs', n))
  const URL = `https://searcher.discovery.staging.cortezaproject.org/?q=${query}`
  return axios(URL, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      Authorization: 'Bearer ' + Vue.prototype.$auth.accessTokenFn,
    },
    params: params,
  })
    .then(response => response.data)
    .catch(error => {
      throw error
    })
}
