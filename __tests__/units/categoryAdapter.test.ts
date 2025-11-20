import { CategoryAdapter } from "../../src/infrastructure/adapters/Category.adapter";
import type { TCategory } from "../../src/domain/interfaces/Category.interface";

jest.mock("../../src/infrastructure/database/DataSource", () => ({
  db: {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    returning: jest.fn(),
  },
}));

describe("CategoryAdapter", () => {
  let categoryAdapter: CategoryAdapter;
  let mockDb: any;

  beforeEach(() => {
    jest.clearAllMocks();
    const { db } = require("../../src/infrastructure/database/DataSource");
    mockDb = db;
    categoryAdapter = new CategoryAdapter();
  });

  describe("Happy Path", () => {
    it("should find all categories successfully", async () => {
      const mockCategories: TCategory[] = [
        { id: 1, descricao: "Alimentação" },
        { id: 2, descricao: "Transporte" },
      ];
      mockDb.from.mockResolvedValue(mockCategories);

      const result = await categoryAdapter.findAllCategories();

      expect(mockDb.select).toHaveBeenCalled();
      expect(result).toEqual(mockCategories);
    });

    it("should create a category successfully", async () => {
      const mockCategory: TCategory = { id: 2, descricao: "Transporte" };
      mockDb.returning.mockResolvedValue([mockCategory]);

      const result = await categoryAdapter.createCategory("Transporte");

      expect(mockDb.insert).toHaveBeenCalled();
      expect(mockDb.values).toHaveBeenCalledWith({ descricao: "Transporte" });
      expect(result).toEqual(mockCategory);
    });
  });

  describe("Sad Path", () => {
    it("should handle error when finding all categories fails", async () => {
      mockDb.from.mockImplementationOnce(() => {
        throw new Error("Database error");
      });

      await expect(categoryAdapter.findAllCategories()).rejects.toThrow("Database error");
    });

    it("should handle error when creating a category fails", async () => {
      mockDb.returning.mockImplementationOnce(() => {
        throw new Error("Insert failed");
      });

      await expect(categoryAdapter.createCategory("Test")).rejects.toThrow("Insert failed");
    });
  });
});
