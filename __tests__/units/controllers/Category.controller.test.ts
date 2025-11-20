import { GetAllCategories } from "../../../src/useCases/category/GetAllCategories.usecase";
import { CreateCategory } from "../../../src/useCases/category/CreateCategory.usecase";

describe("Category Use Cases - Controller Integration", () => {
  describe("GetAllCategories Use Case - Happy Path", () => {
    it("should execute and return categories", async () => {
      const mockAdapter = {
        findAllCategories: jest.fn().mockResolvedValue([
          { id: 1, descricao: "Alimentação" },
          { id: 2, descricao: "Transporte" },
        ]),
        createCategory: jest.fn(),
      };
      const useCase = new GetAllCategories(mockAdapter);

      const result = await useCase.execute();

      expect(result).toHaveLength(2);
      expect(mockAdapter.findAllCategories).toHaveBeenCalled();
    });
  });

  describe("GetAllCategories Use Case - Sad Path", () => {
    it("should propagate error from adapter", async () => {
      const mockAdapter = {
        findAllCategories: jest.fn().mockRejectedValue(new Error("Database error")),
        createCategory: jest.fn(),
      };
      const useCase = new GetAllCategories(mockAdapter);

      await expect(useCase.execute()).rejects.toThrow("Database error");
    });
  });

  describe("CreateCategory Use Case - Happy Path", () => {
    it("should execute and create category", async () => {
      const mockAdapter = {
        findAllCategories: jest.fn(),
        createCategory: jest.fn().mockResolvedValue({ id: 3, descricao: "Lazer" }),
      };
      const useCase = new CreateCategory(mockAdapter);

      const result = await useCase.execute("Lazer");

      expect(result.descricao).toBe("Lazer");
      expect(mockAdapter.createCategory).toHaveBeenCalledWith("Lazer");
    });
  });

  describe("CreateCategory Use Case - Sad Path", () => {
    it("should propagate error from adapter", async () => {
      const mockAdapter = {
        findAllCategories: jest.fn(),
        createCategory: jest.fn().mockRejectedValue(new Error("Insert failed")),
      };
      const useCase = new CreateCategory(mockAdapter);

      await expect(useCase.execute("Test")).rejects.toThrow("Insert failed");
    });

    it("should handle database constraint violations", async () => {
      const mockAdapter = {
        findAllCategories: jest.fn(),
        createCategory: jest.fn().mockRejectedValue(new Error("Unique constraint violation")),
      };
      const useCase = new CreateCategory(mockAdapter);

      await expect(useCase.execute("Duplicate")).rejects.toThrow("Unique constraint violation");
    });
  });
});
