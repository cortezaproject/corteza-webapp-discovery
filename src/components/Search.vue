<template>
  <b-container fluid>
    <b-row class="my-3">
      <b-col
        sm="12"
        md="9"
        lg="5"
        xl="3"
      >
        <b-input-group>
          <b-form-input
            v-model="searchText"
            :placeholder="this.$t('input-placeholder')"
            autocomplete="off"
          />
          <b-input-group-append>
            <b-input-group-text class="text-primary bg-white">
              <font-awesome-icon
                :icon="['fas', 'search']"
              />
            </b-input-group-text>
          </b-input-group-append>
        </b-input-group>
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
        variant="primary"
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
    '$store.state.modules': {
      handler: debounce(function (modules) {
        modules.length > 0 ? this.getAggregationData() : this.getSearchData(this.searchText)
      }, 1000),
    },
    '$store.state.namespaces': {
      handler: debounce(function (namespaces) {
        namespaces.length > 0 ? this.getAggregationData() : this.getSearchData(this.searchText)
      }, 1000),
    },
  },
  created () {
    this.getSearchData('')
  },
  methods: {
    getSearchData (text) {
      console.log('getSearchData')
      this.deleteStates()
      this.spinner = true
      callDiscoveryAPI(text).then((response) => {
        if (response) {
          this.spinner = false
          this.hits = response.hits
          if (response.hits) this.getFilteredData()
          this.$store.commit('updateAggregations', response.aggregations)
        }
      })
        .catch(this.toastErrorHandler(this.$t('notification.search-error')))
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
      const modules = this.$store.state.modules
      const namespaces = this.$store.state.namespaces
      if (modules.length > 0 || namespaces.length > 0) {
        this.spinner = true
        callDiscoveryAPI('', modules, namespaces).then((response) => {
          if (response) {
            this.spinner = false
            this.hits = response.hits
            if (response.hits) {
              this.getFilteredData()
            }
          }
        })
          .catch(this.toastErrorHandler(this.$t('notification.search-error')))
      }
    },
    deleteStates () {
      console.log('aggregations', this.$store.state.aggregations)
      console.log('modules', this.$store.state.modules)
      console.log('namespaces', this.$store.state.namespaces)
      this.hits = null
      this.filteredHits.splice(0, this.filteredHits.length)
      if (this.$store.state.aggregations.length > 0) this.$store.commit('updateAggregations', [])
      if (this.$store.state.modules.length > 0) this.$store.commit('updateModules', [])
      if (this.$store.state.namespaces.length > 0) this.$store.commit('updateNamespaces', [])
    },
  },
}
</script>
