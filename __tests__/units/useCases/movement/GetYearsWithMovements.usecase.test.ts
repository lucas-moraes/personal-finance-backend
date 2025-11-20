import { GetYearsWithMovements } from "../../../../src/useCases/movement/GetYearsWithMovements.usecase";
import type { IMovementAdapter, IMovementYears } from "../../../../src/domain/interfaces/Movement.interface";

describe("GetYearsWithMovements UseCase", () => {
  let getYearsWithMovements: GetYearsWithMovements;
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
    getYearsWithMovements = new GetYearsWithMovements(mockMovementAdapter);
  });

  describe("Happy Path", () => {
    it("should return all years with movements successfully", async () => {
      const mockYears: IMovementYears[] = [
        { id: 2022, ano: 2022 },
        { id: 2023, ano: 2023 },
        { id: 2024, ano: 2024 },
      ];
      mockMovementAdapter.yearsWithMovements.mockResolvedValue(mockYears);

      const result = await getYearsWithMovements.execute();

      expect(mockMovementAdapter.yearsWithMovements).toHaveBeenCalled();
      expect(result).toEqual(mockYears);
    });

    it("should return empty array when no years have movements", async () => {
      mockMovementAdapter.yearsWithMovements.mockResolvedValue([]);

      const result = await getYearsWithMovements.execute();

      expect(result).toEqual([]);
    });
  });

  describe("Sad Path", () => {
    it("should handle error when fetching years fails", async () => {
      mockMovementAdapter.yearsWithMovements.mockRejectedValue(new Error("Database error"));

      await expect(getYearsWithMovements.execute()).rejects.toThrow("Database error");
    });

    it("should handle connection timeout", async () => {
      mockMovementAdapter.yearsWithMovements.mockRejectedValue(new Error("Connection timeout"));

      await expect(getYearsWithMovements.execute()).rejects.toThrow("Connection timeout");
    });
  });
});
