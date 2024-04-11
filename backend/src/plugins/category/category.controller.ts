import CategoriesRepository from '../../repositories/categories.repository';
import { FastifyReply, FastifyRequest } from 'fastify';
import { CategoryData } from './category.types';

export default class CategoryController {
  /**
   * Creates a new category in the database.
   *
   * @param request - Fastify request object containing category data
   * @param reply - Fastify reply object to send the response
   * @returns {Promise<void>}
   */
  async createCategory(
    request: FastifyRequest<{ Body: CategoryData }>,
    reply: FastifyReply
  ): Promise<void> {
    const { name, picture, parentId } = request.body;

    // Check if the parent category exists in categories table
    if (parentId) {
      const parentExists = await CategoriesRepository.categoryIdExists(
        parentId
      );
      if (!parentExists) {
        // TODO: UNIFY THE ERROR RESPONSE SCHEMA
        return reply.code(404).send({ message: 'Parent category not found' });
      }
    }

    const newCategory = await CategoriesRepository.createCategory({
      name,
      picture,
      parentId,
    });

    reply.code(201).send({ data: newCategory });
  }

  /**
   * Edits an existing category in the database.
   *
   * @param request - Fastify request object containing category data and ID
   * @param reply - Fastify reply object to send the response
   * @returns {Promise<void>}
   */
  async editCategory(
    request: FastifyRequest<{ Body: CategoryData; Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    const id = Number(request.params.id);
    const { name, picture, parentId } = request.body;

    // Check if the parentId is the same as the category itself
    if (id === parentId) {
      // TODO: UNIFY THE ERROR RESPONSE SCHEMA
      return reply
        .code(422)
        .send({ message: 'A category cannot be its own child' });
    }

    // Check if the category exists
    const categoryExists = await CategoriesRepository.categoryIdExists(id);
    if (!categoryExists) {
      // TODO: UNIFY THE ERROR RESPONSE SCHEMA
      return reply.code(404).send({ message: 'Category not found' });
    }

    // Check if the parent category exists in categories table
    if (parentId) {
      const parentExists = await CategoriesRepository.categoryIdExists(
        parentId
      );
      if (!parentExists) {
        // TODO: UNIFY THE ERROR RESPONSE SCHEMA
        return reply.code(404).send({ message: 'Parent category not found' });
      }
    }

    const updatedCategory = await CategoriesRepository.updateCategory(id, {
      name,
      picture,
      parentId,
    });
    if (!updatedCategory) {
      // TODO: UNIFY THE ERROR RESPONSE SCHEMA
      return reply.code(404).send({ message: 'Category not found' });
    }

    reply.code(200).send({ data: updatedCategory });
  }

  /**
   * Retrieves a list of all categories from the database.
   *
   * @param request - Fastify request object (not currently used in this implementation)
   * @param reply - Fastify reply object to send the response
   * @returns {Promise<void>}
   */
  async getCategories(
    _request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const categories = await CategoriesRepository.getCategories();
    reply.code(200).send({ data: categories });
  }

  async getCategoriesTree(
    _request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const categories = await CategoriesRepository.getCategoriesTree();
    reply.code(200).send({ data: categories });
  }

  /**
   * Retrieves a specific category by its ID from the database.
   *
   * @param request - Fastify request object containing route parameters
   * @param reply - Fastify reply object to send the response
   * @returns {Promise<void>}
   */
  async getCategory(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    const id = Number(request.params.id);

    const category = await CategoriesRepository.getCategoryById(id);
    if (!category) {
      return reply.code(404).send({ message: 'Category not found' });
    }

    reply.code(200).send({ data: category });
  }

  /**
   * Deletes a specific category by its ID from the database.
   *
   * @param request - Fastify request object containing route parameters
   * @param reply - Fastify reply object to send the response
   * @returns {Promise<void>}
   */
  async deleteCategory(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    const id = Number(request.params.id);

    // Check if the category exists
    const categoryExists = await CategoriesRepository.categoryIdExists(id);
    if (!categoryExists) {
      // TODO: UNIFY THE ERROR RESPONSE SCHEMA
      return reply.code(404).send({ message: 'Category not found' });
    }

    // Check if the category has products
    const hasProducts = await CategoriesRepository.categoryHasProducts(id);
    if (hasProducts) {
      // TODO: UNIFY THE ERROR RESPONSE SCHEMA
      return reply.code(422).send({
        error: "Can't delete category. Remove linked products first.",
      });
    }

    // Check if the category has children
    const hasChildren = await CategoriesRepository.categoryHasChildren(id);
    if (hasChildren) {
      // TODO: UNIFY THE ERROR RESPONSE SCHEMA
      return reply.code(422).send({
        error: "Can't delete category. Remove linked children first.",
      });
    }

    await CategoriesRepository.deleteCategory(id);

    reply.code(200).send({ message: 'Category successfully deleted.' });
  }
}
