import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import HomeView from '@/pages/HomePage.vue';
import Products from '@/pages/products/ProductsPage.vue';
import ProductsForm from '@/pages/products/ProductsForm.vue';
import NotFound from '@/pages/NotFound.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/products',
    name: 'products',
    component: Products,
    meta: {
      pageTitle: 'Products'
    }
  },
  {
    path: '/products/add',
    name: 'add-product',
    component: ProductsForm,
    meta: {
      pageTitle: 'Add Product'
    }
  },
  {
    path: '/products/edit/:id',
    name: 'edit-product',
    component: ProductsForm,
    meta: {
      pageTitle: 'Edit Product'
    }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../pages/AboutPage.vue')
  },
  {
    path: '/not-found',
    name: 'not-found',
    component: NotFound
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: 'not-found'
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0 };
  }
});

export default router;
