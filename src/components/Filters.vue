<template>
  <div>
    <h4 class="mt-3 ml-2">
      {{ this.$t('title') }}
    </h4>
    <div class="ml-4 mt-4">
      <span class="text-info font-weight-bold">{{ this.$t('types.title') }}</span>
      <b-form-checkbox-group
        id="types"
        v-model="types"
        :options="options"
        name="types"
        stacked
        class="ml-4 mt-1"
      />
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
    }
  },
  computed: {
    options () {
      const options = [
        { text: this.$t('types.namespace'), value: 'compose:namespace' },
        { text: this.$t('types.module'), value: 'compose:module' },
      ]
      return options
    },
  },
  updated () {
    this.$emit('selectedTypes', this.types)
  },

}
</script>
