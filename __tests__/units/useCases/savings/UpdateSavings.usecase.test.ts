import { UpdateSavings } from "../../../../src/useCases/savings/UpdateSavings.usecase";
import type { ISavingsAdapter } from "../../../../src/domain/interfaces/Savings.interface";

describe("UpdateSavings UseCase", () => {
  let updateSavings: UpdateSavings;
  let mockSavingsAdapter: jest.Mocked<ISavingsAdapter>;

  beforeEach(() => {
    mockSavingsAdapter = {
      updateValue: jest.fn(),
      clearValue: jest.fn(),
      getValue: jest.fn(),
    };
    updateSavings = new UpdateSavings(mockSavingsAdapter);
  });

  describe("Happy Path", () => {
    it("should update savings value successfully", async () => {
      mockSavingsAdapter.updateValue.mockResolvedValue(undefined);

      await updateSavings.execute({ value: 1000 });

      expect(mockSavingsAdapter.updateValue).toHaveBeenCalledWith({ value: 1000 });
    });

    it("should update savings with zero value", async () => {
      mockSavingsAdapter.updateValue.mockResolvedValue(undefined);

      await updateSavings.execute({ value: 0 });

      expect(mockSavingsAdapter.updateValue).toHaveBeenCalledWith({ value: 0 });
    });

    it("should update savings with negative value", async () => {
      mockSavingsAdapter.updateValue.mockResolvedValue(undefined);

      await updateSavings.execute({ value: -500 });

      expect(mockSavingsAdapter.updateValue).toHaveBeenCalledWith({ value: -500 });
    });

    it("should update savings with decimal value", async () => {
      mockSavingsAdapter.updateValue.mockResolvedValue(undefined);

      await updateSavings.execute({ value: 1234.56 });

      expect(mockSavingsAdapter.updateValue).toHaveBeenCalledWith({ value: 1234.56 });
    });

    it("should update savings with large value", async () => {
      mockSavingsAdapter.updateValue.mockResolvedValue(undefined);

      await updateSavings.execute({ value: 999999999.99 });

      expect(mockSavingsAdapter.updateValue).toHaveBeenCalledWith({ value: 999999999.99 });
    });
  });

  describe("Sad Path", () => {
    it("should handle error when updating savings fails", async () => {
      mockSavingsAdapter.updateValue.mockRejectedValue(new Error("Database error"));

      await expect(updateSavings.execute({ value: 1000 })).rejects.toThrow("Database error");
    });

    it("should handle connection error", async () => {
      mockSavingsAdapter.updateValue.mockRejectedValue(new Error("Connection refused"));

      await expect(updateSavings.execute({ value: 500 })).rejects.toThrow("Connection refused");
    });

    it("should handle constraint violation error", async () => {
      mockSavingsAdapter.updateValue.mockRejectedValue(new Error("Constraint violation"));

      await expect(updateSavings.execute({ value: 100 })).rejects.toThrow("Constraint violation");
    });
  });
});
