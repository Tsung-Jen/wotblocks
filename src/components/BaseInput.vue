<template>
  <label>{{ label }}</label>
  <input/>
</template>

<script>
  export default {
    props: {
      label: {
        type: String,
        default: ''
      }
    }
  }

</script>

<style scoped>
a {
  color: #42b983;
}
</style>
