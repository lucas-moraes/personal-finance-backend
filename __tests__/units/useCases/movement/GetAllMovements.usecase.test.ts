import { GetAllMovements } from "../../../../src/useCases/movement/GetAllMovements.usecase";
import type { IMovementAdapter, IMovementConsult } from "../../../../src/domain/interfaces/Movement.interface";

describe("GetAllMovements UseCase", () => {
  let getAllMovements: GetAllMovements;
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
    getAllMovements = new GetAllMovements(mockMovementAdapter);
  });

  describe("Happy Path", () => {
    it("should return all movements successfully", async () => {
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
      mockMovementAdapter.findAllMovements.mockResolvedValue(mockMovements);

      const result = await getAllMovements.execute();

      expect(mockMovementAdapter.findAllMovements).toHaveBeenCalled();
      expect(result).toEqual(mockMovements);
    });

    it("should return empty array when no movements exist", async () => {
      mockMovementAdapter.findAllMovements.mockResolvedValue([]);

      const result = await getAllMovements.execute();

      expect(result).toEqual([]);
    });
  });

  describe("Sad Path", () => {
    it("should handle error when fetching movements fails", async () => {
      mockMovementAdapter.findAllMovements.mockRejectedValue(new Error("Database error"));

      await expect(getAllMovements.execute()).rejects.toThrow("Database error");
    });

    it("should handle timeout error", async () => {
      mockMovementAdapter.findAllMovements.mockRejectedValue(new Error("Connection timeout"));

      await expect(getAllMovements.execute()).rejects.toThrow("Connection timeout");
    });
  });
});
