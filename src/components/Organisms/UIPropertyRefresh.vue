<template>
  <div class="q-pa-none">
      {{propertyName}}
        <!--<q-btn
          size="sm"
          v-if="objectProperties.description"
          flat
          round
          color="grey-9"
          icon="eva-info-outline"
        >
          <q-tooltip>
            {{ objectProperties.description }}
          </q-tooltip>
        </q-btn>

        <q-btn
          icon="mdi-refresh"
          v-if="objectProperties.forms"
          @click="consumeProperty(propertyName)"
          flat
          color="grey-9"
          :label="propertyName"
          size="sm"
        />
        <q-btn v-else flat color="grey-9" :label="propertyName" size="sm" />-->
    
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
