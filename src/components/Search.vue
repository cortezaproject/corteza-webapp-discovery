<template>
  <b-container fluid>
    <h1>Corteza</h1>
    <b-row class="my-3">
      <b-col
        sm="12"
        md="9"
        lg="5"
        xl="3"
      >
        <b-form-input
          v-model="searchText"
          :placeholder="this.$t('input-placeholder')"
        />
      </b-col>
    </b-row>
    <div
      class="mb-3 text-muted"
    >
      {{ `${numberOfResults} ${this.$t('search-results')}` }}
    </div>
    <div
      v-if="spinner"
      class="d-flex justify-content-center mt-5"
    >
      <b-spinner
        variant="info"
      />
    </div>
    <div v-if="filteredHits && !spinner">
      <b-row
        align-h="start"
      >
        <b-col
          v-for="(hit, i) in filteredHits"
          :key="i"
          md="12"
          lg="6"
          xl="4"
          class="mb-4"
        >
          <result-card :hit="hit" />
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>

<script>
import ResultCard from '../components/ResultCard.vue'
import { debounce } from 'lodash'
import { callDiscoveryAPI } from '../api/searcher'

export default {
  i18nOptions: {
    namespaces: 'search',
  },
  components: {
    ResultCard,
  },
  data () {
    return {
      searchText: null,
      hits: [],
      filteredHits: [],
      spinner: false,
    }
  },
  computed: {
    numberOfResults () {
      return this.filteredHits.length
    },
  },
  watch: {
    searchText: {
      handler: debounce(function (text) {
        this.getSearchData(text)
      }, 700),
    },
    '$store.state.types': {
      handler: function () {
        this.getFilteredData()
      },
    },
    '$store.state.module': {
      handler: debounce(function () {
        this.getAggregationData()
      }, 1500),
    },
    '$store.state.namespace': {
      handler: debounce(function () {
        this.getAggregationData()
      }, 1500),
    },
  },
  methods: {
    getSearchData (text) {
      this.deleteStates()
      if (text.length > 0) {
        this.spinner = true
        callDiscoveryAPI(text).then((response) => {
          if (response) {
            this.spinner = false
            this.hits = response.hits
            if (response.hits) {
              this.getFilteredData()
              this.$store.commit('updateAggregations', response.aggregations)
            }
          }
        })
          .catch(this.toastErrorHandler(this.$t('notification.search-error')))
      }
    },
    getFilteredData () {
      if (this.$store.state.types.length > 0 && this.hits) {
        const results = this.hits.filter(hit => this.$store.state.types.includes(hit.type))
        this.filteredHits.splice(0, this.filteredHits.length, ...results)
      } else if (this.hits) {
        this.filteredHits.splice(0, this.filteredHits.length, ...this.hits)
      }
    },
    getAggregationData () {
    },
    deleteStates () {
      this.hits = null
      this.filteredHits.splice(0, this.filteredHits.length)
      this.$store.commit('updateAggregations', [])
      this.$store.commit('updateModule', [])
      this.$store.commit('updateNamespace', [])
    },
  },
}
</script>
