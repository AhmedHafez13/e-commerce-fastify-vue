<script setup lang="ts">
import { ref, type Ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import type { Category, Product } from '@/types/app.types';
import ProductsProvider from '@/providers/products.provider';
import { getMimeType } from '@/utils/app.utils';
import $v from '@/utils/app.validations';
import { getImageSrc } from '@/utils/app.utils';

const isLoading: Ref<boolean> = ref(true);
const pageErrorMessage: Ref<string | null> = ref(null);
const formErrorMessage: Ref<string | null> = ref(null);
const categories: Ref<Category[]> = ref([]);
const selectCategories: Ref<number[]> = ref([]);
const selectedCategoryName: Ref<string | null> = ref(null);
const currentProduct: Ref<Partial<Product>> = ref({});
const levels: Ref<{ items: Category[]; title: string }[]> = ref([]);
const image: Ref<{ src?: string; file?: File }> = ref({ src: undefined, file: undefined });
const validation = ref({ image: '' });
const isFormActive = ref(false);
const form = ref();
const file = ref();
const autocomplete = ref();

// ----- Initialize services ----- //

const route = useRoute();
const router = useRouter();

// ----- Initialize Data ----- //

onMounted(async () => {
  if (route.name === 'edit-product') {
    // Edit mood
    // Try to get the id from the url params
    const productId = parseInt(route.params.id as string);
    if (isNaN(productId)) {
      pageErrorMessage.value = 'Error: Invalid product is';
      isLoading.value = false;
    } else {
      await fetchCategories();
      // The product depends on categories
      await fetchProductData(productId);
      isLoading.value = false;
    }
  } else {
    // Add mood
    await fetchCategories();
    isLoading.value = false;
  }
});

const fetchCategories = async () => {
  try {
    const data = (await ProductsProvider.getAllCategories()).data;
    categories.value = data.map((category: Category) => ({ ...category, title: category.name }));

    const rootLevel = categories.value.filter((category) => !category.parentId);
    levels.value.push({ items: rootLevel, title: 'Categories' });
  } catch (error) {
    pageErrorMessage.value = error as string;
  }
};

const fetchProductData = async (id: number) => {
  try {
    const data = (await ProductsProvider.getProduct(id)).data;
    currentProduct.value = data;

    if (currentProduct.value.picture) {
      image.value.src = getImageSrc(currentProduct.value.picture);
    }

    if (currentProduct.value.categoryId) {
      // Path starting from the products category to the highest parent
      const path = [];

      // Find the category
      let current = categories.value.find((c) => c.id === currentProduct.value.categoryId);

      // Draw the path
      while (current) {
        path.push(current.id);
        current = categories.value.find((c) => c.id === current!.parentId);
      }

      // Set selection
      dynamicSelectCategory(...path.reverse());
    }
  } catch (error) {
    pageErrorMessage.value = error as string;
  }
};

// ----- File Upload Events ----- //

const onDropFile = (event: DragEvent) => {
  // Reset image validation message
  validation.value.image = '';
  const { files } = event.dataTransfer as any;
  if (files && files[0]) selectImage(files[0]);
};

const onChooseFile = async (event: Event) => {
  // Reset image validation message
  validation.value.image = '';
  const { files } = event.target as HTMLInputElement;
  if (files && files[0]) selectImage(files[0]);
};

const selectImage = (file: File) => {
  if (file) {
    if (!getMimeType(file, file.type)?.startsWith('image/')) {
      validation.value.image = 'Invalid file. Please select an image.';
      image.value.src = '';
      return;
    }

    // Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
    if (image.value.src) {
      URL.revokeObjectURL(image.value.src);
    }
    // Create the blob link to the file to optimize performance
    const blob = URL.createObjectURL(file);

    // Update the image. The type will be derived from the extension and it can lead to an incorrect result
    image.value.src = blob;
    image.value.file = file;
  }
};

// ----- Categories Dropdown Logic ----- //

/**
 * @param ids The ids sequence starting from parent down to children
 */
const dynamicSelectCategory = (...ids: number[]) => {
  ids.forEach((id, i) => {
    selectCategories.value.push(id);
    onSelectCategory(id, i);
  });
};

const onSelectCategory = (categoryId: any, level: number) => {
  if (!categoryId) return;

  // Remove the children levels
  levels.value.splice(level + 1, levels.value.length);

  // Get selected category
  const selectedCategory = categories.value.find((category) => category.id === categoryId);

  // Append the selected category children
  const children = categories.value.filter((category) => category.parentId === categoryId);
  if (children.length) {
    levels.value.push({ items: children, title: selectedCategory?.name || 'Categories' });
  }

  // Reset children value if exists
  for (let i = level + 1; i < autocomplete.value.length; i++) {
    autocomplete.value[i].reset();
  }

  // Set selection
  setSelectedCategory();
};

const onClearCategory = (level: number) => {
  // Remove the children levels
  levels.value.splice(level + 1, levels.value.length);

  // Set selection
  setSelectedCategory();
};

const setSelectedCategory = () => {
  currentProduct.value.categoryId = undefined;
  for (let i = selectCategories.value.length - 1; i >= 0; i--) {
    if (selectCategories.value[i]) {
      currentProduct.value.categoryId = selectCategories.value[i];
      break;
    }
  }

  if (currentProduct.value.categoryId) {
    const selected = categories.value.find((c) => c.id === currentProduct.value.categoryId);
    selectedCategoryName.value = selected?.name || '';
  } else {
    selectedCategoryName.value = '';
  }
};

// ----- Form Submit ----- //

const submitForm = async () => {
  isLoading.value = true;
  isFormActive.value = true;
  formErrorMessage.value = '';

  const { valid } = await form.value.validate();
  if (valid) {
    // Upload the image if exists
    if (image.value.file) {
      const url = await uploadImage(image.value.file);
      if (url) {
        currentProduct.value.picture = url;
      } else {
        isLoading.value = false;
        return;
      }
    }

    // Make a request to store the data
    // Edit Mode / Add Mode
    const data = await (currentProduct.value.id ? editProduct() : addProduct());

    // Navigate to products list page
    if (data) router.push({ name: 'products' });
  }
  isLoading.value = false;
};

const uploadImage = async (imageBlob: File) => {
  try {
    const result = await ProductsProvider.uploadImage(imageBlob);
    return result.data;
  } catch (error) {
    formErrorMessage.value = ('Error uploading the image: ' + error) as string;
  }
  return null;
};

const addProduct = async (): Promise<Category | null> => {
  try {
    const result = await ProductsProvider.CreateProduct({
      name: currentProduct.value.name as string,
      categoryId: currentProduct.value.categoryId,
      picture: currentProduct.value.picture as string
    });
    return result.data;
  } catch (error) {
    formErrorMessage.value = error as string;
  }
  return null;
};

const editProduct = async (): Promise<Category | null> => {
  try {
    const result = await ProductsProvider.updateProduct(currentProduct.value.id as number, {
      name: currentProduct.value.name as string,
      categoryId: currentProduct.value.categoryId,
      picture: currentProduct.value.picture as string
    });
    return result.data;
  } catch (error) {
    formErrorMessage.value = error as string;
  }
  return null;
};

// ----- Validation Rules ----- //

const validationRules = computed(() => ({
  name: [
    (v: string) => $v.required(v) || 'Product name is required',
    (v: string) => $v.lengthBetween(v, 3, 200) || 'Product name must between 3 and 100 letters)'
  ],
  category: [(v: string) => $v.required(v) || 'Category is required']
}));
</script>

<template>
  <div class="products-wrapper">
    <v-sheet class="products-form pa-3" border rounded>
      <!-- Title Bar -->
      <v-sheet class="d-flex align-center mb-2 ms-1">
        <v-btn
          @click="$router.push({ name: 'products' })"
          class="flex-0-0"
          icon="mdi-arrow-left"
          variant="text"
        />
        <p class="ms-2 text-h6 font-weight-bold">{{ $route.meta.pageTitle }}</p>
      </v-sheet>

      <!-- Alerts Message Based on Status -->
      <template v-if="!isLoading">
        <AppCompactAlert v-if="pageErrorMessage" type="error">
          {{ pageErrorMessage }}
        </AppCompactAlert>
        <AppCompactAlert v-else-if="!categories?.length" type="warning">
          There are no categories yet. Please add some categories first.
        </AppCompactAlert>
      </template>

      <!-- Loading -->
      <div style="height: 1rem"><AppProgressLinear v-if="isLoading" /></div>

      <!-- Form -->
      <v-form
        :disabled="isLoading || !!pageErrorMessage"
        ref="form"
        :validate-on="isFormActive ? 'input' : 'submit'"
        class="d-flex flex-wrap pa-3"
      >
        <!-- Data Inputs -->
        <v-sheet class="v-col-sm-12 v-col-md-6">
          <p class="mb-4">Name *</p>
          <v-text-field
            v-model="currentProduct.name"
            :rules="validationRules.name"
            class="mb-4"
            label="Name"
            hide-details="auto"
          />
          <p class="mb-4">
            <v-input :rules="validationRules.category" v-model="currentProduct.categoryId">
              Category * <span class="ms-1 font-weight-bold">{{ selectedCategoryName }}</span>
            </v-input>
          </p>
          <div v-for="(level, i) in levels" :key="`autocomplete-${i}`">
            <v-autocomplete
              ref="autocomplete"
              v-model="selectCategories[i]"
              class="my-4"
              :items="level.items"
              :label="`${level.title}`"
              filter-keys="title"
              item-title="name"
              item-value="id"
              hide-details="auto"
              clearable
              @click:clear="() => onClearCategory(i)"
              @update:model-value="(id) => onSelectCategory(id, i)"
            />
          </div>
        </v-sheet>

        <!-- Image Upload -->
        <v-sheet class="v-col-sm-12 v-col-md-6" rounded>
          <div style="max-width: 400px">
            <div class="d-flex justify-space-between">
              <p class="mb-2">Image</p>
              <v-tooltip text="The Image will be resized to (3200×3200)px">
                <template v-slot:activator="{ props }">
                  <v-icon v-bind="props" icon="mdi-help" size="small"></v-icon>
                </template>
              </v-tooltip>
              <v-spacer></v-spacer>
              <v-tooltip text="Remove" location="top">
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-if="image.src"
                    :disabled="isLoading"
                    v-bind="props"
                    class="mx-1"
                    color="error"
                    icon="mdi-close"
                    size="small"
                    variant="text"
                    @click="image.src = ''"
                  />
                </template>
              </v-tooltip>
            </div>
            <v-input
              v-if="!image.src"
              @click="file.click()"
              @drop.prevent="onDropFile"
              class="image-area"
            >
              <v-icon icon="mdi-image" size="large"></v-icon>
              <span class="font-weight-bold ms-1">Choose or Drop Image</span>
              <input
                type="file"
                ref="file"
                hidden
                @change="onChooseFile($event)"
                accept="image/*"
              />
            </v-input>
            <v-sheet v-else class="cropper-area">
              <img :src="image.src" width="100%" height="100%" style="object-fit: contain" />
            </v-sheet>
            <span class="text-error">{{ validation.image }}</span>
          </div>
        </v-sheet>

        <AppCompactAlert v-if="formErrorMessage" type="error" class="mx-3">
          {{ formErrorMessage }}
        </AppCompactAlert>

        <!-- Actions Buttons -->
        <v-sheet class="d-flex justify-end w-100 mt-6 mx-2 mb-2">
          <v-btn
            class="mx-1 wide"
            color="grey"
            prepend-icon="mdi-close"
            variant="outlined"
            @click="$router.push({ name: 'products' })"
          >
            Cancel
          </v-btn>
          <v-btn
            :disabled="isLoading || !!pageErrorMessage"
            class="mx-1 wide"
            color="success"
            prepend-icon="mdi-check"
            @click="submitForm"
          >
            Save
          </v-btn>
        </v-sheet>
      </v-form>
    </v-sheet>
  </div>
</template>

<style scoped lang="scss">
$border-color: grey;
$border-width: 2px;
$hover-color: #eeeeee64;

.products-wrapper {
  display: flex;
  justify-content: center;
  align-content: center;
  padding-bottom: 8rem;
}

.products-form {
  width: 800px;
  min-height: 500px;
}

.v-btn.wide {
  min-width: 10rem;
}

.cropper-area {
  width: 100%;
  height: 400px;
  border: $border-width solid $border-color;
  border-radius: 1rem;
  cursor: grab;

  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.image-area {
  width: 100%;
  height: 400px;
  border: $border-width dashed $border-color;
  border-radius: 1rem;
  cursor: pointer;

  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  user-select: none;

  &:hover {
    background-color: $hover-color;
  }
}
</style>
