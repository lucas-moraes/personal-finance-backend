import { GetSavings } from "../../../../src/useCases/savings/GetSavings.usecase";
import type { ISavingsAdapter, ISavingsGetAmount } from "../../../../src/domain/interfaces/Savings.interface";

describe("GetSavings UseCase", () => {
  let getSavings: GetSavings;
  let mockSavingsAdapter: jest.Mocked<ISavingsAdapter>;

  beforeEach(() => {
    mockSavingsAdapter = {
      updateValue: jest.fn(),
      clearValue: jest.fn(),
      getValue: jest.fn(),
    };
    getSavings = new GetSavings(mockSavingsAdapter);
  });

  describe("Happy Path", () => {
    it("should return savings value successfully", async () => {
      const mockSavingsValue: ISavingsGetAmount = { value: 1500.5 };
      mockSavingsAdapter.getValue.mockResolvedValue(mockSavingsValue);

      const result = await getSavings.execute();

      expect(mockSavingsAdapter.getValue).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockSavingsValue);
    });

    it("should return zero savings value", async () => {
      const mockSavingsValue: ISavingsGetAmount = { value: 0 };
      mockSavingsAdapter.getValue.mockResolvedValue(mockSavingsValue);

      const result = await getSavings.execute();

      expect(result.value).toBe(0);
    });

    it("should return negative savings value", async () => {
      const mockSavingsValue: ISavingsGetAmount = { value: -500 };
      mockSavingsAdapter.getValue.mockResolvedValue(mockSavingsValue);

      const result = await getSavings.execute();

      expect(result.value).toBe(-500);
    });

    it("should return large savings value", async () => {
      const mockSavingsValue: ISavingsGetAmount = { value: 999999999.99 };
      mockSavingsAdapter.getValue.mockResolvedValue(mockSavingsValue);

      const result = await getSavings.execute();

      expect(result.value).toBe(999999999.99);
    });
  });

  describe("Sad Path", () => {
    it("should handle error when getting savings fails", async () => {
      mockSavingsAdapter.getValue.mockRejectedValue(new Error("Database error"));

      await expect(getSavings.execute()).rejects.toThrow("Database error");
    });

    it("should handle connection timeout error", async () => {
      mockSavingsAdapter.getValue.mockRejectedValue(new Error("Connection timeout"));

      await expect(getSavings.execute()).rejects.toThrow("Connection timeout");
    });

    it("should handle unexpected error", async () => {
      mockSavingsAdapter.getValue.mockRejectedValue(new Error("Unexpected error"));

      await expect(getSavings.execute()).rejects.toThrow("Unexpected error");
    });
  });
});
