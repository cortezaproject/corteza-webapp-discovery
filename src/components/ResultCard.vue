<template>
  <b-card
    no-body
    class="shadow-sm h-100"
  >
    <b-card-body class="d-flex flex-column">
      <h4>
        {{ hit.value.name }}
      </h4>
      <b-card-text class="mb-2">
        <span class="text-info font-weight-bold mr-3">Type:</span>{{ typeName }}
      </b-card-text>
      <b-card-text
        v-if="hit.type === 'compose:namespace' || 'compose:module'"
        class="mb-2"
      >
        <span class="text-info font-weight-bold mr-3">Handle:</span>{{ hit.value.handle }}
      </b-card-text>
      <b-card-text
        v-if="hit.type === 'compose:module'"
        class="mb-2"
      >
        <span class="text-info font-weight-bold mr-3">Namespace:</span>{{ hit.value.namespace.name }}
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
  computed: {
    typeName () {
      if (this.hit.type === 'compose:namespace') return 'Namespace'
      return 'Module'
    },
  },
}
</script>
