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
    <div v-if="results && results.hits">
      <b-row
        align-h="start"
      >
        <b-col
          v-for="hit in results.hits"
          :key="hit.id"
          md="12"
          lg="6"
          xl="4"
          class="mb-4"
        >
          <result-card />
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
  data () {
    return {
      searchText: null,
      results: null,
    }
  },
  computed: {
    numberOfResults () {
      return this.results?.total?.value ? this.results.total.value : 0
    },
  },
  watch: {
    searchText: {
      handler: function (text) {
        if (text.length > 0) this.getSearchData(text)
      },
    },
  },
  methods: {
    getSearchData (text) {
      this.$DiscoveryAPI.getSearchData(text)
        .then((response) => {
          this.results = response.data
        })
        .catch(this.toastErrorHandler(this.$t('notification.search-error')))
    },
  },
}
</script>

<style>

</style>
