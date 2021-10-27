<template>
  <b-card
    no-body
    class="shadow-sm h-100"
  >
    <b-card-body class="d-flex flex-column">
      <h4>
        {{ value.name }}
      </h4>
      <b-card-text class="mb-2">
        <span class="text-info font-weight-bold mr-3">Type:</span>{{ typeName }}
      </b-card-text>
      <b-card-text
        v-if="type === 'compose:namespace' || 'compose:module'"
        class="mb-2"
      >
        <span class="text-info font-weight-bold mr-3">Handle:</span>{{ value.handle }}
      </b-card-text>
      <b-card-text
        v-if="type === 'compose:module'"
        class="mb-2"
      >
        <span class="text-info font-weight-bold mr-3">Namespace:</span>{{ value.namespace.name }}
      </b-card-text>
      <div class="mt-auto">
        <b-button
          href="#"
          variant="info"
        >
          Show more
        </b-button>
      </div>
    </b-card-body>
  </b-card>
</template>

<script>
export default {
  props: {
    hit: {
      type: Object,
      default: null,
    },
  },
  data () {
    return {
      type: null,
      value: null,
    }
  },
  computed: {
    typeName () {
      if (this.type === 'compose:namespace') return 'Namespace'
      return 'Module'
    },
  },
  created () {
    if (this.hit.type) this.type = this.hit.type
    if (this.hit.value) this.value = this.hit.value
  },
}
</script>

<style>

</style>
