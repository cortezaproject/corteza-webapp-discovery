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
    <div v-if="filteredHits">
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
export default {
  i18nOptions: {
    namespaces: 'search',
  },
  components: {
    ResultCard,
  },
  props: {
    types: {
      type: Array,
      default: null,
    },
  },
  data () {
    return {
      searchText: null,
      hits: null,
      filteredHits: [],
    }
  },
  computed: {
    numberOfResults () {
      return this.filteredHits.length
    },
  },
  watch: {
    searchText: {
      handler: function (text) {
        if (text.length > 0) this.getSearchData(text)
      },
    },
    types: {
      handler: function () {
        this.getFilteredData()
      },
    },
  },
  methods: {
    getSearchData (text) {
      this.$DiscoverySearcherAPI.getSearchData(text)
        .then((response) => {
          this.hits = response.data.hits
          this.getFilteredData()
        })
        .catch(this.toastErrorHandler(this.$t('notification.search-error')))
    },
    getFilteredData () {
      if (this.types?.length > 0 && this.hits) {
        const results = this.hits.filter(hit => this.types.includes(hit.type))
        this.filteredHits.splice(0, this.filteredHits.length, ...results)
      } else if (this.hits) {
        this.filteredHits.splice(0, this.filteredHits.length, ...this.hits)
      } else {
        this.filteredHits.splice(0, this.filteredHits.length)
      }
    },
  },
}
</script>
