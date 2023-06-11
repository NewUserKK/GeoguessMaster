<template>
  <div class="page">
    <MapAreaSelector />
  </div>
</template>

<script setup lang="ts">
import MapAreaSelector from "@/components/CreateMap/MapAreaSelector.vue";
</script>

<style scoped lang="scss">
.page {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  top: 0;
  left: 0;
}
</style>
