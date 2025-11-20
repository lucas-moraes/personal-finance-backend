import { FilterMovements } from "../../../../src/useCases/movement/FilterMovements.usecase";
import type { IMovementAdapter, IMovementSummary, IMovement } from "../../../../src/domain/interfaces/Movement.interface";

describe("FilterMovements UseCase", () => {
  let filterMovements: FilterMovements;
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
    filterMovements = new FilterMovements(mockMovementAdapter);
  });

  describe("Happy Path", () => {
    it("should filter movements by year successfully", async () => {
      const mockSummary: IMovementSummary = {
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
      mockMovementAdapter.findMovementsBy.mockResolvedValue(mockSummary);

      const result = await filterMovements.execute({ ano: 2024 });

      expect(mockMovementAdapter.findMovementsBy).toHaveBeenCalledWith({ ano: 2024 });
      expect(result).toEqual(mockSummary);
    });

    it("should filter movements by multiple criteria", async () => {
      const mockSummary: IMovementSummary = {
        movements: [],
        total: 0,
      };
      mockMovementAdapter.findMovementsBy.mockResolvedValue(mockSummary);

      const filters: Partial<IMovement> = { ano: 2024, mes: 6, categoria: 1 };
      await filterMovements.execute(filters);

      expect(mockMovementAdapter.findMovementsBy).toHaveBeenCalledWith(filters);
    });
  });

  describe("Sad Path", () => {
    it("should handle error when filtering fails", async () => {
      mockMovementAdapter.findMovementsBy.mockRejectedValue(new Error("Query error"));

      await expect(filterMovements.execute({ ano: 2024 })).rejects.toThrow("Query error");
    });

    it("should handle database connection error", async () => {
      mockMovementAdapter.findMovementsBy.mockRejectedValue(new Error("Connection lost"));

      await expect(filterMovements.execute({})).rejects.toThrow("Connection lost");
    });
  });
});
