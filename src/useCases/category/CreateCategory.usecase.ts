import type { ICategoryAdapter, TCategory } from "../../domain/interfaces/Category.interface";

export class CreateCategory {
  private categoryAdapter: ICategoryAdapter;

  constructor(categoryAdapter: ICategoryAdapter) {
    this.categoryAdapter = categoryAdapter;
  }

  async execute(description: string): Promise<TCategory> {
    return this.categoryAdapter.createCategory(description);
  }
}
