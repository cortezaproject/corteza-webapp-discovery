<template>
  <div>
    <h4 class="mt-3 ml-2">
      Filter
    </h4>
    <div class="ml-4 mt-4">
      <span class="text-info font-weight-bold">Types</span>
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
  data () {
    return {
      types: [],
      options: [
        { text: 'Namespace', value: 'compose:namespace' },
        { text: 'Module', value: 'compose:module' },
      ],
    }
  },
  updated () {
    this.$emit('selectedTypes', this.types)
  },

}
</script>
