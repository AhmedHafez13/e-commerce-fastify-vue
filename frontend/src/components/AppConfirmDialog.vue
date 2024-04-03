<script setup lang="ts">
const dialog = defineModel('isOpened', { type: Boolean, required: true });

defineProps({
  title: { type: String },
  message: { type: String, required: true },
  onConfirm: { type: Function }
});

const defaultTitle = 'Confirm';
</script>

<template>
  <div class="dialog text-center pa-4">
    <v-dialog v-model="dialog" width="auto">
      <v-card width="500" min-height="200px" :text="message" :title="title || defaultTitle">
        <template v-slot:title>
          <div class="d-flex align-center justify-lg-space-between">
            <v-icon color="error" icon="mdi-delete" size="small" />
            <div class="ms-3 text-error">{{ title || defaultTitle }}</div>
            <v-spacer />
            <v-btn @click="dialog = false" variant="text" icon="mdi-close" />
          </div>
        </template>
        <template v-slot:actions>
          <v-btn
            class="ms-auto mb-4"
            prepend-icon="mdi-close"
            text="Cancel"
            @click="dialog = false"
          />
          <v-btn
            v-if="onConfirm"
            prepend-icon="mdi-check"
            class="text-error ms-5 me-5 mb-4"
            text="Confirm"
            @click="
              onConfirm();
              dialog = false;
            "
          />
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>
