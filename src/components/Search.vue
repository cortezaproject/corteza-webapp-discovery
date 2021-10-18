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
import record from './Record'
export default {
  data () {
    return {
      searchText: null,
      results: null,
    }
  },
  watch: {
    searchText: {
      handler (text) {
        console.log('text', text)
        console.log('record', record)
        this.results = record
      },
    },
  },
}
</script>

<style>

</style>
