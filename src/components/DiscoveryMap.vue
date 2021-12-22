<template>
  <vl-map
    load-tiles-while-animating
    load-tiles-while-interacting
    style="height: 100vh;"
  >
    <vl-view
      :zoom.sync="zoom"
      :center.sync="center"
      :rotation.sync="rotation"
    />

    <vl-layer-tile id="osm">
      <vl-source-osm />
    </vl-layer-tile>

    <vl-feature
      v-for="marker in markers"
      :key="marker.id"
    >
      <vl-geom-point
        :coordinates="marker.coordinates"
      />
    </vl-feature>
  </vl-map>
</template>

<script>
export default {
  props: {
    markers: {
      type: Array,
      required: true,
    },
  },

  data () {
    return {
      zoom: 2,
      center: [30, 30],
      rotation: 0,
    }
  },
}
</script>
