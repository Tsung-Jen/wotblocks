<template>
  <input v-bind="$attrs" :value="modelValue" :placeholder="label" @input="$emit('update:modelValue', $event.target.value)"/>
</template>

<script>
  export default {
    props: {
      label: {
        type: String,
        default: ''
      },
      modelValue: {
        type: [String, Number],
        default: ''
      }
    }
  }

</script>

<style scoped>
input {
  border-radius: 5px;
  padding: 5px;
}
</style>
