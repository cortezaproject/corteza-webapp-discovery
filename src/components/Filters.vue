<template>
  <div>
    <div class="my-2">
      <span class="text-primary font-weight-bold">{{ this.$t('types.title') }}</span>
      <b-form-checkbox-group
        v-model="types"
        name="types"
        stacked
        class="mt-1"
        @change="updateTypes()"
      >
        <b-form-checkbox
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          <div
            class="d-flex align-items-center mb-0"
          >
            <span class="d-inline-block text-truncate mr-3">
              {{ option.text }}
            </span>
            <b-badge
              :variant="option.variant"
              class="ml-auto"
              style="height: 100%; width: 1.7em;"
            >
              {{ option.text.charAt(0).toUpperCase() }}
            </b-badge>
          </div>
        </b-form-checkbox>
      </b-form-checkbox-group>
    </div>

    <div v-if="this.$store.state.aggregations.length">
      <div
        v-for="(agg, index) in this.$store.state.aggregations"
        :key="index"
        class="mt-4"
      >
        <hr>

        <h6
          class="d-flex align-items-center mb-0"
        >
          {{ agg.name }}
          <b-button
            v-if="(groups[agg.name] || []).length"
            variant="dark"
            size="sm"
            pill
            class="ml-2"
            @click="clearGroup(agg.name)"
          >
            <h5 class="small mb-0">
              {{ (groups[agg.name] || []).length }}
            </h5>
          </b-button>
        </h6>

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
            <div
              class="d-flex align-items-center"
            >
              <span class="d-inline-block text-truncate">
                {{ getResourceDisplayName(agg.resource, resource) }}
              </span>
              <span
                class="pl-3 ml-auto"
              >
                {{ resource.hits }}
              </span>
            </div>
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
      return [
        { text: this.$t('types.namespace'), value: 'compose:namespace', variant: 'success' },
        { text: this.$t('types.module'), value: 'compose:module', variant: 'warning' },
        { text: this.$t('types.record'), value: 'compose:record', variant: 'info' },
        { text: this.$t('types.user'), value: 'system:user', variant: 'secondary' },
      ]
    },
  },

  watch: {
    '$store.state.namespaces': {
      immediate: true,
      handler: function (namespace) {
        this.groups.Namespace = namespace
      },
    },

    '$store.state.modules': {
      immediate: true,
      handler: function (module) {
        this.groups.Module = module
      },
    },
  },
  methods: {
    getResourceDisplayName (type, { name, handle, slug }) {
      if (type === 'compose:namespace') {
        return name || slug || 'Unnamed namespace'
      } else if (type === 'compose:module') {
        return handle || name || 'Unnamed module'
      }
    },

    updateTypes () {
      this.$store.commit('updateTypes', this.types)
    },

    updateGroup (name) {
      this.$store.commit(`update${name}s`, this.groups[name])
    },

    clearGroup (name) {
      this.groups[name] = []
      this.$store.commit(`update${name}s`, [])
    },
  },
}
</script>
