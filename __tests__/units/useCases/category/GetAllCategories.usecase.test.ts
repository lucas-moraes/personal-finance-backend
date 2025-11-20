import { GetAllCategories } from "../../../../src/useCases/category/GetAllCategories.usecase";
import type { ICategoryAdapter, TCategory } from "../../../../src/domain/interfaces/Category.interface";

describe("GetAllCategories UseCase", () => {
  let getAllCategories: GetAllCategories;
  let mockCategoryAdapter: jest.Mocked<ICategoryAdapter>;

  beforeEach(() => {
    mockCategoryAdapter = {
      findAllCategories: jest.fn(),
      createCategory: jest.fn(),
    };
    getAllCategories = new GetAllCategories(mockCategoryAdapter);
  });

  describe("Happy Path", () => {
    it("should return all categories successfully", async () => {
      const mockCategories: TCategory[] = [
        { id: 1, descricao: "Alimentação" },
        { id: 2, descricao: "Transporte" },
      ];
      mockCategoryAdapter.findAllCategories.mockResolvedValue(mockCategories);

      const result = await getAllCategories.execute();

      expect(mockCategoryAdapter.findAllCategories).toHaveBeenCalled();
      expect(result).toEqual(mockCategories);
    });

    it("should return empty array when no categories exist", async () => {
      mockCategoryAdapter.findAllCategories.mockResolvedValue([]);

      const result = await getAllCategories.execute();

      expect(result).toEqual([]);
    });
  });

  describe("Sad Path", () => {
    it("should handle error when fetching categories fails", async () => {
      mockCategoryAdapter.findAllCategories.mockRejectedValue(new Error("Database connection error"));

      await expect(getAllCategories.execute()).rejects.toThrow("Database connection error");
    });

    it("should handle timeout error", async () => {
      mockCategoryAdapter.findAllCategories.mockRejectedValue(new Error("Query timeout"));

      await expect(getAllCategories.execute()).rejects.toThrow("Query timeout");
    });
  });
});
