import axios from './axios';

const BASE_PATH = '/api/v1';

export default class ProductsProvider {
  static getAllCategories() {
    return axios.get(BASE_PATH + '/categories');
  }

  static CreateCategory(category: { name: string; parentId?: number | null; image?: string }) {
    return axios.post(BASE_PATH + '/categories', { ...category });
  }

  static updateCategory(
    categoryId: number,
    category: { name: string; parentId?: number; image?: string }
  ) {
    const data = { ...category };

    // Remove parentIf if falsy
    if (!data.parentId) data.parentId = undefined;

    return axios.put(BASE_PATH + `/categories/${categoryId}`, data);
  }

  static deleteCategory(categoryId: number) {
    return axios.delete(BASE_PATH + `/categories/${categoryId}`);
  }

  static getAllProducts(page: number) {
    return axios.get(BASE_PATH + `/products?page=${page}`);
  }

  static getProduct(id: number) {
    return axios.get(BASE_PATH + `/products/${id}`);
  }

  static CreateProduct(product: { name: string; categoryId?: number; picture?: string }) {
    return axios.post(BASE_PATH + '/products', { ...product });
  }

  static updateProduct(
    productId: number,
    product: { name: string; categoryId?: number; picture?: string }
  ) {
    return axios.put(BASE_PATH + `/products/${productId}`, { ...product });
  }

  static async uploadImage(image: File) {
    const formData = new FormData();
    formData.append('image', image);

    return axios.post(BASE_PATH + `/image/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }

  static DeleteProduct(productId: number) {
    return axios.delete(BASE_PATH + `/products/${productId}`);
  }
}
