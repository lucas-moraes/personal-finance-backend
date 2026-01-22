import { FilterMovements } from "../../../../src/useCases/movement/FilterMovements.usecase";
import type { IMovementAdapter, IMovementSummary, IMovement } from "../../../../src/domain/interfaces/Movement.interface";
import type { ISavingsAdapter } from "../../../../src/domain/interfaces/Savings.interface";

describe("FilterMovements UseCase", () => {
  let filterMovements: FilterMovements;
  let mockMovementAdapter: jest.Mocked<IMovementAdapter>;
  let mockSavingsAdapter: jest.Mocked<ISavingsAdapter>;

  beforeEach(() => {
    mockMovementAdapter = {
      findAllMovements: jest.fn(),
      findMovementsBy: jest.fn(),
      findMovementById: jest.fn(),
      createMovement: jest.fn(),
      deleteMovementById: jest.fn(),
      updateMovementById: jest.fn(),
      filterMovementGroupByCategory: jest.fn(),
      filterMovementGroupByMonth: jest.fn(),
      monthsWithMovements: jest.fn(),
      yearsWithMovements: jest.fn(),
    } as jest.Mocked<IMovementAdapter>;

    mockSavingsAdapter = {
      getValue: jest.fn(),
      updateValue: jest.fn(),
      clearValue: jest.fn(),
    } as jest.Mocked<ISavingsAdapter>;

    filterMovements = new FilterMovements(mockMovementAdapter, mockSavingsAdapter);
  });

  describe("Happy Path", () => {
    it("should filter movements by year successfully", async () => {
      const mockMovementResult: Omit<IMovementSummary, "savings"> = {
        movements: [
          {
            id: 1,
            dia: 15,
            mes: 6,
            ano: 2024,
            tipo: "entrada",
            descricao: "Salário",
            valor: 5000,
            categoriaDescricao: "Trabalho",
          },
        ],
        total: 5000,
      };
      const mockSavingsValue = { value: 1000 };

      mockMovementAdapter.findMovementsBy.mockResolvedValue(mockMovementResult as IMovementSummary);
      mockSavingsAdapter.getValue.mockResolvedValue(mockSavingsValue);

      const result = await filterMovements.execute({ ano: 2024 });

      expect(mockMovementAdapter.findMovementsBy).toHaveBeenCalledWith({ ano: 2024 });
      expect(mockSavingsAdapter.getValue).toHaveBeenCalled();
      expect(result).toEqual({
        ...mockMovementResult,
        savings: 1000,
      });
    });

    it("should filter movements by multiple criteria", async () => {
      const mockMovementResult: Omit<IMovementSummary, "savings"> = {
        movements: [],
        total: 0,
      };
      const mockSavingsValue = { value: 500 };

      mockMovementAdapter.findMovementsBy.mockResolvedValue(mockMovementResult as IMovementSummary);
      mockSavingsAdapter.getValue.mockResolvedValue(mockSavingsValue);

      const filters: Partial<IMovement> = { ano: 2024, mes: 6, categoria: 1 };
      const result = await filterMovements.execute(filters);

      expect(mockMovementAdapter.findMovementsBy).toHaveBeenCalledWith(filters);
      expect(result).toEqual({
        ...mockMovementResult,
        savings: 500,
      });
    });

    it("should return savings value of 0 when no savings exist", async () => {
      const mockMovementResult: Omit<IMovementSummary, "savings"> = {
        movements: [],
        total: 0,
      };
      const mockSavingsValue = { value: 0 };

      mockMovementAdapter.findMovementsBy.mockResolvedValue(mockMovementResult as IMovementSummary);
      mockSavingsAdapter.getValue.mockResolvedValue(mockSavingsValue);

      const result = await filterMovements.execute({ ano: 2024 });

      expect(result.savings).toBe(0);
    });
  });

  describe("Sad Path", () => {
    it("should handle error when filtering fails", async () => {
      mockSavingsAdapter.getValue.mockResolvedValue({ value: 0 });
      mockMovementAdapter.findMovementsBy.mockRejectedValue(new Error("Query error"));

      await expect(filterMovements.execute({ ano: 2024 })).rejects.toThrow("Query error");
    });

    it("should handle database connection error", async () => {
      mockSavingsAdapter.getValue.mockResolvedValue({ value: 0 });
      mockMovementAdapter.findMovementsBy.mockRejectedValue(new Error("Connection lost"));

      await expect(filterMovements.execute({})).rejects.toThrow("Connection lost");
    });

    it("should handle error when getting savings fails", async () => {
      mockSavingsAdapter.getValue.mockRejectedValue(new Error("Savings fetch error"));

      await expect(filterMovements.execute({ ano: 2024 })).rejects.toThrow("Savings fetch error");
    });
  });
});
