import { MovementAdapter } from "../../src/infrastructure/adapters/Movement.adapter";
import type { IMovement, IMovementConsult } from "../../src/domain/interfaces/Movement.interface";

jest.mock("../../src/infrastructure/database/DataSource", () => ({
  db: {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    returning: jest.fn(),
    delete: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
  },
}));

describe("MovementAdapter", () => {
  let movementAdapter: MovementAdapter;
  let mockDb: any;

  beforeEach(() => {
    jest.clearAllMocks();
    const { db } = require("../../src/infrastructure/database/DataSource");
    mockDb = db;
    movementAdapter = new MovementAdapter();
  });

  describe("Happy Path", () => {
    it("should find all movements successfully", async () => {
      const mockMovements: IMovementConsult[] = [
        {
          id: 1,
          dia: 6,
          mes: 6,
          ano: 2018,
          tipo: "entrada",
          descricao: "Teste",
          valor: 2500,
          categoriaDescricao: "Vendas",
        },
      ];
      mockDb.leftJoin.mockResolvedValue(
        mockMovements.map((m) => ({ ...m, categoria: 1, categoriaDescricao: m.categoriaDescricao, valor: "2500" }))
      );

      const result = await movementAdapter.findAllMovements();

      expect(mockDb.select).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0].valor).toBe(2500);
    });

    it("should find movements by criteria successfully", async () => {
      const mockMovement = {
        id: 1,
        dia: 6,
        mes: 6,
        ano: 2018,
        tipo: "entrada",
        descricao: "Filtrado",
        valor: "2500",
        categoria: 1,
        categoriaDescription: "Vendas",
      };
      mockDb.where.mockResolvedValue([mockMovement]);

      const result = await movementAdapter.findMovementsBy({ mes: 6, ano: 2018 });

      expect(mockDb.select).toHaveBeenCalled();
      expect(result.movements).toBeDefined();
      expect(result.total).toBeDefined();
    });

    it("should create a movement successfully", async () => {
      const newMovement: Omit<IMovement, "id"> = {
        dia: 6,
        mes: 6,
        ano: 2018,
        tipo: "entrada",
        categoria: 1,
        descricao: "Novo",
        valor: 2500,
      };
      const createdMovement = { id: 3, ...newMovement, valor: "2500" };
      mockDb.returning.mockResolvedValue([createdMovement]);

      const result = await movementAdapter.createMovement(newMovement);

      expect(mockDb.insert).toHaveBeenCalled();
      expect(result.valor).toBe(2500);
      expect(result.id).toBe(3);
    });

    it("should delete a movement by id successfully", async () => {
      mockDb.where.mockResolvedValue({ affected: 1 });

      await movementAdapter.deleteMovementById(1);

      expect(mockDb.delete).toHaveBeenCalled();
      expect(mockDb.where).toHaveBeenCalled();
    });

    it("should update a movement by id successfully", async () => {
      mockDb.where.mockResolvedValue({ affected: 1 });

      await movementAdapter.updateMovementById(1, { valor: 3000 });

      expect(mockDb.update).toHaveBeenCalled();
      expect(mockDb.set).toHaveBeenCalled();
      expect(mockDb.where).toHaveBeenCalled();
    });
  });

  describe("Sad Path", () => {
    it("should handle error when finding all movements fails", async () => {
      mockDb.leftJoin.mockImplementationOnce(() => {
        throw new Error("Database error");
      });

      await expect(movementAdapter.findAllMovements()).rejects.toThrow("Database error");
    });

    it("should handle error when finding movements by criteria fails", async () => {
      mockDb.where.mockImplementationOnce(() => {
        throw new Error("Query error");
      });

      await expect(movementAdapter.findMovementsBy({ ano: 2018 })).rejects.toThrow("Query error");
    });

    it("should handle error when creating a movement fails", async () => {
      mockDb.returning.mockImplementationOnce(() => {
        throw new Error("Insert failed");
      });

      const newMovement: Omit<IMovement, "id"> = {
        dia: 6,
        mes: 6,
        ano: 2018,
        tipo: "entrada",
        categoria: 1,
        descricao: "Novo",
        valor: 2500,
      };

      await expect(movementAdapter.createMovement(newMovement)).rejects.toThrow("Insert failed");
    });

    it("should handle error when deleting a movement fails", async () => {
      mockDb.where.mockImplementationOnce(() => {
        throw new Error("Delete failed");
      });

      await expect(movementAdapter.deleteMovementById(1)).rejects.toThrow("Delete failed");
    });

    it("should handle error when updating a movement fails", async () => {
      mockDb.where.mockImplementationOnce(() => {
        throw new Error("Update failed");
      });

      await expect(movementAdapter.updateMovementById(1, { valor: 3000 })).rejects.toThrow("Update failed");
    });
  });
});
