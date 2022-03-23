<template>
    <meter 
        min="0" max="100"
        low="33" high="66" optimum="80"
        v-bind="$attrs" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" >
        
    </meter>
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
meter {
  border-radius: 5px;
  width: 100%;

}
</style>
