<script setup lang="ts">
import { type PropType } from 'vue';

defineProps({
  type: { type: String as PropType<'error' | 'success' | 'warning' | 'info'> | undefined },
  showIcon: { type: Boolean, default: true }
});
</script>

<template>
  <v-alert :type="showIcon ? type : undefined" :color="type" variant="outlined" density="compact">
    <slot></slot>
  </v-alert>
</template>
