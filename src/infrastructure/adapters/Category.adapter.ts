import { categories } from "../../domain/entities/Category.entity";
import type { ICategoryAdapter, TCategory } from "../../domain/interfaces/Category.interface";
import { db } from "../database/DataSource";

export class CategoryAdapter implements ICategoryAdapter {
  private categoryRepository: typeof db;

  constructor() {
    this.categoryRepository = db;
  }

  async findAllCategories(): Promise<Array<TCategory>> {
    const all = await this.categoryRepository.select().from(categories);
    return all;
  }

  async createCategory(descricao: string): Promise<TCategory> {
    const inserted = await this.categoryRepository.insert(categories).values({ descricao }).returning();
    return inserted[0];
  }
}
