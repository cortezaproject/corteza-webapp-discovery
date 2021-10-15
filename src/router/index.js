import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    name: 'root',
    path: '/',
    component: () => import('../views/Layout'),
  },
  // When everything else fails, go to dashboard
]

const router = new VueRouter({
  mode: 'history',
  routes,
})

export default router
