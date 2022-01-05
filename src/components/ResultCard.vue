<template>
  <b-card
    no-body
    class="shadow-sm h-100"
    @mouseover="$emit('hover', hit.value.recordID)"
    @mouseleave="$emit('hover', undefined)"
  >
    <b-card-body class="d-flex flex-column">
      <!-- User -->
      <b-overlay
        v-if="hit.type === 'system:user'"
      >
        <!-- User title -->
        <b-card-text
          class="mb-2"
        >
          <b-row>
            <b-card-title
              class="col-auto text-capitalize text-primary"
              title="User"
              title-tag="h5"
            />
          </b-row>
        </b-card-text>

        <!-- User fields -->
        <b-card-text
          v-for="(item, i) in limitData('system:user', hit.value)"
          :key="i"
          :data="item"
          class="mb-2"
        >
          <b-row>
            <b-col
              class="text-primary font-weight-bold text-capitalize"
            >
              {{ i }}:
            </b-col>
            <b-col>
              {{ item }}
            </b-col>
          </b-row>
        </b-card-text>
      </b-overlay>

      <!-- Namespace -->
      <b-overlay
        v-if="hit.type === 'compose:namespace'"
      >
        <!-- Namespace title -->
        <b-card-text
          class="mb-2"
        >
          <b-row>
            <b-card-title
              v-if="hit.value.name"
              class="col-auto text-capitalize text-primary"
              :title="hit.value.name"
              title-tag="h5"
            />
          </b-row>
        </b-card-text>

        <!-- Namespace fields -->
        <b-card-text
          v-for="(item, i) in limitData('compose:namespace', hit.value)"
          :key="i"
          :data="item"
          class="mb-2"
        >
          <b-row>
            <b-col
              class="text-primary font-weight-bold text-capitalize"
            >
              {{ i }}:
            </b-col>
            <b-col>
              {{ item }}
            </b-col>
          </b-row>
        </b-card-text>
      </b-overlay>

      <!-- Module -->
      <b-overlay
        v-if="hit.type === 'compose:module'"
      >
        <!-- Module title -->
        <b-card-text
          class="d-flex align-items-center mb-3"
        >
          <h5
            v-if="hit.value.namespace.name"
            class="text-primary text-capitalize mb-0"
          >
            {{ hit.value.namespace.name }}
          </h5>
          <h5
            v-if="hit.value.namespace.name"
            class="text-primary mx-3 mb-0"
          >
            <b-icon
              icon="arrow-right"
              font-scale="1"
            />
          </h5>
          <h5
            class="text-primary text-capitalize mb-0"
          >
            {{ hit.value.name }}
          </h5>
          <h5
            class="ml-auto mb-0"
          >
            <b-badge
              v-if="Object.keys(hit.value.labels || { }).includes('federation')"
              variant="light"
            >
              Federated
            </b-badge>
          </h5>
        </b-card-text>

        <!-- Module fields -->
        <div
          v-for="(item, name, i) in limitData('compose:module', hit.value)"
          :key="i"
          class="d-flex flex-column mb-3"
        >
          <label
            class="text-capitalize text-primary mb-0"
          >
            {{ name }}
          </label>
          <div class="mt-2">
            {{ item }}
          </div>
        </div>
      </b-overlay>

      <!-- Record -->
      <b-overlay
        v-if="hit.type === 'compose:record'"
      >
        <!-- Record title -->
        <b-card-text
          class="d-flex align-items-center mb-3"
        >
          <h5
            v-if="hit.value.namespace.name"
            class="text-primary text-capitalize mb-0"
          >
            {{ hit.value.namespace.name }}
          </h5>
          <h5
            v-if="hit.value.namespace.name"
            class="text-primary mx-3 mb-0"
          >
            <b-icon
              icon="arrow-right"
              font-scale="1"
            />
          </h5>
          <h5
            class="text-primary text-capitalize mb-0"
          >
            {{ hit.value.module.name }}
          </h5>
          <h5
            class="text-primary mx-3 mb-0"
          >
            <b-icon
              icon="arrow-right"
              font-scale="1"
            />
          </h5>
          <h5
            class="text-primary text-capitalize mb-0"
          >
            Record
          </h5>
          <h5
            class="ml-auto mb-0"
          >
            <b-badge
              v-if="Object.keys(hit.value.labels || { }).includes('federation')"
              variant="light"
            >
              Federated
            </b-badge>
          </h5>
        </b-card-text>

        <!-- Record fields -->
        <div
          v-for="(item, i) in limitData('compose:record', hit.value.values)"
          :key="i"
          class="d-flex flex-column mb-3"
        >
          <label
            class="text-capitalize text-primary mb-0"
          >
            {{ item.name }}
          </label>
          <p class="multiline mt-2 mb-0">
            {{ item.value }}
          </p>
        </div>
      </b-overlay>

      <!-- Url to resource -->
      <div
        v-if="hit.value.url"
        class="d-flex"
      >
        <b-button
          size="sm"
          variant="primary"
          :href="hit.value.url"
          target="_blank"
        >
          {{ $t('card.button-text') }}
        </b-button>
      </div>
    </b-card-body>
  </b-card>
</template>

<script>
export default {
  i18nOptions: {
    namespaces: 'search',
  },
  props: {
    index: {
      type: Number,
      required: true,
    },
    hit: {
      type: Object,
      default: null,
    },
    showMap: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    typeName () {
      if (this.hit.type === 'compose:namespace') return this.$t('card.namespace')
      if (this.hit.type === 'system:user') return this.$t('card.user')
      if (this.hit.type === 'compose:record') return this.$t('card.record')
      return this.$t('card.module')
    },
    title () {
      return this.hit.value.name ? this.hit.value.name : this.$t('card.record')
    },
    fields () {
      let arr = []
      Object.keys(this.hit.value.values).forEach((prop) => arr.push(prop))
      if (arr.length > 10) {
        arr = arr.slice(0, 8).join(', ') + ',...'
      } else {
        arr = arr.join(', ')
      }
      return arr
    },
    data () {
      return {
        LimitationList: 5,
        showLess: false,
      }
    },
  },
  methods: {
    limitData (resourceType, list, limit = 5) {
      if (resourceType === 'compose:record') {
        return list.map(({ name, value = [] }) => {
          if (value) {
            value = value.map(v => {
              return v.toString().includes('{"coordinates":[') ? ((JSON.parse(v || '{}') || {}).coordinates || []).join(', ') : v
            }).join('\n')
          }

          return { name, value }
        })
      } else {
        if (limit < 1) {
          return
        }
        const out = {}
        let counter = 0
        for (const key in list) {
          let value = list[key]

          // @todo fix all field mapping and send limited things on FE
          switch (resourceType) {
            case 'compose:namespace':
              if (
                counter < limit &&
                !!value &&
                ['created', 'updated', 'meta', 'security', 'url'].indexOf(key) < 0
              ) {
                out[key] = value
                counter++
              }
              break
            case 'compose:module':
              if (
                counter < limit &&
                !!value &&
                ['created', 'updated', 'meta', 'security', 'fields', 'url', 'namespace', 'labels'].indexOf(key) < 0
              ) {
                if (['deleted'].includes(key)) {
                  if (value.at) {
                    value = new Date(value.at).toLocaleString()
                  } else {
                    break
                  }
                }

                out[key] = value
                counter++
              }
              break
            case 'compose:record':
              if (
                Array.isArray(value) &&
                value.length > 0 &&
                counter < limit &&
                !!value[0]
              ) {
                out[key] = value
                counter++
              }
              break
            case 'system:user':
              if (
                counter < limit &&
                !!value &&
                ['created', 'updated', 'security', 'labels'].indexOf(key) < 0
              ) {
                out[key] = value
                counter++
              }
              break
          }
        }

        return out
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.multiline {
  white-space: pre-line;
}
</style>
