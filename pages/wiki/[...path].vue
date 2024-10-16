<script setup lang="ts">
const path = (useRoute().params.path as Array<string>)
  .map(encodeURIComponent)
  .join("/");
</script>

<template>
  <core-page :path="path" />
</template>
