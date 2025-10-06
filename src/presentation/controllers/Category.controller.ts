import { CreateCategory } from "../../useCases/category/CreateCategory.usecase";
import { GetAllCategories } from "../../useCases/category/GetAllCategories.usecase";
import { RESPONSE_MESSAGES } from "../constants/index";
import { CategoryAdapter } from "../../infrastructure/adapters/Category.adapter";
import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";

export class CategoryController {
  private getAllCategoriesUseCase: GetAllCategories;
  private createCategoryUseCase: CreateCategory;

  constructor() {
    const categoryRepository = new CategoryAdapter();
    this.getAllCategoriesUseCase = new GetAllCategories(categoryRepository);
    this.createCategoryUseCase = new CreateCategory(categoryRepository);
  }

  async getAllCategories(c: Context) {
    try {
      const categories = await this.getAllCategoriesUseCase.execute();
      return c.json(categories);
    } catch (error) {
      return c.json({ message: (error as Error).message }, 500);
    }
  }

  async createCategory(c: Context) {
    try {
      const body = await c.req.json();

      const category = await this.createCategoryUseCase.execute(body?.description);
      if (category instanceof Error) {
        throw new HTTPException(400, { message: category.message });
      }

      return c.json(category);
    } catch (error) {
      return c.json({ message: (error as Error).message }, (error as HTTPException).status || 500);
    }
  }
}
