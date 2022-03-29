<template>
  <b-container
    fluid
    class="h-100 mh-100 p-0"
  >
    <b-row
      no-gutters
    >
      <b-col
        md="12"
        :lg="map.show ? '7' : '12'"
        :xl="map.show ? '8' : '12'"
        class="results-container"
        :class="{ 'with-map': map.show }"
      >
        <b-form-group class="px-3">
          <b-input-group
            size="lg"
          >
            <b-form-input
              v-model="query"
              :disabled="processing"
              :placeholder="$t('input-placeholder')"
              autocomplete="off"
              class="bg-white"
            />
            <b-input-group-append>
              <b-button
                v-if="query"
                variant="link"
                class="bg-white border-left-0"
                style="border: 2px solid #E4E9EF;"
                @click="query = ''"
              >
                <font-awesome-icon
                  :icon="['fas', 'times']"
                />
              </b-button>
              <b-input-group-text class="text-primary bg-white">
                <font-awesome-icon
                  :icon="['fas', 'search']"
                />
              </b-input-group-text>
            </b-input-group-append>
          </b-input-group>

          <div
            class="d-flex align-items-center justify-content-between px-1 mt-1 text-muted"
          >
            <span
              :class="{ 'discovering': processing }"
            >
              {{ processing ? 'Discovering' : `${total} ${$t('search-results')}` }}
            </span>
            <var>
              Use <code>"text"</code> for exact match
            </var>
          </div>
        </b-form-group>

        <h5
          v-if="processing || !total"
          class="d-flex align-items-center justify-content-center w-100 h-100"
        >
          <b-spinner
            v-if="processing"
            variant="primary"
            class="p-4"
          />
          <span
            v-else-if="!total"
          >
            No results
          </span>
        </h5>

        <b-row
          v-if="filteredHits && !processing"
          class="results w-100 m-0 mh-100 overflow-auto"
        >
          <b-col
            v-for="(hit, i) in filteredHits"
            :key="i"
            sm="12"
            md="6"
            :lg="map.show ? '6': '4'"
            class="py-3"
          >
            <result
              :id="hit.value.recordID || hit.value.moduleID"
              :index="i"
              :hit="hit"
              :show-map="map.show"
              :class="{ 'border-primary border shadow': map.clickedMarker && [hit.value.recordID, hit.value.moduleID].includes(map.clickedMarker) }"
              @hover="map.hoverIndex = $event"
            />
          </b-col>
        </b-row>

        <div
          class="position-fixed map-button"
        >
          <b-button
            variant="warning"
            class="rounded-circle p-3"
            @click="toggleMap"
          >
            <font-awesome-icon
              :icon="['fas', 'map-marked-alt']"
              class="h3 mb-0"
            />
          </b-button>
        </div>
      </b-col>

      <b-col
        v-if="map.show"
        md="12"
        lg="5"
        xl="4"
      >
        <discovery-map
          :markers="map.markers"
          :hover-index="map.hoverIndex"
          @hover="markerHovered"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import Result from './Results'
import { debounce } from 'lodash'
import DiscoveryMap from './DiscoveryMap.vue'

export default {
  i18nOptions: {
    namespaces: 'search',
  },

  components: {
    Result,
    DiscoveryMap,
  },

  data () {
    return {
      query: '',

      hits: [],
      filteredHits: [],
      total: 0,

      initial: false,
      processing: false,

      map: {
        show: false,
        markers: [],
        clickedMarker: undefined,
        hoverIndex: undefined,
      },
    }
  },

  watch: {
    query: {
      handler: debounce(function (text) {
        if (this.initial) return
        this.getSearchData(text)
      }, 700),
    },

    '$store.state.types': {
      handler: function () {
        this.getFilteredData()
      },
    },

    '$store.state.modules': {
      handler: debounce(function () {
        if (this.initial) return
        this.getSearchData(this.query)
      }, 400),
    },

    '$store.state.namespaces': {
      handler: debounce(function () {
        if (this.initial) return
        this.getSearchData(this.query)
      }, 400),
    },
  },

  created () {
    this.initial = true

    const { query = '', modules = [], namespaces = [] } = this.$route.query

    this.query = query
    this.$store.commit('updateModules', Array.isArray(modules) ? modules : [modules])
    this.$store.commit('updateNamespaces', Array.isArray(namespaces) ? namespaces : [namespaces])

    this.getSearchData(this.query)

    setTimeout(() => {
      this.initial = false
    }, 1000)
  },

  methods: {
    getSearchData (query = '') {
      this.processing = true

      this.deleteStates()

      const modules = this.$store.state.modules
      const namespaces = this.$store.state.namespaces

      this.updateRouteQuery({ query, modules, namespaces })

      this.$DiscoveryAPI.query({ query, modules, namespaces })
        .then((response = {}) => {
          if (response) {
            this.hits = response.hits
            if (response.hits) this.getFilteredData()

            const { value = 0 } = response.total || {}
            this.total = value

            this.$store.commit('updateAggregations', response.aggregations)

            this.getMarkers()
          }
        }).catch(this.toastErrorHandler(this.$t('notification:search.failed')))
        .finally(() => {
          this.processing = false
        })
    },

    getFilteredData () {
      if (this.$store.state.types.length > 0 && this.hits) {
        const results = this.hits.filter(hit => this.$store.state.types.includes(hit.type))
        this.filteredHits.splice(0, this.filteredHits.length, ...results)
      } else if (this.hits) {
        this.filteredHits.splice(0, this.filteredHits.length, ...this.hits)
      }
    },

    getMarkers () {
      const markers = []

      this.filteredHits.forEach(({ type, value }) => {
        if (type === 'compose:record' && Array.isArray(value.values)) {
          const id = value.recordID
          value.values.forEach(({ value = [] }) => {
            const isGeometry = value && value.find(v => {
              return v.toString().includes('{"coordinates":[')
            })

            if (isGeometry) {
              value.forEach(coordinates => {
                coordinates = JSON.parse(coordinates || '{}').coordinates
                if (coordinates) {
                  markers.push({ id, coordinates })
                }
              })
            }
          })
        }
      })

      this.map.markers = markers
    },

    markerHovered (ID) {
      if (ID) {
        document.getElementById(ID).scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }

      this.map.clickedMarker = ID
    },

    deleteStates () {
      this.hits = null
      this.map.markers = []
      this.filteredHits.splice(0, this.filteredHits.length)
    },

    toggleMap () {
      this.map.show = !this.map.show
    },

    updateRouteQuery ({ query = undefined, modules = [], namespaces = [] }) {
      if (JSON.stringify(this.$route.query) !== JSON.stringify({ query, modules, namespaces })) {
        this.$router.push({ query: { query: query || undefined, modules, namespaces } })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.results-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
}

.results-container.with-map {
  height: calc(60vh - 64px);
}

@media (min-width: 992px) {
  .results-container {
    height: calc(100vh - 64px) !important;
  }
}

.results {
  flex: 1 1 auto;
}

.map-button {
  bottom: 1rem;
  right: 1rem;
  z-index: 99999;
}

// https://stackoverflow.com/a/40991531/17926309
.discovering::after {
  display: inline-block;
  animation: discovering steps(1, end) 1s infinite;
  content: '';
}

@keyframes discovering {
  0% { content: ''; }
  25% { content: '.'; }
  50% { content: '..'; }
  75% { content: '...'; }
  100% { content: ''; }
}
</style>
