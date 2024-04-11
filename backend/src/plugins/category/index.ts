import { FastifyInstance } from 'fastify';
import BaseAppPlugin from '../base.plugins';
import CategoryController from './category.controller';
import { categoryDataSchema, singleIdParamSchema } from './category.schemas';

export default class CategoryPlugin extends BaseAppPlugin {
  override basePath: string = 'categories';
  private categoryController;

  constructor() {
    super();
    this.categoryController = new CategoryController();
  }

  override async handler(app: FastifyInstance): Promise<void> {
    app.get('/', this.categoryController.getCategories);
    
    app.get('/tree', this.categoryController.getCategoriesTree);

    app.get(
      '/:id',
      { schema: singleIdParamSchema },
      this.categoryController.getCategory
    );

    app.post(
      '/',
      { schema: categoryDataSchema },
      this.categoryController.createCategory
    );

    app.put(
      '/:id',
      { schema: categoryDataSchema },
      this.categoryController.editCategory
    );

    app.delete(
      '/:id',
      { schema: singleIdParamSchema },
      this.categoryController.deleteCategory
    );
  }
}
