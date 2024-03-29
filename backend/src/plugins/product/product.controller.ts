import { FastifyReply, FastifyRequest } from 'fastify';
import ProductsRepository from '@app/repositories/product.repository';
import CategoriesRepository from '@app/repositories/categories.repository';
import { ProductData } from './product.types';

export default class ProductController {
  /**
   * Creates a new product in the database.
   *
   * @param request - Fastify request object containing product data
   * @param reply - Fastify reply object to send the response
   * @returns {Promise<void>}
   */
  async createProduct(
    request: FastifyRequest<{ Body: ProductData }>,
    reply: FastifyReply
  ): Promise<void> {
    const { name, picture, categoryId } = request.body;

    // Check if the categoryId exists in categories table
    const categoryExists = await CategoriesRepository.categoryIdExists(
      categoryId
    );
    if (!categoryExists) {
      // TODO: UNIFY THE ERROR RESPONSE SCHEMA
      return reply.code(404).send({ error: 'Category not found' });
    }

    const product = await ProductsRepository.createProduct({
      name,
      picture,
      categoryId,
    });

    reply.code(201).send({ data: product });
  }

  /**
   * Edits an existing product in the database.
   *
   * @param request - Fastify request object containing product data and ID
   * @param reply - Fastify reply object to send the response
   * @returns {Promise<void>}
   */
  async editProduct(
    request: FastifyRequest<{ Body: ProductData; Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    const id = Number(request.params.id);
    const { name, picture, categoryId } = request.body;

    // Check if the product exists
    const existingProduct = await ProductsRepository.productExists(id);
    if (!existingProduct) {
      // TODO: UNIFY THE ERROR RESPONSE SCHEMA
      return reply.code(404).send({ error: 'Product not found' });
    }

    // Check if the categoryId exists in categories table
    const categoryExists = await CategoriesRepository.categoryIdExists(
      categoryId
    );
    if (!categoryExists) {
      // TODO: UNIFY THE ERROR RESPONSE SCHEMA
      return reply.code(404).send({ error: 'Category not found' });
    }

    const product = await ProductsRepository.updateProduct(id, {
      name,
      picture,
      categoryId,
    });

    reply.code(200).send({ data: product }); // No content response for successful update
  }

  /**
   * Retrieves a list of all products from the database.
   *
   * @param request - Fastify request object (not currently used in this implementation)
   * @param reply - Fastify reply object to send the response
   * @returns {Promise<void>}
   */
  async getProducts(
    _request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const products = await ProductsRepository.getProducts();

    reply.code(200).send({ data: products });
  }

  /**
   * Retrieves a specific product by its ID from the database.
   *
   * @param request - Fastify request object containing route parameters
   * @param reply - Fastify reply object to send the response
   * @returns {Promise<void>}
   */
  async getProduct(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    const id = Number(request.params.id);

    const product = await ProductsRepository.getProductById(id);
    if (!product) {
      // TODO: UNIFY THE ERROR RESPONSE SCHEMA
      return reply.code(404).send({ error: 'Product not found' });
    }

    reply.code(200).send({ data: product });
  }

  /**
   * Deletes a specific product by its ID from the database.
   *
   * @param request - Fastify request object containing route parameters
   * @param reply - Fastify reply object to send the response
   * @returns {Promise<void>}
   */
  async deleteProduct(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    const id = Number(request.params.id);

    // Check if the product exists
    const existingProduct = await ProductsRepository.productExists(id);
    if (!existingProduct) {
      // TODO: UNIFY THE ERROR RESPONSE SCHEMA
      return reply.code(404).send({ error: 'Product not found' });
    }

    await ProductsRepository.deleteProduct(id);

    reply.code(200).send({ message: 'Product successfully deleted' });
  }
}
