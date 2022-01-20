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

    <component
      :is="component"
      v-bind="$props"
    >
      <template #header>
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
      </template>
    </component>
  </b-card>
</template>

<script>
import base from './base'
import * as Results from './loader'

export default {
  extends: base,

  props: {
    hit: {
      type: Object,
      required: true,
    },
  },

  computed: {
    component () {
      let { type } = this.hit
      type = type.split(':')[1]

      const keys = Object.keys(Results)
      const i = keys.map(c => c.toLocaleLowerCase()).findIndex(c => c === type)

      return Results[keys[i]]
    },
  },
}
</script>

<style lang="scss" scoped>
.hover-effect {
  &:hover {
    transition: all 0.2s ease;
    box-shadow: 0 4px 8px rgba(38, 38, 38, 0.2) !important;
    top: -2px;
  }
}
</style>
