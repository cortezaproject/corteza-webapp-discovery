<template>
  <div>
    <h4 class="mt-3">
      {{ this.$t('title') }}
    </h4>
    <div class="mt-4">
      <span class="text-primary font-weight-bold">{{ this.$t('types.title') }}</span>
      <b-form-checkbox-group
        v-model="types"
        :options="options"
        name="types"
        stacked
        class="mt-1"
        @change="updateTypes()"
      />
    </div>
    <div v-if="this.$store.state.aggregations.length">
      <div
        v-for="(agg, index) in this.$store.state.aggregations"
        :key="index"
        class="mt-4"
      >
        <!--        <span class="">{{ selectName(agg.name) }} ({{ agg.hits }})</span>-->
        <b-row class="w-100">
          <b-col cols="auto text-primary font-weight-bold">
            {{ selectName(agg.name) }}
          </b-col>
          <b-col cols="0">
            <div
              v-if="agg.name === 'Module' && groups.Module.length"
              class="badge"
            >
              {{ groups.Module.length }}
            </div>
            <div
              v-if="agg.name !== 'Module' && groups.Namespace.length"
              class="badge"
            >
              {{ groups.Namespace.length }}
            </div>
          </b-col>
        </b-row>
        <b-form-checkbox-group
          v-model="groups[agg.name]"
          stacked
          class="mt-1"
          @change="updateGroup(agg.name)"
        >
          <b-form-checkbox
            v-for="(resource, i) in agg.resource_name"
            :key="i"
            :value="resource.name"
          >
            <b-row class="w-100">
              <b-col cols="10 text-break">
                {{ resource.name }}
              </b-col>
              <b-col cols="1">
                {{ resource.hits }}
              </b-col>
            </b-row>
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
    '$store.state.namespaces': {
      handler: function (namespace) {
        this.groups.Namespace = namespace
      },
    },
    '$store.state.modules': {
      handler: function (module) {
        this.groups.Module = module
      },
    },
  },
  methods: {
    selectName (name) {
      // return name === 'Module' ? this.$t('aggregation-groups.modules') : this.$t('aggregation-groups.namespaces')
      return name
    },

    updateTypes () {
      this.$store.commit('updateTypes', this.types)
    },

    updateGroup (group) {
      this.$store.commit(`update${group}s`, this.groups[group])
    },
  },
}
</script>

<style scoped>
/deep/ .custom-control-label {
  width: 100%;
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
}

.badge {
  width: 22px;
  height: 22px;
  line-height: 13px;
  font-weight: 900;
  border-radius: 50%;
  font-size: 12px;
  vertical-align: middle;
  text-align: center;

  /* todo maybe from global styling */
  color: white;
  background: black;
}

</style>
