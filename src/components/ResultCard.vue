<template>
  <b-card
    no-body
    class="shadow-sm h-100"
  >
    <b-card-body class="d-flex flex-column">
      <h4>
        {{ title }}
      </h4>
      <b-card-text
        v-if="hit.type !== 'compose:record'"
        class="mb-2"
      >
        <span class="text-info font-weight-bold mr-3">{{ this.$t('card.type') }}:</span>{{ typeName }}
      </b-card-text>
      <b-card-text
        v-if="hit.type === 'system:user'"
        class="mb-2"
      >
        <span class="text-info font-weight-bold mr-3">{{ this.$t('card.email') }}:</span>{{ hit.value.email }}
      </b-card-text>
      <b-card-text
        v-if="hit.type !== 'compose:record'"
        class="mb-2"
      >
        <span class="text-info font-weight-bold mr-3">{{ this.$t('card.handle') }}:</span>{{ hit.value.handle }}
      </b-card-text>
      <b-card-text
        v-if="hit.type === 'compose:module' || hit.type === 'compose:record'"
        class="mb-2"
      >
        <span class="text-info font-weight-bold mr-3">{{ this.$t('card.namespace') }}:</span>{{ hit.value.namespace.name }}
      </b-card-text>
      <b-card-text
        v-if="hit.type === 'compose:record'"
        class="mb-2"
      >
        <span class="text-info font-weight-bold mr-3">{{ this.$t('card.module') }}:</span>{{ hit.value.module.name }}
      </b-card-text><b-card-text
        v-if="hit.type === 'compose:record'"
        class="mb-2"
      >
        <span class="text-info font-weight-bold mr-3">{{ this.$t('card.fields') }}:</span>{{ fields }}
      </b-card-text>
      <div class="mt-auto">
        <b-button
          href="#"
          variant="info"
        >
          {{ this.$t('card.button-text') }}
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
  },
}
</script>
