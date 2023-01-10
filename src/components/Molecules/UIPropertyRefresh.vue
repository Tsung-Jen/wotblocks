<template>
  <div class="wotcard__uipropertyrefresh">
    <div class="tooltip" v-if="objectProperties.description">
      <span
        class="material-icons-outlined"
        style="max-width: 25px; color: #555; cursor: pointer; font-size: 0.8em"
        >info_outline</span
      >
      <span
        class="material-icons-outlined"
        v-if="objectProperties.forms"
        @click="consumeProperty(propertyName)"
        style="
          max-width: 25px;
          color: #555;
          cursor: pointer;
          font-size: 0.8em;
          padding-right: 5px;
        "
        >refresh</span
      >
      <span style="font-size: 0.7em; font-weight: 200; cursor: pointer">{{
        propertyName
      }}</span>
      <span class="tooltiptext">{{ objectProperties.description }}</span>
    </div>
    <div v-else style="font-size: 0.7em; font-weight: 200; text-align: center">
      {{ propertyName }}
    </div>
  </div>
</template>

<script>
export default {
  name: "UIPropertyRefresh",
  props: {
    objectProperties: { type: Object, required: true },
    propertyName: { type: String },
  },
  methods: {
    consumeProperty(property) {
      this.$emit("click", property);
    },
  },
};
</script>

<style>
.wotcard__uipropertyrefresh .tooltip {
  outline: none;
  position: relative;
  min-width: 15px;
  max-width: 100%;
}

.wotcard__uipropertyrefresh .tooltip .tooltiptext {
  opacity: 0;
  visibility: hidden;
  position: absolute;
}

.wotcard__uipropertyrefresh .tooltip:hover .tooltiptext {
  position: absolute;
  left: 1.3em;
  top: 2.6em;
  z-index: 99;
  visibility: visible;
  opacity: 0.8;
  font-weight: 700;
  font-size: 0.8em;
  padding: 8px;
  border-radius: 8px;
  background: #999;
  border: 1px solid #555;
  color: #000000;
}
</style>
