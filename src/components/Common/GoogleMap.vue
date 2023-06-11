<template>
  <div :class="$style['google-map']" ref="mapRef"></div>
</template>

<script lang="ts">
/*global google*/
import { defineComponent, onMounted, ref } from "vue";
import { DeviceTypes } from "@/constants";

export default defineComponent({
  props: {
    areaSelectionModeEnabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    isMarkerDeletable: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  emits: ["onMapClick"],

  setup(props, context) {
    let map: google.maps.Map;

    const mapRef = ref<HTMLElement>();
    const areaSelectionModeEnabled = ref(props.areaSelectionModeEnabled);

    const markers: google.maps.Marker[] = [];
    let selectedPolygon: google.maps.Polygon | null;

    onMounted(() => {
      if (mapRef.value) {
        map = new google.maps.Map(mapRef.value as HTMLElement, {
          center: { lat: 37.86926, lng: -122.254811 },
          zoom: 2,
          minZoom: 2,
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          restriction: {
            latLngBounds: { north: 85, south: -85, west: -180, east: 180 },
          },
        });
        map.addListener("click", (event: google.maps.MapMouseEvent) =>
          context.emit("onMapClick", event.latLng)
        );
      }
    });

    const getMarkers = (): google.maps.Marker[] => markers;

    const putMarker = (position: google.maps.LatLng): void => {
      const marker = _createMarker(position);
      markers.push(marker);

      _maybeUpdatePolygon();
    };

    const _createMarker = (
      position: google.maps.LatLng
    ): google.maps.Marker => {
      const marker = new google.maps.Marker({
        position: position,
        map: map,
        draggable: areaSelectionModeEnabled.value,
        optimized: false,
      });

      google.maps.event.addListener(marker, "drag", () => {
        _maybeUpdatePolygon();
      });

      if (props.isMarkerDeletable) {
        google.maps.event.addListener(marker, "rightclick", () => {
          marker.setMap(null);
          const markerPosition = markers.indexOf(marker);
          markers.splice(markerPosition, 1);
          _maybeUpdatePolygon();
        });
      }

      return marker;
    };

    const removeMarkers = (): void => {
      markers.forEach((marker) => {
        marker.setMap(null);
      });
      markers.splice(0);
      _maybeUpdatePolygon();
    };

    const enableAreaSelection = (): void => {
      areaSelectionModeEnabled.value = true;
    };

    const disableAreaSelection = (): void => {
      selectedPolygon?.setMap(null);
      selectedPolygon = null;
      removeMarkers();
      areaSelectionModeEnabled.value = false;
    };

    const _maybeUpdatePolygon = (): void => {
      if (!areaSelectionModeEnabled.value) {
        return;
      }

      const markerPositions = markers.map((marker) => marker.getPosition());

      if (selectedPolygon) {
        selectedPolygon.setPath(markerPositions as google.maps.LatLng[]);
      } else {
        selectedPolygon = new google.maps.Polygon({
          paths: markerPositions,
          strokeColor: "#FF0000",
          fillColor: "#FF0000",
          fillOpacity: 0.2,
          map: map,
          clickable: false,
        });
      }
    };

    return {
      mapRef,
      DeviceTypes,
      removeMarkers,
      putMarker,
      getMarkers,
      enableAreaSelection,
      disableAreaSelection,
    };
  },
});
</script>

<style module lang="scss">
.google-map {
  display: flex;
  width: 100%;
  height: 100%;
}
</style>
