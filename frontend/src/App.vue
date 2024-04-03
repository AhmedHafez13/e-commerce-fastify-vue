<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import AppLayout from './layouts/AppLayout.vue';

onMounted(() => {
  const events = ['dragenter', 'dragover', 'dragleave', 'drop'];
  events.forEach((eventName) => {
    document.body.addEventListener(eventName, (e) => e.preventDefault());
  });
});
</script>

<template>
  <AppLayout>
    <RouterView />
  </AppLayout>
</template>

<style scoped></style>
