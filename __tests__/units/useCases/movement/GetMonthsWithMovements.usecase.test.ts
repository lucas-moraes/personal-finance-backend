import { GetMonthsWithMovements } from "../../../../src/useCases/movement/GetMonthsWithMovements.usecase";
import type { IMovementAdapter, IMovementMonths } from "../../../../src/domain/interfaces/Movement.interface";

describe("GetMonthsWithMovements UseCase", () => {
  let getMonthsWithMovements: GetMonthsWithMovements;
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
    getMonthsWithMovements = new GetMonthsWithMovements(mockMovementAdapter);
  });

  describe("Happy Path", () => {
    it("should return all months with movements successfully", async () => {
      const mockMonths: IMovementMonths[] = [
        { id: 1, mes: "Janeiro" },
        { id: 2, mes: "Fevereiro" },
        { id: 6, mes: "Junho" },
      ];
      mockMovementAdapter.monthsWithMovements.mockResolvedValue(mockMonths);

      const result = await getMonthsWithMovements.execute();

      expect(mockMovementAdapter.monthsWithMovements).toHaveBeenCalled();
      expect(result).toEqual(mockMonths);
    });

    it("should return empty array when no months have movements", async () => {
      mockMovementAdapter.monthsWithMovements.mockResolvedValue([]);

      const result = await getMonthsWithMovements.execute();

      expect(result).toEqual([]);
    });
  });

  describe("Sad Path", () => {
    it("should handle error when fetching months fails", async () => {
      mockMovementAdapter.monthsWithMovements.mockRejectedValue(new Error("Database error"));

      await expect(getMonthsWithMovements.execute()).rejects.toThrow("Database error");
    });

    it("should handle query timeout", async () => {
      mockMovementAdapter.monthsWithMovements.mockRejectedValue(new Error("Query timeout"));

      await expect(getMonthsWithMovements.execute()).rejects.toThrow("Query timeout");
    });
  });
});
