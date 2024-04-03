<script setup lang="ts">
import ProductsList from './components/ProductsList.vue';
import CategoriesTree from './components/CategoriesTree.vue';
</script>

<template>
  <div class="d-flex flex-column flex-sm-row mb-16">
    <CategoriesTree class="v-col-md-4 me-sm-3 mb-3 pa-1" />
    <ProductsList class="v-col-md-8" />
  </div>
</template>

<style scoped lang="scss"></style>
