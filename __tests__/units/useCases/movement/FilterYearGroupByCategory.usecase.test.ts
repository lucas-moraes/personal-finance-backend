import { FilterYearGroupByCategory } from "../../../../src/useCases/movement/FilterYearGroupByCategory.usecase";
import type { IMovementAdapter } from "../../../../src/domain/interfaces/Movement.interface";

describe("FilterYearGroupByCategory UseCase", () => {
  let filterYearGroupByCategory: FilterYearGroupByCategory;
  let mockMovementAdapter: jest.Mocked<IMovementAdapter>;

  beforeEach(() => {
    mockMovementAdapter = {
      findAllMovements: jest.fn(),
      findMovementsBy: jest.fn(),
      findMovementById: jest.fn(),
      createMovement: jest.fn(),
      createMultipleMovements: jest.fn(),
      deleteMovementById: jest.fn(),
      updateMovementById: jest.fn(),
      filterMovementGroupByCategory: jest.fn(),
      filterMovementGroupByMonth: jest.fn(),
      monthsWithMovements: jest.fn(),
      yearsWithMovements: jest.fn(),
    } as jest.Mocked<IMovementAdapter>;
    filterYearGroupByCategory = new FilterYearGroupByCategory(mockMovementAdapter);
  });

  describe("Happy Path", () => {
    it("should filter movements by year grouped by category successfully", async () => {
      const mockResult = [
        { categoria: 1, total_valor: 5000 },
        { categoria: 2, total_valor: 3000 },
      ];
      mockMovementAdapter.filterMovementGroupByCategory.mockResolvedValue(mockResult);

      const result = await filterYearGroupByCategory.execute({ year: 2024 });

      expect(mockMovementAdapter.filterMovementGroupByCategory).toHaveBeenCalledWith(2024);
      expect(result).toEqual(mockResult);
    });

    it("should return empty array when year is not provided", async () => {
      const result = await filterYearGroupByCategory.execute({ year: null });

      expect(mockMovementAdapter.filterMovementGroupByCategory).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it("should return empty array when year is undefined", async () => {
      const result = await filterYearGroupByCategory.execute({});

      expect(mockMovementAdapter.filterMovementGroupByCategory).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe("Sad Path", () => {
    it("should handle error when query fails", async () => {
      mockMovementAdapter.filterMovementGroupByCategory.mockRejectedValue(new Error("Query error"));

      await expect(filterYearGroupByCategory.execute({ year: 2024 })).rejects.toThrow("Query error");
    });

    it("should handle database error", async () => {
      mockMovementAdapter.filterMovementGroupByCategory.mockRejectedValue(new Error("Database error"));

      await expect(filterYearGroupByCategory.execute({ year: 2024 })).rejects.toThrow("Database error");
    });
  });
});
