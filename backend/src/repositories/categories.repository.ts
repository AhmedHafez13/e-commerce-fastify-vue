import { Category } from '@prisma/client';
import prismaClient from '../prisma-client';
import { CategoryItem } from '../plugins/category/category.types';

export default class CategoriesRepository {
  /**
   * Retrieves a list of all categories with their nested relationships.
   *
   * @returns A Promise that resolves to an array of Category objects with nested children
   */
  static async getCategories(): Promise<Category[]> {
    const categories = await prismaClient.category.findMany({
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { name: 'asc' },
    });
    return categories;
  }

  /**
   * Retrieves a single category by its ID.
   *
   * @param id - The ID of the category to retrieve
   * @returns A Promise that resolves to a Category object if found, null otherwise
   */
  static async getCategoryById(id: number): Promise<Category | null> {
    const category = await prismaClient.category.findUnique({
      where: { id },
    });
    return category;
  }

  /**
   * Creates a new category.
   *
   * @param data - An object containing the category data to create
   * @returns A Promise that resolves to the newly created Category object
   */
  static async createCategory(data: {
    name: string;
    picture: string | null;
    parentId: number | null;
  }): Promise<Category> {
    const category = await prismaClient.category.create({
      data,
    });
    return category;
  }

  /**
   * Updates an existing category.
   *
   * @param id - The ID of the category to update
   * @param data - An object containing the updated category data
   * @returns A Promise that resolves to the updated Category object
   */
  static async updateCategory(
    id: number,
    data: {
      name: string;
      picture: string | null;
      parentId: number | null;
    }
  ): Promise<Category> {
    const category = await prismaClient.category.update({
      where: { id },
      data,
    });
    return category;
  }

  /**
   * Deletes a category by its ID.
   *
   * @param id - The ID of the category to delete
   * @returns A Promise that resolves to a boolean indicating success
   */
  static async deleteCategory(id: number): Promise<boolean> {
    const result = await prismaClient.category.delete({
      where: { id },
    });
    return Boolean(result);
  }

  /**
   * Checks if a category exists in the database by its ID.
   *
   * @param id - The ID of the category to check
   * @returns A Promise that resolves to `true` if the category exists, `false` otherwise
   */
  static async categoryIdExists(id: number): Promise<boolean> {
    const count = await prismaClient.category.count({
      where: { id },
    });

    return count > 0;
  }

  /**
   * Checks if a category exists in the database by its name.
   *
   * @param name - The name of the category to check
   * @returns A Promise that resolves to `true` if the category exists, `false` otherwise
   */
  static async categoryNameExists(
    name: string,
    excludeId?: number
  ): Promise<boolean> {
    const count = await prismaClient.category.count({
      where: {
        name,
        id: excludeId ? { not: excludeId } : undefined,
      },
    });

    return count > 0;
  }

  /**
   * Checks if a category associated with products.
   *
   * @param id - The ID of the category to check
   * @returns A Promise that resolves to `true` if the category associated with products, `false` otherwise
   */
  static async categoryHasProducts(id: number): Promise<boolean> {
    const count = await prismaClient.product.count({
      where: { categoryId: id },
    });

    return count > 0;
  }

  /**
   * Checks if a category has children categories.
   *
   * @param id - The ID of the category to check
   * @returns A Promise that resolves to `true` if the category has children, `false` otherwise
   */
  static async categoryHasChildren(id: number): Promise<boolean> {
    const count = await prismaClient.category.count({
      where: { parentId: id },
    });

    return count > 0;
  }

  static async getCategoriesTree() {
    let result: CategoryItem[] = await prismaClient.$queryRaw`
      WITH RECURSIVE Categories AS (
        SELECT id, name, 0 AS level, CAST(id as CHAR(255)) AS path
        FROM Category
        WHERE parentId IS NULL
        
        UNION ALL
        
        SELECT ct.id, ct.name, level + 1, CONCAT(path, '.', ct.id)
        FROM Category ct
        INNER JOIN Categories cts ON ct.parentId = cts.id
      )

      SELECT ct.id, ct.name, ct.picture, ct.parentId, COUNT(pr.categoryId) AS count, cts.path
      FROM Product pr
      RIGHT JOIN Category ct ON pr.categoryId = ct.id

      LEFT JOIN Categories cts ON cts.id = ct.id

      GROUP BY ct.id, ct.name, cts.path;
    `;

    // Create categories map { id: categoryItem }
    const categoryMap: { [key: string]: CategoryItem } = result.reduce(
      (acc: { [key: string]: CategoryItem }, category: CategoryItem) => {
        acc[category.id] = {
          ...category,
          count: Number(category.count),
          recursiveCount: 0,
        };
        return acc;
      },
      {}
    );

    for (const category of Object.values(categoryMap)) {
      if (category.path) {
        const pathIds = category.path.split('.');
        pathIds.forEach((id) => {
          categoryMap[id].recursiveCount += Number(category.count);
        });
      }
    }

    return Object.values(categoryMap);
  }
}
