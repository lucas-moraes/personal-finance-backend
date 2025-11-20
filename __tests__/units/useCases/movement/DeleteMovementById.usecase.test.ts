import { DeleteMovementById } from "../../../../src/useCases/movement/DeleteMovementById.usecase";
import type { IMovementAdapter } from "../../../../src/domain/interfaces/Movement.interface";

describe("DeleteMovementById UseCase", () => {
  let deleteMovementById: DeleteMovementById;
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
    deleteMovementById = new DeleteMovementById(mockMovementAdapter);
  });

  describe("Happy Path", () => {
    it("should delete a movement successfully", async () => {
      mockMovementAdapter.deleteMovementById.mockResolvedValue(undefined);

      await deleteMovementById.execute(1);

      expect(mockMovementAdapter.deleteMovementById).toHaveBeenCalledWith(1);
    });

    it("should delete movement with large id", async () => {
      mockMovementAdapter.deleteMovementById.mockResolvedValue(undefined);

      await deleteMovementById.execute(999999);

      expect(mockMovementAdapter.deleteMovementById).toHaveBeenCalledWith(999999);
    });
  });

  describe("Sad Path", () => {
    it("should handle error when deletion fails", async () => {
      mockMovementAdapter.deleteMovementById.mockRejectedValue(new Error("Delete failed"));

      await expect(deleteMovementById.execute(1)).rejects.toThrow("Delete failed");
    });

    it("should handle error when movement does not exist", async () => {
      mockMovementAdapter.deleteMovementById.mockRejectedValue(new Error("Movement not found"));

      await expect(deleteMovementById.execute(999)).rejects.toThrow("Movement not found");
    });
  });
});
