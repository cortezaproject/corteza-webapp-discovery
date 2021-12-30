<template>
  <b-container
    fluid
  >
    <b-row class="h-100">
      <b-col
        :cols="map.show ? '5' : '12'"
        class="h-100 p-0"
      >
        <b-form-group class="px-3">
          <b-input-group>
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
            class="px-1 mt-1 text-muted"
          >
            {{ `${numberOfResults} ${this.$t('search-results')}` }}
          </div>
        </b-form-group>

        <div
          v-if="processing"
          class="d-flex justify-content-center mt-5"
        >
          <b-spinner
            variant="primary"
          />
        </div>

        <div
          v-if="filteredHits && !processing"
          class="mh-100 overflow-auto"
        >
          <b-row
            class="w-100 m-0"
            align-h="start"
          >
            <b-col
              v-for="(hit, i) in filteredHits"
              :key="i"
              md="12"
              :lg="map.show ? '12' : '6'"
              :xl="map.show ? '12' : '4'"
              class="mb-4"
            >
              <result-card
                :index="i"
                :hit="hit"
                :show-map="map.show"
                @hover="map.hoverIndex = $event"
              />
            </b-col>
          </b-row>
        </div>
      </b-col>
      <b-col
        v-if="map.show"
        class="p-0"
      >
        <discovery-map
          :markers="map.markers"
          :hover-index="map.hoverIndex"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import ResultCard from '../components/ResultCard.vue'
import { debounce } from 'lodash'
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

      processing: false,

      map: {
        show: false,
        markers: [],
        hoverIndex: undefined,
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
      }, 400),
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
      }, 200),
    },

    '$store.state.namespaces': {
      handler: debounce(function (namespaces) {
        namespaces.length > 0 || (namespaces.length === 0 && this.$store.state.modules.length > 0)
          ? this.getAggregationData()
          : this.getSearchData(this.query)
      }, 200),
    },
  },

  created () {
    this.getAggregationData()
  },

  methods: {
    getSearchData (query = '') {
      this.processing = true

      this.deleteStates()

      const modules = this.$store.state.modules
      const namespaces = this.$store.state.namespaces

      this.$DiscoveryAPI.query({ query, modules, namespaces }).then((response) => {
        if (response) {
          this.hits = response.hits
          if (response.hits) this.getFilteredData()

          this.getMarkers()
          this.processing = false
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
      this.processing = true

      const modules = this.$store.state.modules
      const namespaces = this.$store.state.namespaces

      this.$DiscoveryAPI.query({ query: '', modules, namespaces }).then(response => {
        if (response) {
          this.hits = response.hits
          if (response.hits) this.getFilteredData()

          this.$store.commit('updateAggregations', response.aggregations)

          this.getMarkers()
          this.processing = false
        }
      })
        .catch(this.toastErrorHandler(this.$t('notification.search-error')))
    },

    getMarkers () {
      const markers = []

      this.filteredHits.forEach(({ type, value }) => {
        if (type === 'compose:record' && Array.isArray(value.values)) {
          let coordinates = (JSON.parse((value.values.find(({ name, value = [] }) => {
            return value && value.find(v => {
              return v.toString().includes('{"coordinates":[')
            })
          }) || {}).value || '{}') || {}).coordinates || []

          if (coordinates.length) {
            coordinates = coordinates.map(parseFloat)
            markers.push({ id: value.recordID, coordinates })
          }
        }
      })

      this.map.markers = markers
    },

    deleteStates () {
      this.hits = null
      this.map.markers = []
      this.filteredHits.splice(0, this.filteredHits.length)
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
