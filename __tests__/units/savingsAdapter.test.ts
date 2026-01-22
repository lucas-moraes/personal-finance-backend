import { SavingsAdapter } from "../../src/infrastructure/adapters/Savings.adapter";

jest.mock("../../src/infrastructure/database/DataSource", () => ({
  db: {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    onConflictDoUpdate: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
  },
}));

describe("SavingsAdapter", () => {
  let savingsAdapter: SavingsAdapter;
  let mockDb: {
    select: jest.Mock;
    from: jest.Mock;
    insert: jest.Mock;
    values: jest.Mock;
    onConflictDoUpdate: jest.Mock;
    update: jest.Mock;
    set: jest.Mock;
    where: jest.Mock;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    const { db } = require("../../src/infrastructure/database/DataSource");
    mockDb = db;
    savingsAdapter = new SavingsAdapter();
  });

  describe("getValue", () => {
    describe("Happy Path", () => {
      it("should return savings value successfully", async () => {
        const mockSavingsData = [{ value: "1500.50" }];
        mockDb.from.mockResolvedValue(mockSavingsData);

        const result = await savingsAdapter.getValue();

        expect(mockDb.select).toHaveBeenCalled();
        expect(result).toEqual({ value: 1500.5 });
      });

      it("should return zero savings value", async () => {
        const mockSavingsData = [{ value: "0" }];
        mockDb.from.mockResolvedValue(mockSavingsData);

        const result = await savingsAdapter.getValue();

        expect(result).toEqual({ value: 0 });
      });

      it("should parse string value to float correctly", async () => {
        const mockSavingsData = [{ value: "12345.67" }];
        mockDb.from.mockResolvedValue(mockSavingsData);

        const result = await savingsAdapter.getValue();

        expect(result.value).toBe(12345.67);
      });
    });

    describe("Sad Path", () => {
      it("should handle error when getting savings fails", async () => {
        mockDb.from.mockRejectedValue(new Error("Database error"));

        await expect(savingsAdapter.getValue()).rejects.toThrow("Database error");
      });

      it("should handle connection error", async () => {
        mockDb.from.mockRejectedValue(new Error("Connection refused"));

        await expect(savingsAdapter.getValue()).rejects.toThrow("Connection refused");
      });
    });
  });

  describe("updateValue", () => {
    describe("Happy Path", () => {
      it("should update savings value successfully", async () => {
        mockDb.onConflictDoUpdate.mockResolvedValue(undefined);

        await savingsAdapter.updateValue({ value: 1000 });

        expect(mockDb.insert).toHaveBeenCalled();
        expect(mockDb.values).toHaveBeenCalledWith({ id: 1, value: "1000" });
        expect(mockDb.onConflictDoUpdate).toHaveBeenCalled();
      });

      it("should update savings with decimal value", async () => {
        mockDb.onConflictDoUpdate.mockResolvedValue(undefined);

        await savingsAdapter.updateValue({ value: 1234.56 });

        expect(mockDb.values).toHaveBeenCalledWith({ id: 1, value: "1234.56" });
      });

      it("should update savings with zero value", async () => {
        mockDb.onConflictDoUpdate.mockResolvedValue(undefined);

        await savingsAdapter.updateValue({ value: 0 });

        expect(mockDb.values).toHaveBeenCalledWith({ id: 1, value: "0" });
      });
    });

    describe("Sad Path", () => {
      it("should handle error when updating savings fails", async () => {
        mockDb.onConflictDoUpdate.mockRejectedValue(new Error("Update failed"));

        await expect(savingsAdapter.updateValue({ value: 1000 })).rejects.toThrow("Update failed");
      });

      it("should handle database constraint error", async () => {
        mockDb.onConflictDoUpdate.mockRejectedValue(new Error("Constraint violation"));

        await expect(savingsAdapter.updateValue({ value: 500 })).rejects.toThrow("Constraint violation");
      });
    });
  });

  describe("clearValue", () => {
    describe("Happy Path", () => {
      it("should clear savings value successfully", async () => {
        mockDb.where.mockResolvedValue(undefined);

        await savingsAdapter.clearValue();

        expect(mockDb.update).toHaveBeenCalled();
        expect(mockDb.set).toHaveBeenCalledWith({ value: "0" });
        expect(mockDb.where).toHaveBeenCalled();
      });
    });

    describe("Sad Path", () => {
      it("should handle error when clearing savings fails", async () => {
        mockDb.where.mockRejectedValue(new Error("Clear failed"));

        await expect(savingsAdapter.clearValue()).rejects.toThrow("Clear failed");
      });

      it("should handle connection timeout error", async () => {
        mockDb.where.mockRejectedValue(new Error("Connection timeout"));

        await expect(savingsAdapter.clearValue()).rejects.toThrow("Connection timeout");
      });
    });
  });
});
