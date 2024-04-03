<script setup lang="ts">
import { type PropType, type Ref, ref, computed, watch } from 'vue';
import type { Category } from '@/types/app.types';
import $v from '@/utils/app.validations';
import ProductsProvider from '@/providers/products.provider';
import AppConfirmDialog from '@/components/AppConfirmDialog.vue';

const props = defineProps({
  categories: { type: Array<Category>, required: true },
  category: { type: Object as PropType<Category>, default: undefined },
  onUpdate: { type: Function, required: true },
  onDelete: { type: Function }
});

const form = ref();
const currentCategory: Ref<Partial<Category>> = ref(props.category ? { ...props.category } : {});
const errorMessage = ref('');
const confirmData = ref({
  isOpened: false,
  title: 'Confirm Delete',
  message: '',
  onConfirm: () => {}
});

// The `incomingCategory` prop can be updated while the form is still opened
const incomingCategory = computed(() => props.category);
watch(incomingCategory, () => {
  form.value.reset();
  errorMessage.value = '';
  currentCategory.value = { ...props.category };
});

const allowedCategories = ref(
  props.category
    ? // Exclude current category. A child category can be a parent for itself
      props.categories.filter((category) => category.id !== props.category?.id)
    : props.categories
);

// ----- Events ----- //

const closeForm = (data: Category | null = null) => {
  props.onUpdate(data);
};

const submitForm = async () => {
  const { valid } = await form.value.validate();
  if (valid) {
    // Edit Mode / Add Mode
    const data = await (props.category ? editCategory() : addCategory());

    if (data) closeForm(data);
  }
};

const addCategory = async (): Promise<Category | null> => {
  if (!currentCategory.value.name) {
    return null;
  }
  try {
    const result = await ProductsProvider.CreateCategory({
      name: currentCategory.value.name,
      parentId: currentCategory.value.parentId
    });
    return result.data;
  } catch (error) {
    errorMessage.value = error as string;
  }
  return null;
};

const editCategory = async (): Promise<Category | null> => {
  if (!currentCategory.value.id || !currentCategory.value.name) {
    return null;
  }
  try {
    const result = await ProductsProvider.updateCategory(currentCategory.value.id, {
      name: currentCategory.value.name,
      parentId: currentCategory.value.parentId
    });
    return result.data;
  } catch (error) {
    errorMessage.value = error as string;
  }
  return null;
};

const confirmDelete = () => {
  confirmData.value.message = `Are you sure you want to delete "${currentCategory.value.name}"`;
  confirmData.value.onConfirm = () => {
    if (!incomingCategory.value) return;
    deleteCategory(incomingCategory.value);
  };
  confirmData.value.isOpened = true;
};

const deleteCategory = async (category: Category) => {
  // Check if the category can be deleted
  if (category.children && category.children.length) {
    errorMessage.value = 'Category has children. Delete children first';
    return;
  }

  try {
    await ProductsProvider.deleteCategory(category.id);
    // Fire callback
    props.onDelete && props.onDelete(category);
  } catch (error) {
    errorMessage.value = error as string;
  }
};

// ----- Validation Rules ----- //

const validationRules = computed(() => ({
  name: [
    (v: string) => $v.required(v) || 'Category name is required',
    (v: string) => $v.lengthBetween(v, 3, 200) || 'Category name must between 3 and 100 letters)'
  ]
}));

const stopPropagation = (event: Event) => event.stopPropagation();
</script>

<template>
  <v-sheet @click="stopPropagation" class="mx-2 my-4 pa-2" border rounded>
    <AppCompactAlert v-if="errorMessage" type="error" :show-icon="false">
      {{ errorMessage }}
    </AppCompactAlert>

    <v-sheet class="d-flex justify-space-between mt-1">
      <p class="mb-2 ms-1 font-weight-bold flex-1-1-100">
        {{ props.category ? 'Edit Category' : 'Add Category' }}
      </p>
      <v-btn
        v-if="incomingCategory"
        class="mx-1"
        color="error"
        icon="mdi-delete"
        size="small"
        variant="text"
        density="comfortable"
        @click="confirmDelete()"
      />
      <v-btn
        class="mx-1"
        color="success"
        icon="mdi-check"
        size="small"
        variant="text"
        density="comfortable"
        @click="submitForm"
      />
      <v-btn
        class="mx-1"
        icon="mdi-close"
        size="small"
        variant="text"
        density="comfortable"
        @click="closeForm()"
      />
    </v-sheet>
    <v-form ref="form" validate-on="submit">
      <v-text-field
        v-model="currentCategory.name"
        class="mb-2"
        label="Name *"
        density="compact"
        hide-details="auto"
        :rules="validationRules.name"
      />
      <v-autocomplete
        v-model="currentCategory.parentId"
        :items="allowedCategories"
        label="Parent Category"
        density="compact"
        filter-keys="title"
        item-title="name"
        item-value="id"
        hide-details="auto"
        clearable
      />
    </v-form>

    <!-- Delete Confirm Dialog -->
    <AppConfirmDialog
      class="position-absolute"
      v-model:isOpened="confirmData.isOpened"
      :on-confirm="confirmData.onConfirm"
      :title="confirmData.title"
      :message="confirmData.message"
    />
  </v-sheet>
</template>

<style scoped lang="scss"></style>
