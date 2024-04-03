<script setup lang="ts">
import { ref, type Ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { RouterLink } from 'vue-router';
import ProductsProvider from '@/providers/products.provider';
import type { Product } from '@/types/app.types';
import ProductCard from './ProductCard.vue';
import AppConfirmDialog from '@/components/AppConfirmDialog.vue';

const isLoading: Ref<boolean> = ref(true);
const errorMessage: Ref<string | null> = ref(null);
const products: Ref<Product[]> = ref([]);
const totalCount: Ref<number> = ref(0);
const page: Ref<number> = ref(1);
const pagesCount: Ref<number> = ref(0);
const pageSize = 20;
const snackbar = ref(false);
const snackbarOptions: Ref<{ message: string; type: string }> = ref({
  message: '',
  type: 'info'
});
const confirmData = ref({
  isOpened: false,
  title: 'Confirm Delete',
  message: '',
  onConfirm: () => {}
});

// ----- Initialize services ----- //

const route = useRoute();
const router = useRouter();

// ----- Initialize Data ----- //

onMounted(async () => {
  const queryPage = parseInt(route.query.page as string);
  page.value = !isNaN(queryPage) ? queryPage : 1;
  loadPage(page.value);
});

// ----- Watches ----- //

watch(page, (newPage) => {
  if (newPage !== parseInt((route.query.page as string) || '1')) {
    loadPage(newPage);
  }
});

// ----- Component Logic ----- //

const showSnakeMessage = (message: string, type: 'info' | 'error' | 'warning' = 'info') => {
  snackbarOptions.value.message = message;
  snackbarOptions.value.type = type;
  snackbar.value = true;
};

const loadPage = (page: number) => {
  updatePageFromUrl(page);
  fetchData(page);
};

const updatePageFromUrl = (newPage: number) => {
  router.replace({
    query: {
      ...route.query,
      page: newPage
    }
  });
};

const fetchData = async (newPage: number) => {
  resetStat();
  try {
    const result = (await ProductsProvider.getAllProducts(newPage)).data;
    products.value = result.products;
    totalCount.value = result.totalCount;
    pagesCount.value = Math.ceil(totalCount.value / pageSize);

    // Redirect to the last page in case the current page is out of range
    if (parseInt(route.query.page as string) > pagesCount.value) {
      page.value = pagesCount.value;
    }
  } catch (error) {
    errorMessage.value = error as string;
  } finally {
    isLoading.value = false;
  }
};

const onDeleteProduct = (id: number, name: string) => {
  if (!id) return;

  confirmData.value.message = `Are you sure you want to delete "${name}"`;
  confirmData.value.onConfirm = () => {
    handleDeleteProduct(id, name);
  };
  confirmData.value.isOpened = true;
};

const handleDeleteProduct = async (id: number, name: string) => {
  try {
    await ProductsProvider.DeleteProduct(id);

    products.value = products.value.filter((p) => p.id !== id);

    showSnakeMessage(`${name} had been deleted.`);
  } catch (error) {
    showSnakeMessage(`Error: ${error as string}`, 'error');
  }
};

const resetStat = () => {
  isLoading.value = true;
  products.value = [];
};
</script>

<template>
  <v-sheet class="pa-1" border>
    <!-- Products Top Bar -->
    <v-sheet class="d-flex flex-wrap justify-space-between align-center ma-2">
      <p class="ms-2 text-h6 font-weight-bold">Products</p>
      <RouterLink :to="{ name: 'add-product' }">
        <v-btn class="ma-2" color="green" append-icon="mdi-plus">Add Product</v-btn>
      </RouterLink>
    </v-sheet>

    <!-- Alerts Message Based on Status -->
    <div v-if="!isLoading" class="pa-3">
      <AppCompactAlert v-if="errorMessage" type="error">{{ errorMessage }}</AppCompactAlert>
      <div v-else-if="products?.length" class="text-h6">
        <span>
          Showing {{ products?.length > 1 ? `${products?.length} products` : `one product` }}
        </span>
        <span> out of {{ totalCount }} </span>
      </div>
      <AppCompactAlert v-else type="warning">No products found</AppCompactAlert>
    </div>

    <!-- Loading Bar -->
    <AppProgressLinear v-if="isLoading"></AppProgressLinear>

    <!-- Top Pagination -->
    <v-pagination v-if="pagesCount > 1" v-model="page" :length="pagesCount" rounded="circle" />

    <v-sheet class="d-flex flex-wrap my-2" style="min-height: 100px" no-gutters>
      <!-- Products Cards -->
      <template v-if="products?.length">
        <v-col
          v-for="product in products"
          :key="product.id"
          class="v-col-sm-12 v-col-md-6 v-col-lg-4 v-col flex-1-1-100 my-2 pa-0"
        >
          <ProductCard :product="product" :on-delete="onDeleteProduct" />
        </v-col>
      </template>

      <!-- Products Skeleton Loader -->
      <template v-else-if="isLoading">
        <v-col
          v-for="i in Array.from({ length: 6 }, (_, i) => i + 1)"
          :key="`${i}-products-skeleton`"
          class="v-col-sm-12 v-col-md-6 v-col-lg-4 v-col flex-1-1-100 my-2 pa-0"
        >
          <v-skeleton-loader class="mx-2 border" type="card-avatar, actions" />
        </v-col>
      </template>
    </v-sheet>

    <!-- Bottom Pagination -->
    <v-pagination v-if="pagesCount > 1" v-model="page" :length="pagesCount" rounded="circle" />

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :timeout="3000" :color="snackbarOptions.type">
      {{ snackbarOptions.message }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar = false">Close</v-btn>
      </template>
    </v-snackbar>

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
