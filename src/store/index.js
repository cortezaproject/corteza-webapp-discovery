import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    types: [],
    aggregations: [],
    module: [],
    namespace: [],
  },
  mutations: {
    updateTypes (state, types) {
      state.types = types
    },
    updateAggregations (state, aggs) {
      state.aggregations = aggs
    },
    updateModule (state, value) {
      state.module = value
    },
    updateNamespace (state, value) {
      state.namespace = value
    },
  },
  actions: {
  },
  modules: {
  },
})
