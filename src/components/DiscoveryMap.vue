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
  </vl-map>
</template>

<script>
export default {
  data () {
    return {
      zoom: 2,
      center: [0, 0],
      rotation: 0,
    }
  },
}
</script>
