<template>
  <label
    v-if="label"
    style="padding-right: 8px; font-size: 0.9em; color: #555"
    >{{ label }}</label
  >
  <select
    class="field"
    :value="modelValue"
    v-bind="{
      ...$attrs,
      onChange: ($event) => {
        $emit('update:modelValue', $event.target.value);
      },
    }"
  >
    <option
      v-for="option in options"
      :value="option"
      :key="option"
      :selected="option === modelValue"
    >
      {{ option }}
    </option>
  </select>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: "",
    },
    modelValue: {
      type: [String, Number],
      default: "",
    },
    options: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
optgroup,
select {
  display: inline-flex;
  font-family: "Open sans", sans-serif;
  line-height: 1.15;
  border-radius: 5px;
  padding: 5px 24px 5px 10px;
}

select:focus {
  border-color: #39b982;
  outline: 0;
}
select:focus::ms-value {
  color: #000;
  background: #fff;
}
</style>
