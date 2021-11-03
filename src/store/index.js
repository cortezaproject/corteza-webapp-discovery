import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    types: [],
  },
  mutations: {
    updateTypes (state, types) {
      state.types = types
    },
  },
  actions: {
  },
  modules: {
  },
})
