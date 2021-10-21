<template>
  <div>
    <b-col sm="5">
      <div>Title</div>
      <b-form-input
        v-model="searchText"
        placeholder="Enter your name"
      />
      <div v-if="results">
        <div>
          {{ results.total.value }} search results
        </div>
        <div
          v-for="hit in results.hits"
          :key="hit.id"
        >
          {{ hit._source.account.accountName }}
        </div>
      </div>
    </b-col>
  </div>
</template>

<script>
import record from '../components/Record'
export default {
  i18nOptions: {
    namespaces: 'search',
  },
  data () {
    return {
      searchText: null,
      results: null,
    }
  },
  watch: {
    searchText: {
      handler: function (text) {
        if (text.length > 0) this.getSearchData(text)
      },
    },
  },
  methods: {
    async getSearchData (text) {
      try {
        this.results = record
        const searchData = await this.$SystemAPI.getSearchData(text)
      } catch (error) {
        this.toastErrorHandler(this.$t('notification.search-error'))(error)
      }
    },
  },
}
</script>

<style>

</style>
