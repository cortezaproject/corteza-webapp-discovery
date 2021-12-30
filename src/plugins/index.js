import Vue from 'vue'
import { plugins } from '@cortezaproject/corteza-vue'
import DiscoveryAPI from './searcher.js'

Vue.use(plugins.Auth(), { app: 'discovery' })
Vue.use(plugins.CortezaAPI('system'))
Vue.use(plugins.Settings, { api: Vue.prototype.$SystemAPI })
Vue.use(DiscoveryAPI())
