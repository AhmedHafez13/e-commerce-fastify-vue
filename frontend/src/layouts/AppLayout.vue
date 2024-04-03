<script setup lang="ts">
import AppBar from '@/components/AppBar.vue';
</script>

<template>
  <v-app>
    <AppBar />
    <main class="content">
      <slot></slot>
    </main>
  </v-app>
</template>

<style scoped lang="scss">
.content {
  width: 100%;
  margin: 0 auto;
  padding: 0.5rem;
}

@media (min-width: 1280px) {
  .content {
    max-width: 1100px;
  }
}
</style>
