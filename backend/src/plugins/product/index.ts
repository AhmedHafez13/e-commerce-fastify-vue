import { FastifyInstance } from 'fastify';
import BaseAppPlugin from '../base.plugins';
import ProductController from './product.controller';
import {
  paginationSchema,
  productDataSchema,
  singleIdParamSchema,
} from './product.schemas';

export default class ProductPlugin extends BaseAppPlugin {
  override basePath: string = 'products';
  private productController;

  constructor() {
    super();
    this.productController = new ProductController();
  }

  override async handler(app: FastifyInstance): Promise<void> {
    app.get(
      '/',
      { schema: paginationSchema },
      this.productController.getProducts
    );

    app.get(
      '/:id',
      { schema: singleIdParamSchema },
      this.productController.getProduct
    );

    app.post(
      '/',
      { schema: productDataSchema },
      this.productController.createProduct
    );

    app.put(
      '/:id',
      { schema: productDataSchema },
      this.productController.editProduct
    );

    app.delete(
      '/:id',
      { schema: singleIdParamSchema },
      this.productController.deleteProduct
    );
  }
}
