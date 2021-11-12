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
    <div v-if="this.$store.state.aggregations.length > 0">
      <div
        v-for="(agg, index) in this.$store.state.aggregations"
        :key="index"
        class="ml-4 mt-4"
      >
        <span class="text-info font-weight-bold">{{ selectName(agg.name) }} ({{ agg.hits }})</span>
        <b-form-checkbox-group
          v-model="groups[agg.name]"
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
    types: {
      handler: function () {
        this.$store.commit('updateTypes', this.types)
      },
    },
    'groups.Module': {
      handler: function () {
        this.$store.commit('updateModule', this.groups.Module)
      },
    },
    'groups.Namespace': {
      handler: function () {
        this.$store.commit('updateNamespace', this.groups.Namespace)
      },
    },
    '$store.state.namespace': {
      handler: function (namespace) {
        this.groups.Namespace = namespace
      },
    },
    '$store.state.module': {
      handler: function (module) {
        this.groups.Module = module
      },
    },
  },
  methods: {
    selectName (name) {
      return name === 'Module' ? this.$t('aggregationGroups.modules') : this.$t('aggregationGroups.namespaces')
    },
  },
}
</script>
