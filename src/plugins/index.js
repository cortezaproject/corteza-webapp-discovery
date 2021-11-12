import Vue from 'vue'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import PortalVue from 'portal-vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '../themes/faIcons'

import { plugins } from '@cortezaproject/corteza-vue'

Vue.use(PortalVue)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.use(BootstrapVue, {
  BToast: {
    // see https://bootstrap-vue.org/docs/components/toast#comp-ref-b-toast-props
    autoHideDelay: 7000,
    toaster: 'b-toaster-bottom-right',
  },
})
Vue.use(BootstrapVueIcons)
Vue.use(plugins.Auth(), { app: 'discovery' })
Vue.use(plugins.CortezaAPI('system'))
// Vue.use(plugins.CortezaAPI('discoverySearcher', { baseURL: window.SearcherAPI }))
Vue.use(plugins.Settings, { api: Vue.prototype.$SystemAPI })
