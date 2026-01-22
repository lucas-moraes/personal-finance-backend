import { GetSavings } from "../../../src/useCases/savings/GetSavings.usecase";
import { ClearSavings } from "../../../src/useCases/savings/ClearSavings.usecase";
import { UpdateSavings } from "../../../src/useCases/savings/UpdateSavings.usecase";

jest.mock("../../../src/infrastructure/adapters/Savings.adapter", () => ({
  SavingsAdapter: jest.fn().mockImplementation(() => ({
    getValue: jest.fn(),
    clearValue: jest.fn(),
    updateValue: jest.fn(),
  })),
}));

describe("Savings Use Cases - Controller Integration", () => {
  describe("GetSavings Use Case - Happy Path", () => {
    it("should execute and return savings value", async () => {
      const mockAdapter = {
        getValue: jest.fn().mockResolvedValue({ value: 1500.5 }),
        clearValue: jest.fn(),
        updateValue: jest.fn(),
      };
      const useCase = new GetSavings(mockAdapter);

      const result = await useCase.execute();

      expect(result).toEqual({ value: 1500.5 });
      expect(mockAdapter.getValue).toHaveBeenCalled();
    });

    it("should return zero savings value", async () => {
      const mockAdapter = {
        getValue: jest.fn().mockResolvedValue({ value: 0 }),
        clearValue: jest.fn(),
        updateValue: jest.fn(),
      };
      const useCase = new GetSavings(mockAdapter);

      const result = await useCase.execute();

      expect(result.value).toBe(0);
    });
  });

  describe("GetSavings Use Case - Sad Path", () => {
    it("should propagate error from adapter", async () => {
      const mockAdapter = {
        getValue: jest.fn().mockRejectedValue(new Error("Database error")),
        clearValue: jest.fn(),
        updateValue: jest.fn(),
      };
      const useCase = new GetSavings(mockAdapter);

      await expect(useCase.execute()).rejects.toThrow("Database error");
    });
  });

  describe("ClearSavings Use Case - Happy Path", () => {
    it("should execute and clear savings", async () => {
      const mockAdapter = {
        getValue: jest.fn(),
        clearValue: jest.fn().mockResolvedValue(undefined),
        updateValue: jest.fn(),
      };
      const useCase = new ClearSavings(mockAdapter);

      await useCase.execute();

      expect(mockAdapter.clearValue).toHaveBeenCalled();
    });
  });

  describe("ClearSavings Use Case - Sad Path", () => {
    it("should propagate error from adapter", async () => {
      const mockAdapter = {
        getValue: jest.fn(),
        clearValue: jest.fn().mockRejectedValue(new Error("Clear failed")),
        updateValue: jest.fn(),
      };
      const useCase = new ClearSavings(mockAdapter);

      await expect(useCase.execute()).rejects.toThrow("Clear failed");
    });
  });

  describe("UpdateSavings Use Case - Happy Path", () => {
    it("should execute and update savings value", async () => {
      const mockAdapter = {
        getValue: jest.fn(),
        clearValue: jest.fn(),
        updateValue: jest.fn().mockResolvedValue(undefined),
      };
      const useCase = new UpdateSavings(mockAdapter);

      await useCase.execute({ value: 2000 });

      expect(mockAdapter.updateValue).toHaveBeenCalledWith({ value: 2000 });
    });

    it("should update with decimal value", async () => {
      const mockAdapter = {
        getValue: jest.fn(),
        clearValue: jest.fn(),
        updateValue: jest.fn().mockResolvedValue(undefined),
      };
      const useCase = new UpdateSavings(mockAdapter);

      await useCase.execute({ value: 1234.56 });

      expect(mockAdapter.updateValue).toHaveBeenCalledWith({ value: 1234.56 });
    });
  });

  describe("UpdateSavings Use Case - Sad Path", () => {
    it("should propagate error from adapter", async () => {
      const mockAdapter = {
        getValue: jest.fn(),
        clearValue: jest.fn(),
        updateValue: jest.fn().mockRejectedValue(new Error("Update failed")),
      };
      const useCase = new UpdateSavings(mockAdapter);

      await expect(useCase.execute({ value: 1000 })).rejects.toThrow("Update failed");
    });

    it("should handle database constraint violations", async () => {
      const mockAdapter = {
        getValue: jest.fn(),
        clearValue: jest.fn(),
        updateValue: jest.fn().mockRejectedValue(new Error("Constraint violation")),
      };
      const useCase = new UpdateSavings(mockAdapter);

      await expect(useCase.execute({ value: 100 })).rejects.toThrow("Constraint violation");
    });
  });
});
