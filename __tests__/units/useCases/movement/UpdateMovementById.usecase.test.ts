import { UpdateMovementById } from "../../../../src/useCases/movement/UpdateMovementById.usecase";
import type { IMovementAdapter, IMovement } from "../../../../src/domain/interfaces/Movement.interface";

describe("UpdateMovementById UseCase", () => {
  let updateMovementById: UpdateMovementById;
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
    updateMovementById = new UpdateMovementById(mockMovementAdapter);
  });

  describe("Happy Path", () => {
    it("should update a movement successfully", async () => {
      const updates: Partial<IMovement> = { valor: 6000, descricao: "Updated" };
      mockMovementAdapter.updateMovementById.mockResolvedValue(undefined);

      await updateMovementById.execute(1, updates);

      expect(mockMovementAdapter.updateMovementById).toHaveBeenCalledWith(1, updates);
    });

    it("should update only one field", async () => {
      const updates: Partial<IMovement> = { valor: 7000 };
      mockMovementAdapter.updateMovementById.mockResolvedValue(undefined);

      await updateMovementById.execute(2, updates);

      expect(mockMovementAdapter.updateMovementById).toHaveBeenCalledWith(2, updates);
    });
  });

  describe("Sad Path", () => {
    it("should handle error when update fails", async () => {
      mockMovementAdapter.updateMovementById.mockRejectedValue(new Error("Update failed"));

      await expect(updateMovementById.execute(1, { valor: 100 })).rejects.toThrow("Update failed");
    });

    it("should handle error when movement not found", async () => {
      mockMovementAdapter.updateMovementById.mockRejectedValue(new Error("Movement not found"));

      await expect(updateMovementById.execute(999, { valor: 100 })).rejects.toThrow("Movement not found");
    });
  });
});
