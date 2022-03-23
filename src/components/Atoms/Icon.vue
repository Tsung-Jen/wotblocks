<template>
    <i class="material-icons">{{ icon }}</i>
</template>

<script>
export default {
    name: 'icon', 
    props: {
        icon: { type: String, required: true }
    }
}
</script>

