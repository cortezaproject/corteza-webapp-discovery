<template>
  <b-card
    no-body
    class="shadow-sm h-100"
    :class="{ 'hover-effect': hit.value.url }"
    @mouseover="$emit('hover', hit.value.recordID)"
    @mouseleave="$emit('hover', undefined)"
  >
    <a
      v-if="hit.value.url"
      :href="hit.value.url"
      target="_blank"
      class="stretched-link"
    />
    <!--    User-->
    <b-overlay
      v-if="hit.type === 'system:user'"
    >
      <!-- User title -->
      <b-card-header
        header-bg-variant="white"
        class="border-bottom"
      >
        <div class="d-flex align-items-center mb-3 justify-content-between">
          <h5
            class="text-primary text-capitalize text-truncate mr-2 mb-0"
          >
            User
          </h5>

          <b-avatar
            size="sm"
            :title="hit.type"
            class="align-center bg-light text-dark"
          />
        </div>
        <div class="d-flex justify-content-between small">
          <span class="text-truncate text-nowrap mr-1">
            <b-icon-person />
            John Doe
          </span>
          <span class="text-nowrap mr-1">
            <b-icon-calendar />
            10 Jan 2020
          </span>
          <span class="text-nowrap">
            <b-icon-pencil-square />
            10 Jan 2020
          </span>
        </div>
      </b-card-header>

      <!-- User fields -->
      <b-card-body class="pb-0">
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
      </b-card-body>
    </b-overlay>

    <!-- Namespace -->
    <b-overlay
      v-if="hit.type === 'compose:namespace'"
    >
      <!-- Namespace title -->
      <b-card-header
        header-bg-variant="white"
        class="border-bottom"
      >
        <div class="d-flex align-items-center mb-3 justify-content-between">
          <h5
            class="text-primary text-capitalize text-truncate mr-2 mb-0"
          >
            {{ hit.value.name || hit.value.slug }}
          </h5>
          <b-avatar
            size="sm"
            :title="hit.type"
            icon="code-square"
            class="align-center bg-light text-dark"
          />
        </div>
        <div class="d-flex justify-content-between small">
          <span class="text-truncate text-nowrap mr-1">
            <b-icon-person />
            John Doe
          </span>
          <span class="text-nowrap mr-1">
            <b-icon-calendar />
            10 Jan 2020
          </span>
          <span class="text-nowrap">
            <b-icon-pencil-square />
            10 Jan 2020
          </span>
        </div>
      </b-card-header>

      <!-- Namespace fields -->
      <b-card-body class="pb-0">
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
      </b-card-body>
    </b-overlay>

    <!-- Module -->
    <b-overlay
      v-if="hit.type === 'compose:module'"
    >
      <!-- Module title -->
      <b-card-header
        header-bg-variant="white"
        class="border-bottom"
      >
        <div class="d-flex align-items-center mb-3 justify-content-between">
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
          <span class="text-nowrap">
            <b-badge
              v-if="Object.keys(hit.value.labels || { }).includes('federation')"
              variant="light"
              class="mr-1 h5 p-2 mb-0"
            >
              Federated
            </b-badge>
            <b-avatar
              size="sm"
              :title="hit.type"
              icon="file-earmark-text"
              class="align-center bg-light text-dark"
            />
          </span>
        </div>
        <div class="d-flex justify-content-between small">
          <span class="text-truncate text-nowrap mr-1">
            <b-icon-person />
            John Doe
          </span>
          <span class="text-nowrap mr-1">
            <b-icon-calendar />
            10 Jan 2020
          </span>
          <span class="text-nowrap">
            <b-icon-pencil-square />
            10 Jan 2020
          </span>
        </div>
      </b-card-header>

      <!-- Module fields -->
      <b-card-body class="pb-0">
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
      </b-card-body>
    </b-overlay>

    <!-- Record -->
    <b-overlay
      v-if="hit.type === 'compose:record'"
      class="h-100"
    >
      <!-- Record title -->
      <b-card-header
        header-bg-variant="white"
        class="border-bottom"
      >
        <div class="d-flex align-items-center mb-3 justify-content-between">
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
          </h5>
          <span class="text-nowrap">
            <b-badge
              v-if="Object.keys(hit.value.labels || { }).includes('federation')"
              variant="light"
              class="mr-1 h5 p-2 mb-0"
            >
              Federated
            </b-badge>
            <b-avatar
              size="sm"
              :title="hit.type"
              icon="list-ul"
              class="align-center bg-light text-dark"
            />
          </span>
        </div>
        <div class="d-flex justify-content-between small">
          <span class="text-truncate text-nowrap mr-1">
            <b-icon-person />
            John Doe
          </span>
          <span class="text-nowrap mr-1">
            <b-icon-calendar />
            10 Jan 2020
          </span>
          <span class="text-nowrap">
            <b-icon-pencil-square />
            10 Jan 2020
          </span>
        </div>
      </b-card-header>

      <!-- Record fields -->
      <b-card-body class="pb-0">
        <div
          v-for="(item, i) in limitData('compose:record', hit.value)"
          :key="i"
          class="d-flex flex-column mb-3"
        >
          <label
            class="text-capitalize text-primary mb-0"
          >
            {{ item.label || item.name }}
          </label>
          <p class="multiline mt-1 mb-0">
            {{ item.value }}
          </p>
        </div>
      </b-card-body>
    </b-overlay>
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

          return { name, label, value }
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

.hover-effect {
  &:hover {
    transition: all 0.2s ease;
    box-shadow: 0 4px 8px rgba(38, 38, 38, 0.2) !important;
    top: -2px;
  }
}
</style>
