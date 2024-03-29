import { Product } from '@prisma/client';
import prismaClient from '@app/prisma-client';

export default class ProductsRepository {
  /**
   * Retrieves a list of all products.
   *
   * @returns A Promise that resolves to an array of Product objects
   */
  static async getProducts(): Promise<Product[]> {
    const products = await prismaClient.product.findMany();
    return products;
  }

  /**
   * Retrieves a single product by its ID.
   *
   * @param id - The ID of the product to retrieve
   * @returns A Promise that resolves to a Product object if found, null otherwise
   */
  static async getProductById(id: number): Promise<Product | null> {
    const product = await prismaClient.product.findUnique({
      where: { id },
    });
    return product;
  }

  /**
   * Creates a new product.
   *
   * @param data - An object containing the product data to create
   * @returns A Promise that resolves to the newly created Product object
   */
  static async createProduct(data: {
    name: string;
    picture: string | null;
    categoryId: number;
  }): Promise<Product> {
    const product = await prismaClient.product.create({
      data,
    });
    return product;
  }

  /**
   * Updates an existing product.
   *
   * @param id - The ID of the product to update
   * @param data - An object containing the updated product data
   * @returns A Promise that resolves to the updated Product object
   */
  static async updateProduct(
    id: number,
    data: {
      name: string;
      picture: string | null;
      categoryId: number;
    }
  ): Promise<Product> {
    const product = await prismaClient.product.update({
      where: { id },
      data,
    });
    return product;
  }

  /**
   * Deletes a product by its ID.
   *
   * @param id - The ID of the product to delete
   * @returns A Promise that resolves to a boolean indicating success
   */
  static async deleteProduct(id: number): Promise<boolean> {
    const result = await prismaClient.product.delete({
      where: { id },
    });
    return Boolean(result);
  }

  /**
   * Checks if a product exists in the database by its ID.
   *
   * @param id - The ID of the product to check
   * @returns A Promise that resolves to `true` if the product exists, `false` otherwise
   */
  static async productExists(id: number): Promise<boolean> {
    const count = await prismaClient.product.count({
      where: { id },
    });

    return count > 0;
  }
}
