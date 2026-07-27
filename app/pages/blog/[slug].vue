<script setup lang="ts">
const route = useRoute()
useHead({ title: `Post: ${route.params.slug}` })
</script>

<template>
  <h1>{{ route.params.slug }}</h1>
</template>
