<template>
  <b-container fluid>
    <b-row>
      <b-col
        :cols="map.show ? '5' : '12'"
      >
        <b-input-group
          :class="map.show ? '' : 'w-25'"
        >
          <b-form-input
            v-model="query"
            :placeholder="this.$t('input-placeholder')"
            autocomplete="off"
          />
          <b-input-group-append>
            <b-input-group-text class="text-primary bg-white">
              <font-awesome-icon
                :icon="['fas', 'search']"
              />
            </b-input-group-text>
            <b-button
              variant="light"
              rounded
              style="z-index: 100;"
              @click="toggleMap"
            >
              <font-awesome-icon
                :icon="['fas', 'map-marked-alt']"
              />
            </b-button>
          </b-input-group-append>
        </b-input-group>

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
      </b-col>
      <b-col
        v-if="map.show"
      >
        <discovery-map
          class="sticky-top"
          :markers="map.markers"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import ResultCard from '../components/ResultCard.vue'
import { debounce } from 'lodash'
import { callDiscoveryAPI } from '../api/searcher'
import DiscoveryMap from './DiscoveryMap.vue'

export default {
  i18nOptions: {
    namespaces: 'search',
  },

  components: {
    ResultCard,
    DiscoveryMap,
  },

  data () {
    return {
      query: '',

      hits: [],
      filteredHits: [],

      spinner: false,

      map: {
        show: false,
        markers: [],
      },
    }
  },

  computed: {
    numberOfResults () {
      return this.filteredHits.length
    },
  },

  watch: {
    query: {
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
        modules.length > 0 || (modules.length === 0 && this.$store.state.namespaces.length > 0)
          ? this.getAggregationData()
          : this.getSearchData(this.query)
      }, 1000),
    },

    '$store.state.namespaces': {
      handler: debounce(function (namespaces) {
        namespaces.length > 0 || (namespaces.length === 0 && this.$store.state.modules.length > 0)
          ? this.getAggregationData()
          : this.getSearchData(this.query)
      }, 1000),
    },
  },

  created () {
    this.getSearchData('')
  },

  methods: {
    getSearchData (text) {
      this.deleteStates()
      this.spinner = true
      callDiscoveryAPI(text).then((response) => {
        if (response) {
          this.spinner = false
          this.hits = response.hits
          if (response.hits) this.getFilteredData()
          this.$store.commit('updateAggregations', response.aggregations)

          this.getMarkers()
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

    getMarkers () {
      const markers = []

      this.filteredHits.forEach(({ type, value }) => {
        if (type === 'compose:record') {
          let coordinates = (JSON.parse((value.values.find(({ name }) => name === 'Geo') || {}).value || '{}') || {}).coordinates || []
          coordinates = coordinates.map(parseFloat)
          markers.push({ id: value.recordID, coordinates })
        }
      }, [])

      this.map.markers = markers
    },

    deleteStates () {
      this.hits = null
      this.map.markers = []
      this.filteredHits.splice(0, this.filteredHits.length)
      if (this.$store.state.modules.length > 0) this.$store.commit('updateModules', [])
      if (this.$store.state.namespaces.length > 0) this.$store.commit('updateNamespaces', [])
    },

    toggleMap () {
      this.map.show = !this.map.show
    },
  },
}
</script>

<style lang="scss" scoped>
.toolbar {
  bottom: 0;
  right: 0;
}
</style>
