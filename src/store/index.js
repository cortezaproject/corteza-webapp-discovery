import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    types: [],
    aggregations: [],
    modules: [],
    namespaces: [],
  },
  mutations: {
    updateTypes (state, types) {
      state.types = types
    },
    updateAggregations (state, aggs) {
      state.aggregations = aggs
    },
  },
  actions: {
  },
  modules: {
  },
})
