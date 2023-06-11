<template>
  <div>
    <div :class="$style['map']">
      <GoogleMap ref="mapRef" @on-map-click="onMapClick" />
    </div>
    <IconButton
      v-if="
        store.state.generalSettings.device <= DeviceTypes.MobilePortrait &&
        isMakeGuessButtonClicked
      "
      :icon="'close'"
      :style="{
        zIndex: '1',
        position: 'absolute',
        bottom: '300px',
        left: '0px',
      }"
      :size="'sm'"
      @click="onClickHideMapButton"
    />
  </div>
</template>

<script lang="ts">
/*global google*/
import { defineComponent, ref, watch, PropType } from "vue";
import { useStore } from "vuex";
import { key } from "@/store";
import { DeviceTypes } from "@/constants";
import IconButton from "@/components/IconButton.vue";
import GoogleMap from "@/components/Common/GoogleMap.vue";
import { LatLngPropType } from "@/types";

export default defineComponent({
  props: {
    selectedMode: {
      type: String,
      required: true,
    },
    randomLatLng: {
      type: Object as PropType<LatLngPropType>,
      default: null,
      required: false,
    },
    round: {
      type: Number,
      required: true,
    },
    isMakeGuessButtonClicked: {
      type: Boolean,
      required: true,
    },
  },

  components: {
    IconButton,
    GoogleMap,
  },

  setup(props, context) {
    const mapRef = ref();
    const gotRandomLatLng = ref(false);
    const store = useStore(key);

    watch(
      () => props.isMakeGuessButtonClicked,
      (newVal: boolean, oldVal: boolean) => {
        if (newVal && mapRef.value) {
          mapRef.value.style.transform = "translateY(-352px)";
        } else if (!newVal && mapRef.value) {
          mapRef.value.style.transform = "translateY(300px)";
        }
      }
    );

    watch(
      () => props.round,
      (newVal: number, oldVal: number) => {
        if (oldVal + 1 === newVal || (oldVal === 5 && newVal === 1)) {
          removeMarkers();
        }
      }
    );

    const removeMarkers = (): void => {
      mapRef.value?.removeMarkers();
    };

    const putMarker = (position: google.maps.LatLng): void => {
      mapRef.value?.putMarker(position);
    };

    const onClickHideMapButton = (): void => {
      context.emit("onClickHideMapButton");
    };

    const onMapClick = (latLng: google.maps.LatLng): void => {
      if (gotRandomLatLng.value) {
        removeMarkers();
        putMarker(latLng);
        context.emit("updateSelectedLatLng", latLng);
      }
    };

    watch(
      () => props.randomLatLng,
      (newVal: google.maps.LatLng | null) => {
        if (newVal !== null) {
          gotRandomLatLng.value = true;
        }
      }
    );

    return {
      mapRef,
      store,
      DeviceTypes,
      onClickHideMapButton,
      onMapClick,
    };
  },
});
</script>

<style module lang="scss">
.map {
  transform-origin: bottom left;
  transform: scale(0.75);
  transition: transform 1s;
  z-index: 1;
  opacity: 1;
  position: absolute;
  bottom: -280px;
  left: 12px;
  width: 320px;
  height: 240px;

  &:hover {
    transform: scale(1);
    opacity: 1;
  }

  @media #{$mobile-landscape} {
    bottom: 72px;
    opacity: 0.7;
    transition: transform 0.3s;
  }
}
</style>
