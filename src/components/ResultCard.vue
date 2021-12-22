<template>
  <b-card
    no-body
    class="shadow-sm h-100"
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
              class="col-auto text-capitalize"
              title="User"
              title-tag="h5"
            />
          </b-row>
        </b-card-text>

        <!-- User fields -->
        <b-card-text
          v-for="(item, index) in limitData('system:user', hit.value)"
          :key="index"
          :data="item"
          class="mb-2"
        >
          <b-row>
            <b-col
              class="text-primary font-weight-bold text-capitalize"
            >
              {{ index }}:
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
              class="col-auto text-capitalize"
              :title="hit.value.name"
              title-tag="h5"
            />
          </b-row>
        </b-card-text>

        <!-- Namespace fields -->
        <b-card-text
          v-for="(item, index) in limitData('compose:namespace', hit.value)"
          :key="index"
          :data="item"
          class="mb-2"
        >
          <b-row>
            <b-col
              class="text-primary font-weight-bold text-capitalize"
            >
              {{ index }}:
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
          class="mb-2"
        >
          <b-row>
            <b-card-title
              v-if="hit.value.namespace.name"
              class="col-auto text-capitalize"
              :title="hit.value.namespace.name"
              title-tag="h5"
            />
            <b-card-title
              v-if="hit.value.namespace.name"
              class="col-0"
              title-tag="h5"
            >
              <b-icon
                icon="arrow-right"
                font-scale="1"
              />
            </b-card-title>
            <b-card-title
              class="col-auto text-capitalize"
              :title="hit.value.name"
              title-tag="h5"
            />
          </b-row>
        </b-card-text>

        <!-- Module fields -->
        <b-card-text
          v-for="(item, index) in limitData('compose:module', hit.value)"
          :key="index"
          :data="item"
          class="mb-2"
        >
          <b-row>
            <b-col
              class="text-primary font-weight-bold text-capitalize"
            >
              {{ index }}:
            </b-col>
            <b-col>
              {{ item }}
            </b-col>
          </b-row>
        </b-card-text>
      </b-overlay>

      <!-- Record -->
      <b-overlay
        v-if="hit.type === 'compose:record'"
      >
        <!-- Record title -->
        <b-card-text
          class="mb-2"
        >
          <b-row>
            <b-card-title
              v-if="hit.value.namespace.name"
              class="col-auto text-capitalize"
              :title="hit.value.namespace.name"
              title-tag="h5"
            />
            <b-card-title
              v-if="hit.value.namespace.name"
              class="col-0"
              title-tag="h5"
            >
              <b-icon
                icon="arrow-right"
                font-scale="1"
              />
            </b-card-title>
            <b-card-title
              class="col-auto text-capitalize"
              :title="hit.value.module.name"
              title-tag="h5"
            />
          </b-row>
        </b-card-text>

        <!-- Record fields -->
        <b-card-text
          v-for="(item, index) in limitData('compose:record', hit.value.values)"
          :key="index"
          :data="item"
          class="mb-2"
        >
          <b-row>
            <b-col
              class="text-primary font-weight-bold text-capitalize"
            >
              {{ item.name }}:
            </b-col>
            <b-col>
              {{ item.value }}
            </b-col>
          </b-row>
        </b-card-text>
      </b-overlay>

      <!-- Url to resource -->
      <b-row
        v-if="hit.value.url"
      >
        <b-col
          md="4"
          sm="5"
        >
          <b-button
            size="sm"
            variant="primary"
            :href="hit.value.url"
            target="_blank"
          >
            {{ this.$t('card.button-text') }}
          </b-button>
        </b-col>
      </b-row>
    </b-card-body>
  </b-card>
</template>

<script>
export default {
  i18nOptions: {
    namespaces: 'search',
  },
  props: {
    hit: {
      type: Object,
      default: null,
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
        return list
      } else {
        if (limit < 1) {
          return
        }
        const out = {}
        let counter = 0
        for (const key in list) {
          const value = list[key]

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
              console.log(list)

              if (
                counter < limit &&
                !!value &&
                ['created', 'updated', 'meta', 'security', 'fields', 'url', 'namespace'].indexOf(key) < 0
              ) {
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
                // @todo for multiple value, will be fixed with dynamic field from response
                out[key] = value[0]
                counter++
              }
              break
            case 'system:user':
              if (
                counter < limit &&
                !!value &&
                ['created', 'updated', 'security'].indexOf(key) < 0
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
