<template>
  <GoogleMap
    ref="mapRef"
    :area-selection-mode-enabled="true"
    :is-marker-deletable="true"
    @onMapClick="onMapClick"
  />
  <div class="icon-container">
    <IconButton :icon="'done'" @click="onAccept" />
    <IconButton :icon="'close'" @click="onClear" />
  </div>
</template>

<script setup lang="ts">
/*global google*/
import { ref, defineEmits } from "vue";
import GoogleMap from "@/components/Common/GoogleMap.vue";
import IconButton from "@/components/IconButton.vue";
import axios from "axios";

const mapRef = ref();

const emit = defineEmits(["onAreaSelected"]);

function onMapClick(latLng: google.maps.LatLng) {
  mapRef.value.putMarker(latLng);
}

function onAccept() {
  const markers: google.maps.Marker[] = mapRef.value.getMarkers();
  const markerPositions = markers.map((m) => m.getPosition());
  console.log(markerPositions.join(", "));
  emit("onAreaSelected", markerPositions);
}

function onClear() {
  mapRef.value.removeMarkers();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function _loadPolygon(geoJsonFile: string) {
  // TODO: multi-polygons (multiple array)
  const resp = await axios.get(`${process.env.BASE_URL}geoJSON/${geoJsonFile}`);
  const json = JSON.parse(JSON.stringify(resp.data));
  const coords = json["coordinates"][0][0].map(
    (coord: number[]) => new google.maps.LatLng(coord[1], coord[0])
  );
  coords.forEach((latLng: google.maps.LatLng) =>
    mapRef.value?.putMarker(latLng)
  );
}
</script>

<style>
.icon-container {
  display: flex;
  flex-direction: column;
  z-index: 1;
  position: absolute;
  bottom: 100px;
  left: 20px;
}

.icon-container > * {
  margin: 8px 0;
}
</style>
