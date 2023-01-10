<template>
  <div
    class="toolbar-right"
    style="width: 100%; flex-wrap: wrap; justify-content: flex-end"
    id="widget-toolbar"
  >
    <span
      class="material-icons-outlined"
      style="color: #2196f3; cursor: pointer"
      @click="refreshThing()"
      >refresh</span
    >

    <!-- space -->
    <div style="margin: 0 auto"></div>
    <span
      class="material-icons-outlined"
      style="color: #ffeb3b"
      v-if="availability === 'connecting'"
      >sensors</span
    >
    <span
      class="material-icons-outlined"
      style="color: #4caf50"
      v-if="availability === 'available'"
      >sensors</span
    >
    <span
      class="material-icons-outlined"
      style="color: #f44336"
      v-if="availability === 'unavailable'"
      >sensors_off</span
    >
    <span
      class="material-icons-outlined"
      style="padding-left: 5px"
      @click="showConfigurationModal"
      >settings</span
    >
  </div>
</template>

<script>
export default {
  name: "ThingToolbar",
  props: {
    availability: String,
    thingObj: {
      type: Object,
      required: true,
    },
  },
  computed: {},
  methods: {
    refreshThing() {
      this.$emit("refresh-thing");
    },
    showConfigurationModal() {
      this.$emit("showConfigurationModal");
    },
  },
};
</script>

<style>
#widget-toolbar {
  max-height: 50px;
}
.toolbar-right {
  display: flex;
}
</style>
