import type { ICategoryAdapter, TCategory } from "../../domain/interfaces/Category.interface";

export class GetAllCategories {
  private categoryAdapter: ICategoryAdapter;

  constructor(categoryRepository: ICategoryAdapter) {
    this.categoryAdapter = categoryRepository;
  }

  async execute(): Promise<Array<TCategory>> {
    return this.categoryAdapter.findAllCategories();
  }
}
