import { GetAllMovements } from "../../../src/useCases/movement/GetAllMovements.usecase";
import { FilterMovements } from "../../../src/useCases/movement/FilterMovements.usecase";
import { CreateMovement } from "../../../src/useCases/movement/CreateMovement.usecase";
import { DeleteMovementById } from "../../../src/useCases/movement/DeleteMovementById.usecase";
import { UpdateMovementById } from "../../../src/useCases/movement/UpdateMovementById.usecase";
import { GetMonthsWithMovements } from "../../../src/useCases/movement/GetMonthsWithMovements.usecase";
import { GetYearsWithMovements } from "../../../src/useCases/movement/GetYearsWithMovements.usecase";
import { FilterMovementById } from "../../../src/useCases/movement/FilterMovementById.usecase";
import { FilterYearGroupByMonth } from "../../../src/useCases/movement/FilterYearGroupByMonth.usecase";
import { FilterYearGroupByCategory } from "../../../src/useCases/movement/FilterYearGroupByCategory.usecase";
import type { IMovementAdapter, IMovementConsult } from "../../../src/domain/interfaces/Movement.interface";
import type { ISavingsAdapter } from "../../../src/domain/interfaces/Savings.interface";

jest.mock("../../../src/infrastructure/adapters/Movement.adapter", () => ({
  MovementAdapter: jest.fn().mockImplementation(() => ({
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
  })),
}));

jest.mock("../../../src/infrastructure/adapters/Savings.adapter", () => ({
  SavingsAdapter: jest.fn().mockImplementation(() => ({
    getValue: jest.fn(),
    clearValue: jest.fn(),
    updateValue: jest.fn(),
  })),
}));

const createMockMovementAdapter = (): jest.Mocked<IMovementAdapter> => ({
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
});

const createMockSavingsAdapter = (): jest.Mocked<ISavingsAdapter> => ({
  getValue: jest.fn(),
  clearValue: jest.fn(),
  updateValue: jest.fn(),
});

describe("Movement Use Cases - Controller Integration", () => {
  describe("GetAllMovements Use Case", () => {
    describe("Happy Path", () => {
      it("should return all movements successfully", async () => {
        const mockAdapter = createMockMovementAdapter();
        const mockMovements: IMovementConsult[] = [
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
        ];
        mockAdapter.findAllMovements.mockResolvedValue(mockMovements);

        const useCase = new GetAllMovements(mockAdapter);
        const result = await useCase.execute();

        expect(mockAdapter.findAllMovements).toHaveBeenCalled();
        expect(result).toEqual(mockMovements);
      });

      it("should return empty array when no movements exist", async () => {
        const mockAdapter = createMockMovementAdapter();
        mockAdapter.findAllMovements.mockResolvedValue([]);

        const useCase = new GetAllMovements(mockAdapter);
        const result = await useCase.execute();

        expect(result).toEqual([]);
      });
    });

    describe("Sad Path", () => {
      it("should propagate error from adapter", async () => {
        const mockAdapter = createMockMovementAdapter();
        mockAdapter.findAllMovements.mockRejectedValue(new Error("Database error"));

        const useCase = new GetAllMovements(mockAdapter);

        await expect(useCase.execute()).rejects.toThrow("Database error");
      });
    });
  });

  describe("FilterMovements Use Case", () => {
    describe("Happy Path", () => {
      it("should filter movements successfully", async () => {
        const mockMovementAdapter = createMockMovementAdapter();
        const mockSavingsAdapter = createMockSavingsAdapter();

        mockMovementAdapter.findMovementsBy.mockResolvedValue({
          movements: [],
          savings: 0,
          total: 0,
        });
        mockSavingsAdapter.getValue.mockResolvedValue({ value: 1000 });

        const useCase = new FilterMovements(mockMovementAdapter, mockSavingsAdapter);
        const result = await useCase.execute({ ano: 2024 });

        expect(mockMovementAdapter.findMovementsBy).toHaveBeenCalledWith({ ano: 2024 });
        expect(result.savings).toBe(1000);
      });
    });

    describe("Sad Path", () => {
      it("should propagate error from movement adapter", async () => {
        const mockMovementAdapter = createMockMovementAdapter();
        const mockSavingsAdapter = createMockSavingsAdapter();

        mockSavingsAdapter.getValue.mockResolvedValue({ value: 1000 });
        mockMovementAdapter.findMovementsBy.mockRejectedValue(new Error("Filter error"));

        const useCase = new FilterMovements(mockMovementAdapter, mockSavingsAdapter);

        await expect(useCase.execute({ ano: 2024 })).rejects.toThrow("Filter error");
      });
    });
  });

  describe("CreateMovement Use Case", () => {
    describe("Happy Path", () => {
      it("should create movement successfully", async () => {
        const mockAdapter = createMockMovementAdapter();
        const newMovement = {
          id: 1,
          dia: 15,
          mes: 6,
          ano: 2024,
          tipo: "entrada",
          categoria: 1,
          descricao: "Salário",
          valor: 5000,
        };
        mockAdapter.createMovement.mockResolvedValue(newMovement);

        const useCase = new CreateMovement(mockAdapter);
        const result = await useCase.execute(newMovement);

        expect(mockAdapter.createMovement).toHaveBeenCalledWith(newMovement);
        expect(result).toEqual(newMovement);
      });
    });

    describe("Sad Path", () => {
      it("should propagate error from adapter", async () => {
        const mockAdapter = createMockMovementAdapter();
        mockAdapter.createMovement.mockRejectedValue(new Error("Insert failed"));

        const useCase = new CreateMovement(mockAdapter);

        await expect(
          useCase.execute({
            id: 1,
            dia: 15,
            mes: 6,
            ano: 2024,
            tipo: "entrada",
            categoria: 1,
            descricao: "Test",
            valor: 1000,
          })
        ).rejects.toThrow("Insert failed");
      });
    });
  });

  describe("DeleteMovementById Use Case", () => {
    describe("Happy Path", () => {
      it("should delete movement successfully", async () => {
        const mockAdapter = createMockMovementAdapter();
        mockAdapter.deleteMovementById.mockResolvedValue(undefined);

        const useCase = new DeleteMovementById(mockAdapter);
        await useCase.execute(1);

        expect(mockAdapter.deleteMovementById).toHaveBeenCalledWith(1);
      });
    });

    describe("Sad Path", () => {
      it("should propagate error from adapter", async () => {
        const mockAdapter = createMockMovementAdapter();
        mockAdapter.deleteMovementById.mockRejectedValue(new Error("Delete failed"));

        const useCase = new DeleteMovementById(mockAdapter);

        await expect(useCase.execute(1)).rejects.toThrow("Delete failed");
      });
    });
  });

  describe("UpdateMovementById Use Case", () => {
    describe("Happy Path", () => {
      it("should update movement successfully", async () => {
        const mockAdapter = createMockMovementAdapter();
        mockAdapter.updateMovementById.mockResolvedValue(undefined);

        const useCase = new UpdateMovementById(mockAdapter);
        await useCase.execute(1, { valor: 2000 });

        expect(mockAdapter.updateMovementById).toHaveBeenCalledWith(1, { valor: 2000 });
      });
    });

    describe("Sad Path", () => {
      it("should propagate error from adapter", async () => {
        const mockAdapter = createMockMovementAdapter();
        mockAdapter.updateMovementById.mockRejectedValue(new Error("Update failed"));

        const useCase = new UpdateMovementById(mockAdapter);

        await expect(useCase.execute(1, { valor: 2000 })).rejects.toThrow("Update failed");
      });
    });
  });

  describe("GetMonthsWithMovements Use Case", () => {
    describe("Happy Path", () => {
      it("should return months with movements", async () => {
        const mockAdapter = createMockMovementAdapter();
        const mockMonths = [
          { id: 1, mes: "Janeiro" },
          { id: 6, mes: "Junho" },
        ];
        mockAdapter.monthsWithMovements.mockResolvedValue(mockMonths);

        const useCase = new GetMonthsWithMovements(mockAdapter);
        const result = await useCase.execute();

        expect(mockAdapter.monthsWithMovements).toHaveBeenCalled();
        expect(result).toEqual(mockMonths);
      });
    });

    describe("Sad Path", () => {
      it("should propagate error from adapter", async () => {
        const mockAdapter = createMockMovementAdapter();
        mockAdapter.monthsWithMovements.mockRejectedValue(new Error("Query failed"));

        const useCase = new GetMonthsWithMovements(mockAdapter);

        await expect(useCase.execute()).rejects.toThrow("Query failed");
      });
    });
  });

  describe("GetYearsWithMovements Use Case", () => {
    describe("Happy Path", () => {
      it("should return years with movements", async () => {
        const mockAdapter = createMockMovementAdapter();
        const mockYears = [
          { id: 2023, ano: 2023 },
          { id: 2024, ano: 2024 },
        ];
        mockAdapter.yearsWithMovements.mockResolvedValue(mockYears);

        const useCase = new GetYearsWithMovements(mockAdapter);
        const result = await useCase.execute();

        expect(mockAdapter.yearsWithMovements).toHaveBeenCalled();
        expect(result).toEqual(mockYears);
      });
    });

    describe("Sad Path", () => {
      it("should propagate error from adapter", async () => {
        const mockAdapter = createMockMovementAdapter();
        mockAdapter.yearsWithMovements.mockRejectedValue(new Error("Query failed"));

        const useCase = new GetYearsWithMovements(mockAdapter);

        await expect(useCase.execute()).rejects.toThrow("Query failed");
      });
    });
  });

  describe("FilterMovementById Use Case", () => {
    describe("Happy Path", () => {
      it("should return movement by id", async () => {
        const mockAdapter = createMockMovementAdapter();
        const mockMovement = [
          {
            id: 1,
            dia: 15,
            mes: 6,
            ano: 2024,
            tipo: "entrada",
            categoria: 1,
            descricao: "Salário",
            valor: 5000,
          },
        ];
        mockAdapter.findMovementById.mockResolvedValue(mockMovement);

        const useCase = new FilterMovementById(mockAdapter);
        const result = await useCase.execute({ id: "1" });

        expect(mockAdapter.findMovementById).toHaveBeenCalledWith({ id: "1" });
        expect(result).toEqual(mockMovement);
      });

      it("should return null when movement not found", async () => {
        const mockAdapter = createMockMovementAdapter();
        mockAdapter.findMovementById.mockResolvedValue(null);

        const useCase = new FilterMovementById(mockAdapter);
        const result = await useCase.execute({ id: "999" });

        expect(result).toBeNull();
      });
    });

    describe("Sad Path", () => {
      it("should propagate error from adapter", async () => {
        const mockAdapter = createMockMovementAdapter();
        mockAdapter.findMovementById.mockRejectedValue(new Error("Query failed"));

        const useCase = new FilterMovementById(mockAdapter);

        await expect(useCase.execute({ id: "1" })).rejects.toThrow("Query failed");
      });
    });
  });

  describe("FilterYearGroupByMonth Use Case", () => {
    describe("Happy Path", () => {
      it("should return movements grouped by month", async () => {
        const mockAdapter = createMockMovementAdapter();
        const mockResult = [
          { mes: 1, total_valor: 1000 },
          { mes: 6, total_valor: 2500 },
        ];
        mockAdapter.filterMovementGroupByMonth.mockResolvedValue(mockResult);

        const useCase = new FilterYearGroupByMonth(mockAdapter);
        const result = await useCase.execute({ year: 2024 });

        expect(mockAdapter.filterMovementGroupByMonth).toHaveBeenCalledWith(2024);
        expect(result).toEqual(mockResult);
      });

      it("should return empty array when year is null", async () => {
        const mockAdapter = createMockMovementAdapter();

        const useCase = new FilterYearGroupByMonth(mockAdapter);
        const result = await useCase.execute({ year: null });

        expect(mockAdapter.filterMovementGroupByMonth).not.toHaveBeenCalled();
        expect(result).toEqual([]);
      });
    });

    describe("Sad Path", () => {
      it("should propagate error from adapter", async () => {
        const mockAdapter = createMockMovementAdapter();
        mockAdapter.filterMovementGroupByMonth.mockRejectedValue(new Error("Query failed"));

        const useCase = new FilterYearGroupByMonth(mockAdapter);

        await expect(useCase.execute({ year: 2024 })).rejects.toThrow("Query failed");
      });
    });
  });

  describe("FilterYearGroupByCategory Use Case", () => {
    describe("Happy Path", () => {
      it("should return movements grouped by category", async () => {
        const mockAdapter = createMockMovementAdapter();
        const mockResult = [
          { categoria: 1, total_valor: 1000 },
          { categoria: 2, total_valor: 2500 },
        ];
        mockAdapter.filterMovementGroupByCategory.mockResolvedValue(mockResult);

        const useCase = new FilterYearGroupByCategory(mockAdapter);
        const result = await useCase.execute({ year: 2024 });

        expect(mockAdapter.filterMovementGroupByCategory).toHaveBeenCalledWith(2024);
        expect(result).toEqual(mockResult);
      });

      it("should return empty array when year is null", async () => {
        const mockAdapter = createMockMovementAdapter();

        const useCase = new FilterYearGroupByCategory(mockAdapter);
        const result = await useCase.execute({ year: null });

        expect(mockAdapter.filterMovementGroupByCategory).not.toHaveBeenCalled();
        expect(result).toEqual([]);
      });
    });

    describe("Sad Path", () => {
      it("should propagate error from adapter", async () => {
        const mockAdapter = createMockMovementAdapter();
        mockAdapter.filterMovementGroupByCategory.mockRejectedValue(new Error("Query failed"));

        const useCase = new FilterYearGroupByCategory(mockAdapter);

        await expect(useCase.execute({ year: 2024 })).rejects.toThrow("Query failed");
      });
    });
  });
});
