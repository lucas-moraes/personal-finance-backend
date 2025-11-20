import { FilterMovementById } from "../../../../src/useCases/movement/FilterMovementById.usecase";
import type { IMovementAdapter, IMovement } from "../../../../src/domain/interfaces/Movement.interface";

describe("FilterMovementById UseCase", () => {
  let filterMovementById: FilterMovementById;
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
    filterMovementById = new FilterMovementById(mockMovementAdapter);
  });

  describe("Happy Path", () => {
    it("should find a movement by id successfully", async () => {
      const mockMovement: IMovement = {
        id: 1,
        dia: 15,
        mes: 6,
        ano: 2024,
        tipo: "entrada",
        categoria: 1,
        descricao: "Salário",
        valor: 5000,
      };
      mockMovementAdapter.findMovementById.mockResolvedValue([mockMovement]);

      const result = await filterMovementById.execute({ id: "1" });

      expect(mockMovementAdapter.findMovementById).toHaveBeenCalledWith({ id: "1" });
      expect(result).toEqual([mockMovement]);
    });

    it("should return null when movement not found", async () => {
      mockMovementAdapter.findMovementById.mockResolvedValue(null);

      const result = await filterMovementById.execute({ id: "999" });

      expect(result).toBeNull();
    });
  });

  describe("Sad Path", () => {
    it("should handle error when query fails", async () => {
      mockMovementAdapter.findMovementById.mockRejectedValue(new Error("Query error"));

      await expect(filterMovementById.execute({ id: "1" })).rejects.toThrow("Query error");
    });

    it("should handle database connection error", async () => {
      mockMovementAdapter.findMovementById.mockRejectedValue(new Error("Connection lost"));

      await expect(filterMovementById.execute({ id: "1" })).rejects.toThrow("Connection lost");
    });
  });
});
