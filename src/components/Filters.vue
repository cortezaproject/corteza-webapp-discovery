<template>
  <div>
    <h4 class="mt-3 ml-2">
      {{ this.$t('title') }}
    </h4>
    <div class="ml-4 mt-4">
      <span class="text-info font-weight-bold">{{ this.$t('types.title') }}</span>
      <b-form-checkbox-group
        v-model="types"
        :options="options"
        name="types"
        stacked
        class="ml-4 mt-1"
      />
    </div>
    <div v-if="aggregations.length > 0">
      <div
        v-for="(agg, index) in aggregations"
        :key="index"
        class="ml-4 mt-4"
      >
        <span class="text-info font-weight-bold">{{ agg.name }} ({{ agg.hits }})</span>
        <b-form-checkbox-group
          v-model="groups[agg.name]"
          :name="agg.name"
          stacked
          class="ml-4 mt-1"
        >
          <b-form-checkbox
            v-for="(resource, i) in agg.resource_name"
            :key="i"
            :value="resource.name"
          >
            {{ resource.name }} ({{ resource.hits }})
          </b-form-checkbox>
        </b-form-checkbox-group>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  i18nOptions: {
    namespaces: 'filters',
  },
  data () {
    return {
      types: [],
      aggregations: [],
      groups: {
        Module: [],
        Namespace: [],
      },
    }
  },
  computed: {
    options () {
      const options = [
        { text: this.$t('types.namespace'), value: 'compose:namespace' },
        { text: this.$t('types.module'), value: 'compose:module' },
        { text: this.$t('types.record'), value: 'compose:record' },
        { text: this.$t('types.user'), value: 'system:user' },
      ]
      return options
    },
  },
  watch: {
    '$store.state.aggregations': {
      handler: function () {
        this.aggregations = this.$store.state.aggregations
      },
    },
  },
  updated () {
    this.$store.commit('updateTypes', this.types)
    this.$store.state.modules = this.groups.Module
    this.$store.state.namespaces = this.groups.Namespace
  },

}
</script>
