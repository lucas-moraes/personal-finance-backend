import { CreateMovement } from "../../../../src/useCases/movement/CreateMovement.usecase";
import type { IMovementAdapter, IMovement } from "../../../../src/domain/interfaces/Movement.interface";

describe("CreateMovement UseCase", () => {
  let createMovement: CreateMovement;
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
    createMovement = new CreateMovement(mockMovementAdapter);
  });

  describe("Happy Path", () => {
    it("should create a movement successfully", async () => {
      const newMovement: IMovement = {
        id: 1,
        dia: 15,
        mes: 6,
        ano: 2024,
        tipo: "entrada",
        categoria: 1,
        descricao: "Salário",
        valor: 5000,
      };
      mockMovementAdapter.createMovement.mockResolvedValue(newMovement);

      const result = await createMovement.execute(newMovement);

      expect(mockMovementAdapter.createMovement).toHaveBeenCalledWith(newMovement);
      expect(result).toEqual(newMovement);
    });

    it("should create movement with null description", async () => {
      const newMovement: IMovement = {
        id: 2,
        dia: 20,
        mes: 7,
        ano: 2024,
        tipo: "saida",
        categoria: 2,
        descricao: null,
        valor: 100,
      };
      mockMovementAdapter.createMovement.mockResolvedValue(newMovement);

      const result = await createMovement.execute(newMovement);

      expect(result.descricao).toBeNull();
    });
  });

  describe("Sad Path", () => {
    it("should handle error when movement creation fails", async () => {
      const newMovement: IMovement = {
        id: 1,
        dia: 15,
        mes: 6,
        ano: 2024,
        tipo: "entrada",
        categoria: 1,
        descricao: "Test",
        valor: 5000,
      };
      mockMovementAdapter.createMovement.mockRejectedValue(new Error("Insert failed"));

      await expect(createMovement.execute(newMovement)).rejects.toThrow("Insert failed");
    });

    it("should handle constraint violation error", async () => {
      const newMovement: IMovement = {
        id: 1,
        dia: 15,
        mes: 6,
        ano: 2024,
        tipo: "entrada",
        categoria: 999,
        descricao: "Test",
        valor: 5000,
      };
      mockMovementAdapter.createMovement.mockRejectedValue(new Error("Foreign key constraint"));

      await expect(createMovement.execute(newMovement)).rejects.toThrow("Foreign key constraint");
    });
  });
});
