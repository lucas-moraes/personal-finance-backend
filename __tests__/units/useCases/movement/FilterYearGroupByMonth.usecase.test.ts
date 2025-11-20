import { FilterYearGroupByMonth } from "../../../../src/useCases/movement/FilterYearGroupByMonth.usecase";
import type { IMovementAdapter } from "../../../../src/domain/interfaces/Movement.interface";

describe("FilterYearGroupByMonth UseCase", () => {
  let filterYearGroupByMonth: FilterYearGroupByMonth;
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
    filterYearGroupByMonth = new FilterYearGroupByMonth(mockMovementAdapter);
  });

  describe("Happy Path", () => {
    it("should filter movements by year grouped by month successfully", async () => {
      const mockResult = [
        { mes: 1, total_valor: 1000 },
        { mes: 2, total_valor: 2000 },
      ];
      mockMovementAdapter.filterMovementGroupByMonth.mockResolvedValue(mockResult);

      const result = await filterYearGroupByMonth.execute({ year: 2024 });

      expect(mockMovementAdapter.filterMovementGroupByMonth).toHaveBeenCalledWith(2024);
      expect(result).toEqual(mockResult);
    });

    it("should return empty array when year is not provided", async () => {
      const result = await filterYearGroupByMonth.execute({ year: null });

      expect(mockMovementAdapter.filterMovementGroupByMonth).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it("should return empty array when year is undefined", async () => {
      const result = await filterYearGroupByMonth.execute({});

      expect(mockMovementAdapter.filterMovementGroupByMonth).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe("Sad Path", () => {
    it("should handle error when query fails", async () => {
      mockMovementAdapter.filterMovementGroupByMonth.mockRejectedValue(new Error("Query error"));

      await expect(filterYearGroupByMonth.execute({ year: 2024 })).rejects.toThrow("Query error");
    });

    it("should handle database timeout", async () => {
      mockMovementAdapter.filterMovementGroupByMonth.mockRejectedValue(new Error("Timeout"));

      await expect(filterYearGroupByMonth.execute({ year: 2024 })).rejects.toThrow("Timeout");
    });
  });
});
