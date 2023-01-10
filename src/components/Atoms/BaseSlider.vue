<template>
  <div>
    <div class="slider-component">
      <div class="slidecontainer" style="position: relative">
        <input
          ref="input"
          v-bind="$attrs"
          :value="modelValue"
          type="range"
          :min="min"
          :max="max"
          class="slider"
          @input="$emit('update:modelValue', $event.target.value)"
          oninput="this.nextElementSibling.value = this.value"
        />
        <output
          style="
            position: absolute;
            right: -25px;
            top: 0;
            color: blue;
            min-width: 10px;
            font-size: 0.9em;
          "
          >1</output
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Number,
      default: 1,
    },
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      currentValue: this.value,
    };
  },
  methods: {},
};
</script>

<style scoped>
.slider-component .slidecontainer {
  width: 80%;
}

.slider-component .slidecontainer .slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: #c2c2c2;
  outline: none;
  opacity: 0.7;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;
}

.slider-component .slidecontainer .slider:hover {
  opacity: 1;
}

.slider-component .slidecontainer .slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: #2244aa;
  cursor: pointer;
  border-radius: 50%;
}

.slider-component .slidecontainer .slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: #2244aa;
  cursor: pointer;
  border-radius: 50%;
}
</style>
