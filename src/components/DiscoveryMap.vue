<template>
  <l-map
    :zoom="zoom"
    :center="center"
    style="height: calc(100vh - 64px);"
  >
    <l-tile-layer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      :attribution="attribution"
    />
    <l-marker
      v-for="marker in markers"
      :key="marker.id"
      :lat-lng="getLatLng(marker.coordinates)"
      :opacity="hoverIndex === marker.id ? 1.0 : 0.6"
      @click="clicked"
    />
  </l-map>
</template>

<script>
import { latLng } from 'leaflet'

export default {
  props: {
    markers: {
      type: Array,
      required: true,
    },
    hoverIndex: {
      type: String,
      default: undefined,
    },
  },

  data () {
    return {
      zoom: 3,
      center: [30, 30],
      rotation: 0,
      attribution: '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a>',
    }
  },

  methods: {
    getLatLng (coordinates = [0, 0]) {
      return latLng(coordinates[0], coordinates[1])
    },

    clicked (e) {
      console.log(e)
    },
  },
}
</script>

<style lang="scss">
.vl-style-text {
  color: white;
}
</style>
