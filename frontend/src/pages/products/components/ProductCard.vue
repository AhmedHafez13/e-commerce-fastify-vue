<script setup lang="ts">
import { type PropType } from 'vue';
import type { Product } from '@/types/app.types';
import { getImageSrc } from '@/utils/app.utils';

defineProps({
  product: { type: Object as PropType<Product> },
  onDelete: { type: Function, required: true }
});
</script>

<template>
  <v-card class="mx-2" min-height="100%">
    <v-responsive :aspect-ratio="1 / 1">
      <v-img
        :src="getImageSrc(product?.picture)"
        class="align-end"
        gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
        height="100%"
      />
    </v-responsive>
    <v-card-text>{{ product?.name }}</v-card-text>
    <v-scroll-x-transition group hide-on-leave>
      <v-chip
        :text="product?.category?.name"
        :key="product?.categoryId"
        class="mx-3"
        size="small"
      />
    </v-scroll-x-transition>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        @click="$router.push({ name: 'edit-product', params: { id: product?.id } })"
        color="blue"
        icon="mdi-pencil"
        size="small"
        variant="text"
      />
      <v-btn
        @click="onDelete(product?.id, product?.name)"
        color="red"
        icon="mdi-delete"
        size="small"
        variant="text"
      />
    </v-card-actions>
  </v-card>
</template>
