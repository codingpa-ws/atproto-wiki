<script setup lang="ts">
const pages = await useAPI("/api/pages");
</script>

<template>
  <h2 class="text-xl font-bold">All pages</h2>
  <pre>{{ pages }}</pre>
</template>
