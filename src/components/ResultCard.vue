<template>
  <div>
    <b-card
      :title="hit.value.name"
      class="shadow-sm"
    >
      <b-card-text class="mb-2">
        <span class="text-info font-weight-bold mr-3">Account Name:</span>Accounts Germany
      </b-card-text>
      <b-card-text class="mb-2">
        <span class="text-info font-weight-bold mr-3">Type:</span>{{ hit.type }}
      </b-card-text>
      <b-card-text class="mb-2">
        <span class="text-info font-weight-bold mr-3">Industry:</span>Consulting
      </b-card-text>
      <b-card-text class="mb-2">
        <span class="text-info font-weight-bold mr-3">Account Source:</span>Customer Referral
      </b-card-text>

      <b-button
        href="#"
        variant="info"
        class="mt-2"
      >
        Show more
      </b-button>
    </b-card>
  </div>
</template>

<script>
export default {
  props: {
    hit: {
      type: Object,
      default: null,
    },
  },
}
</script>

<style>

</style>
