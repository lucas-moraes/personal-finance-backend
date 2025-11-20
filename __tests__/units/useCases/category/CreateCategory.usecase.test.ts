import { CreateCategory } from "../../../../src/useCases/category/CreateCategory.usecase";
import type { ICategoryAdapter, TCategory } from "../../../../src/domain/interfaces/Category.interface";

describe("CreateCategory UseCase", () => {
  let createCategory: CreateCategory;
  let mockCategoryAdapter: jest.Mocked<ICategoryAdapter>;

  beforeEach(() => {
    mockCategoryAdapter = {
      findAllCategories: jest.fn(),
      createCategory: jest.fn(),
    };
    createCategory = new CreateCategory(mockCategoryAdapter);
  });

  describe("Happy Path", () => {
    it("should create a category successfully", async () => {
      const mockCategory: TCategory = { id: 1, descricao: "Alimentação" };
      mockCategoryAdapter.createCategory.mockResolvedValue(mockCategory);

      const result = await createCategory.execute("Alimentação");

      expect(mockCategoryAdapter.createCategory).toHaveBeenCalledWith("Alimentação");
      expect(result).toEqual(mockCategory);
    });

    it("should create a category with special characters", async () => {
      const mockCategory: TCategory = { id: 2, descricao: "Café & Restaurante" };
      mockCategoryAdapter.createCategory.mockResolvedValue(mockCategory);

      const result = await createCategory.execute("Café & Restaurante");

      expect(result).toEqual(mockCategory);
    });
  });

  describe("Sad Path", () => {
    it("should handle error when category creation fails", async () => {
      mockCategoryAdapter.createCategory.mockRejectedValue(new Error("Database error"));

      await expect(createCategory.execute("Test")).rejects.toThrow("Database error");
    });

    it("should handle error when adapter throws unexpected error", async () => {
      mockCategoryAdapter.createCategory.mockRejectedValue(new Error("Unexpected error"));

      await expect(createCategory.execute("Test")).rejects.toThrow("Unexpected error");
    });
  });
});
