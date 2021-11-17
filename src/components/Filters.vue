<template>
  <div>
    <h4 class="mt-3 ml-2">
      {{ this.$t('title') }}
    </h4>
    <div class="ml-2 mt-4">
      <div
        v-b-toggle.collapse-types
        class="pb-2 text-primary d-flex justify-content-between"
      >
        <span class="font-weight-bold">
          {{ this.$t('types.title') }}
        </span>
        <span class="mr-2">
          <font-awesome-icon
            v-if="typesVisible"
            icon="chevron-up"
          />
          <font-awesome-icon
            v-else
            icon="chevron-down"
          />
        </span>
      </div>

      <b-collapse
        id="collapse-types"
        v-model="typesVisible"
      >
        <b-form-checkbox-group
          v-model="types"
          name="types"
          stacked
          class="ml-2 mt-1"
        >
          <b-form-checkbox
            v-for="(option, i) in options"
            :key="i"
            :value="option.value"
            class="mb-2"
          >
            {{ option.text }}
          </b-form-checkbox>
        </b-form-checkbox-group>
      </b-collapse>
    </div>
    <div v-if="aggregations">
      <div
        v-for="(agg, index) in this.$store.state.aggregations"
        :key="index"
        class="ml-2 pt-4"
      >
        <div
          v-b-toggle="'collapse-' + index"
          class="text-primary font-weight-bold d-flex justify-content-between"
        >
          <span class="pb-2">{{ selectName(agg.name) }} ({{ agg.hits }})</span>
          <span class="mr-2">
            <font-awesome-icon
              v-if="visible[agg.name]"
              icon="chevron-up"
            />
            <font-awesome-icon
              v-else
              icon="chevron-down"
            />
          </span>
        </div>
        <b-collapse
          :id="'collapse-' + index"
          v-model="visible[agg.name]"
        >
          <b-form-checkbox-group
            v-model="groups[agg.name]"
            stacked
            class="ml-2 mt-1"
          >
            <div
              v-for="(resource, i) in agg.resource_name"
              :key="i"
              class="d-flex justify-content-between mb-2"
            >
              <b-form-checkbox
                :value="resource.name"
              >
                <span
                  class="d-inline-block text-truncate"
                  style="max-width: 200px;"
                >{{ resource.name }}</span>
              </b-form-checkbox>
              <span class="text-secondary mr-2">{{ resource.hits }}</span>
            </div>
          </b-form-checkbox-group>
        </b-collapse>
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
      typesVisible: false,
      visible: {
        Module: false,
        Namespace: false,
      },
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
    aggregations () {
      const aggs = this.$store.state.aggregations
      return aggs.length > 0 && (aggs[0].hits > 0 || aggs[1].hits > 0)
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
        this.$store.commit('updateModules', this.groups.Module)
      },
    },
    'groups.Namespace': {
      handler: function () {
        this.$store.commit('updateNamespaces', this.groups.Namespace)
      },
    },
    '$store.state.namespaces': {
      handler: function (namespaces) {
        this.groups.Namespace = namespaces
      },
    },
    '$store.state.modules': {
      handler: function (modules) {
        this.groups.Module = modules
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
