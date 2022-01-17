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
          class="d-flex align-items-center mb-3"
        >
          <h5
            class="text-primary text-capitalize text-truncate mr-2 mb-0"
          >
            User
          </h5>

          <h5
            class="d-flex align-items-center ml-auto mb-0"
          >
            <b-badge
              variant="secondary"
            >
              U
            </b-badge>
          </h5>
        </b-card-text>

        <!-- User fields -->
        <div
          v-for="(value, key, i) in limitData('system:user', hit.value)"
          :key="i"
          class="d-flex flex-column mb-3"
        >
          <label
            class="text-capitalize text-primary mb-0"
          >
            {{ key }}
          </label>
          <div class="mt-2">
            {{ value }}
          </div>
        </div>
      </b-overlay>

      <!-- Namespace -->
      <b-overlay
        v-if="hit.type === 'compose:namespace'"
      >
        <!-- Namespace title -->
        <b-card-text
          class="d-flex align-items-center mb-3"
        >
          <h5
            class="text-primary text-capitalize text-truncate mr-2 mb-0"
          >
            {{ hit.value.name || hit.value.slug }}
          </h5>

          <h5
            class="d-flex align-items-center ml-auto mb-0"
          >
            <b-badge
              variant="success"
            >
              N
            </b-badge>
          </h5>
        </b-card-text>

        <!-- Namespace fields -->
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
          <div class="mt-1">
            {{ item }}
          </div>
        </div>
      </b-overlay>

      <!-- Module -->
      <b-overlay
        v-if="hit.type === 'compose:module'"
      >
        <!-- Module title -->
        <b-card-text
          class="d-flex align-items-center mb-3"
        >
          <h5 class="text-primary text-capitalize text-truncate mr-2 mb-0">
            <span
              v-if="hit.value.namespace.name || hit.value.namespace.handle"
            >
              {{ hit.value.namespace.name || hit.value.namespace.handle }}
            </span>
            <span
              v-if="hit.value.namespace.name || hit.value.namespace.handle"
              class="mx-2"
            >
              <b-icon
                icon="arrow-right"
                font-scale="1"
              />
            </span>
            <span>
              {{ hit.value.name || hit.value.handle }}
            </span>
          </h5>

          <h5
            class="d-flex align-items-center ml-auto mb-0"
          >
            <b-badge
              v-if="Object.keys(hit.value.labels || { }).includes('federation')"
              variant="light"
            >
              Federated
            </b-badge>

            <b-badge
              variant="warning"
            >
              M
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
          <div class="mt-1">
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
          <h5 class="text-primary text-capitalize text-truncate mr-2 mb-0">
            <span
              v-if="hit.value.namespace.name || hit.value.namespace.handle"
            >
              {{ hit.value.namespace.name || hit.value.namespace.handle }}
            </span>
            <span
              v-if="hit.value.namespace.name || hit.value.namespace.handle"
              class="mx-2"
            >
              <b-icon
                icon="arrow-right"
                font-scale="1"
              />
            </span>
            <span>
              {{ hit.value.module.name || hit.value.module.handle }}
            </span>
            <span
              class="mx-2"
            >
              <b-icon
                icon="arrow-right"
                font-scale="1"
              />
            </span>
            <span
              class="text-primary text-capitalize mb-0"
            >
              Record
            </span>
          </h5>

          <h5
            class="d-flex align-items-center ml-auto mb-0"
          >
            <b-badge
              v-if="Object.keys(hit.value.labels || { }).includes('federation')"
              variant="light"
            >
              Federated
            </b-badge>

            <b-badge
              variant="info"
            >
              R
            </b-badge>
          </h5>
        </b-card-text>

        <!-- Record fields -->
        <div
          v-for="(item, i) in limitData('compose:record', hit.value)"
          :key="i"
          class="d-flex flex-column mb-3"
        >
          <label
            class="text-capitalize text-primary mb-0"
          >
            {{ item.label }}
          </label>
          <p class="multiline mt-1 mb-0">
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

  methods: {
    limitData (resourceType, hitValue, limit = 5) {
      if (resourceType === 'compose:record') {
        const { values = [] } = hitValue

        return values.map(({ name, label, value = [] }) => {
          if (value) {
            value = value.map(v => {
              return v.toString().includes('{"coordinates":[') ? ((JSON.parse(v || '{}') || {}).coordinates || []).join(', ') : v
            }).join('\n')
          }

          return { label, value }
        })
      } else {
        if (limit < 1) {
          return
        }
        const out = {}
        let counter = 0
        for (const key in hitValue) {
          let value = hitValue[key]

          // @todo fix all field mapping and send limited things on FE
          switch (resourceType) {
            case 'compose:namespace':
              if (
                counter < limit &&
                !!value &&
                ['created', 'updated', 'meta', 'security', 'url'].indexOf(key) < 0
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
