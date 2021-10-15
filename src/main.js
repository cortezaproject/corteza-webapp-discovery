import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import PortalVue from 'portal-vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { i18n } from '@cortezaproject/corteza-vue'

import './themes'
import './config-check'
import './console-splash'
import './plugins'
import './themes/faIcons'

Vue.config.productionTip = false
// const notProduction = (process.env.NODE_ENV !== 'production')

Vue.use(PortalVue)
Vue.component('font-awesome-icon', FontAwesomeIcon)

new Vue({
  router,
  store,
  i18n: i18n(Vue,
    { app: 'corteza-webapp-discovery' },
    'discovery',
  ),
  render: h => h(App),
}).$mount('#app')
