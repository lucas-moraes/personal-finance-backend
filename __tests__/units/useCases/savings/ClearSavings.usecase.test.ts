import { ClearSavings } from "../../../../src/useCases/savings/ClearSavings.usecase";
import type { ISavingsAdapter } from "../../../../src/domain/interfaces/Savings.interface";

describe("ClearSavings UseCase", () => {
  let clearSavings: ClearSavings;
  let mockSavingsAdapter: jest.Mocked<ISavingsAdapter>;

  beforeEach(() => {
    mockSavingsAdapter = {
      updateValue: jest.fn(),
      clearValue: jest.fn(),
      getValue: jest.fn(),
    };
    clearSavings = new ClearSavings(mockSavingsAdapter);
  });

  describe("Happy Path", () => {
    it("should clear savings value successfully", async () => {
      mockSavingsAdapter.clearValue.mockResolvedValue(undefined);

      await clearSavings.execute();

      expect(mockSavingsAdapter.clearValue).toHaveBeenCalledTimes(1);
    });

    it("should call clearValue without any arguments", async () => {
      mockSavingsAdapter.clearValue.mockResolvedValue(undefined);

      await clearSavings.execute();

      expect(mockSavingsAdapter.clearValue).toHaveBeenCalledWith();
    });
  });

  describe("Sad Path", () => {
    it("should handle error when clearing savings fails", async () => {
      mockSavingsAdapter.clearValue.mockRejectedValue(new Error("Database error"));

      await expect(clearSavings.execute()).rejects.toThrow("Database error");
    });

    it("should handle connection error", async () => {
      mockSavingsAdapter.clearValue.mockRejectedValue(new Error("Connection refused"));

      await expect(clearSavings.execute()).rejects.toThrow("Connection refused");
    });
  });
});
