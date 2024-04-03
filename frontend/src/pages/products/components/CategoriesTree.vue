<script setup lang="ts">
import { ref, type Ref, type PropType, onMounted } from 'vue';
import type { Product, Category } from '@/types/app.types';
import ProductsProvider from '@/providers/products.provider';
import CategoriesForm from './CategoriesForm.vue';

const isLoading: Ref<boolean> = ref(true);
const errorMessage: Ref<string | null> = ref(null);
const tree: Ref<any> = ref([]);
const categories: Ref<Category[]> = ref([]);
const items: Ref<Category[]> = ref([]);
const search: Ref<string | undefined> = ref(undefined);
const showEditForm: Ref<boolean> = ref(false);
const showAddForm: Ref<boolean> = ref(false);
const categoryToEdit: Ref<Category | undefined> = ref(undefined);
const snackbarMessage = ref('');
const snackbar = ref(false);

defineProps({
  products: { type: Array as PropType<Product[]> }
});

// ----- Initialize Data ----- //

onMounted(async () => {
  fetchData();
});

const fetchData = async () => {
  try {
    categories.value = (await ProductsProvider.getAllCategories()).data;
    items.value = createTree(categories.value);
    categories.value = categories.value.map((item) => ({ ...item, title: item.name }));
  } catch (error) {
    errorMessage.value = error as string;
  } finally {
    isLoading.value = false;
  }
};

// ----- Component Logic ----- //

const createTree = (dataset: Category[]): Category[] => {
  if (!dataset || !dataset.length) return [];
  const hashTable = Object.create(null);
  dataset.forEach((aData) => (hashTable[aData.id] = { ...aData }));
  const dataTree: Category[] = [];
  dataset.forEach((aData) => {
    if (aData.parentId) {
      hashTable[aData.parentId].children = hashTable[aData.parentId].children || [];
      hashTable[aData.parentId].children.push(hashTable[aData.id]);
    } else {
      dataTree.push(hashTable[aData.id]);
    }
  });
  return dataTree;
};

// ----- Events ----- //

const addCategory = () => {
  showEditForm.value = false;
  showAddForm.value = true;
  categoryToEdit.value = undefined;
};

const editCategory = (event: PointerEvent, category: Category) => {
  event.stopPropagation();
  categoryToEdit.value = {
    ...category
  };
  showEditForm.value = true;
  showAddForm.value = false;
  window.scroll({ behavior: 'smooth', top: 0 });
};

// ----- Callbacks ----- //

const onCategoryAdded = (data: Category) => {
  // Reset the form
  categoryToEdit.value = undefined;
  showAddForm.value = false;

  // Update data
  if (data) {
    // Add the new created category to categories
    categories.value.push(data);
    categories.value = categories.value.sort((c1, c2) => c1.name.localeCompare(c2.name));

    // Update items (tree)
    items.value = createTree(categories.value);
  }
};

const onCategoryUpdated = (data: Category) => {
  // Reset the form
  categoryToEdit.value = undefined;
  showEditForm.value = false;

  // Update data
  if (data) {
    // Find and update the target category
    let categoryIndex = categories.value.findIndex((category) => category.id === data.id);
    if (categoryIndex >= 0) {
      const category = categories.value[categoryIndex];
      categories.value[categoryIndex] = {
        ...category,
        ...data,
        title: category.name // For tree filtering
      };
    }

    // Update items (tree)
    items.value = createTree(categories.value);
  }
};

const onCategoryDeleted = (data: Category) => {
  // Reset the form
  categoryToEdit.value = undefined;
  showEditForm.value = false;

  // Update data
  if (data) {
    // Find and delete the target category
    let categoryIndex = categories.value.findIndex((category) => category.id === data.id);
    if (categoryIndex >= 0) {
      categories.value.splice(categoryIndex, 1);
    }

    // Update items (tree)
    items.value = createTree(categories.value);
  }

  // Show confirmation message
  snackbarMessage.value = `'${data.name}' had been deleted.`;
  snackbar.value = true;
};
</script>

<template>
  <v-sheet class="h-100" border rounded>
    <!-- Categories Sidebar Header -->
    <v-sheet class="d-flex flex-wrap justify-space-between align-center pa-3">
      <p class="me-2 text-h6 font-weight-bold">Categories</p>
      <v-btn
        v-if="!isLoading && !showAddForm"
        color="green"
        append-icon="mdi-plus"
        @click="addCategory()"
      >
        Add
      </v-btn>
    </v-sheet>

    <!-- Categories Form -->
    <CategoriesForm v-if="showAddForm" :categories="categories" :on-update="onCategoryAdded" />

    <CategoriesForm
      v-if="showEditForm"
      :categories="categories"
      :category="categoryToEdit"
      :on-update="onCategoryUpdated"
      :on-delete="onCategoryDeleted"
    />

    <!-- Alerts Message Based on Status -->
    <v-sheet v-if="!isLoading" class="d-flex flex-wrap justify-space-between pa-3">
      <AppCompactAlert v-if="errorMessage" type="error">{{ errorMessage }}</AppCompactAlert>
      <AppCompactAlert v-else-if="!categories?.length" type="warning">
        No categories found
      </AppCompactAlert>
      <div v-else class="text-h6">Categories {{ categories?.length }}</div>
    </v-sheet>

    <!-- Loading Bar -->
    <AppProgressLinear v-if="isLoading"></AppProgressLinear>

    <!-- Categories Tree & Filter Input -->
    <template v-if="categories?.length">
      <v-text-field
        v-model="search"
        class="ma-2"
        placeholder="Filter"
        density="compact"
        hide-details="auto"
      />
      <v-treeview
        v-model:selected="tree"
        :items="items"
        indeterminate-icon="mdi-bookmark-minus"
        item-title="name"
        item-value="id"
        off-icon="mdi-bookmark-outline"
        on-icon="mdi-bookmark"
        selected-color="indigo"
        selectable
        select-strategy="leaf"
        open-strategy="single"
        :open-on-click="false"
        :search="search"
        :open-all="Boolean(search)"
        return-object
        :stop="false"
      >
        <template v-slot:title="{ item }">
          <v-hover v-slot="{ isHovering, props }">
            <div v-bind="props">
              {{ item.name }}
              <v-btn
                v-if="categoryToEdit?.id !== item.id"
                :class="{ 'd-inline': isHovering }"
                class="pa-1 position-absolute d-none"
                icon="mdi-pencil"
                size="small"
                variant="text"
                density="compact"
                @click="(event: PointerEvent) => editCategory(event, item)"
              />
            </div>
          </v-hover>
        </template>
      </v-treeview>
    </template>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :timeout="3000">
      {{ snackbarMessage }}
      <template v-slot:actions>
        <v-btn color="blue" variant="text" @click="snackbar = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-sheet>
</template>

<style scoped lang="scss">
:deep(.v-list-item-title) {
  white-space: normal;
}

:deep(.v-list-item .v-ripple__container) {
  display: none !important;
}
</style>
