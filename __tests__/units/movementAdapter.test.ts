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
    // Restore chainable methods
    mockDb.select.mockReturnThis();
    mockDb.from.mockReturnThis();
    mockDb.leftJoin.mockReturnThis();
    mockDb.where.mockReturnThis();
    mockDb.groupBy.mockReturnThis();
    mockDb.orderBy.mockReturnThis();
    mockDb.limit.mockReturnThis();
    mockDb.insert.mockReturnThis();
    mockDb.values.mockReturnThis();
    mockDb.delete.mockReturnThis();
    mockDb.update.mockReturnThis();
    mockDb.set.mockReturnThis();
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

    it("should find movement by id successfully", async () => {
      const mockMovement = {
        id: 1,
        dia: 6,
        mes: 6,
        ano: 2018,
        tipo: "entrada",
        categoria: 1,
        descricao: "Teste",
        valor: "2500",
      };
      mockDb.limit.mockResolvedValue([mockMovement]);

      const result = await movementAdapter.findMovementById({ id: "1" });

      expect(mockDb.select).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result![0].valor).toBe(2500);
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

    it("should create multiple movements successfully", async () => {
      const newMovements: Array<Omit<IMovement, "id">> = [
        {
          dia: 6,
          mes: 6,
          ano: 2018,
          tipo: "entrada",
          categoria: 1,
          descricao: "Movimento 1",
          valor: 2500,
        },
        {
          dia: 7,
          mes: 6,
          ano: 2018,
          tipo: "saida",
          categoria: 2,
          descricao: "Movimento 2",
          valor: 1500,
        },
      ];
      const createdMovements = newMovements.map((m, i) => ({ id: i + 1, ...m, valor: m.valor.toString() }));
      mockDb.returning.mockResolvedValue(createdMovements);

      const result = await movementAdapter.createMultipleMovements(newMovements);

      expect(mockDb.insert).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0].valor).toBe(2500);
      expect(result[1].valor).toBe(1500);
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

    it("should get years with movements successfully", async () => {
      const mockYears = [{ ano: 2022 }, { ano: 2023 }, { ano: 2024 }];
      mockDb.orderBy.mockResolvedValue(mockYears);

      const result = await movementAdapter.yearsWithMovements();

      expect(mockDb.select).toHaveBeenCalled();
      expect(result).toHaveLength(3);
      expect(result[0].ano).toBe(2022);
    });

    it("should get months with movements successfully", async () => {
      const mockMonths = [{ mes: 1 }, { mes: 6 }, { mes: 12 }];
      mockDb.orderBy.mockResolvedValue(mockMonths);

      const result = await movementAdapter.monthsWithMovements();

      expect(mockDb.select).toHaveBeenCalled();
      expect(result).toHaveLength(3);
    });

    it("should filter movements by year grouped by category", async () => {
      const mockResult = [
        { categoria: 1, categoriaDescription: "Vendas", total_valor: 5000 },
        { categoria: 2, categoriaDescription: "Compras", total_valor: 3000 },
      ];
      mockDb.groupBy.mockResolvedValue(mockResult);

      const result = await movementAdapter.filterMovementGroupByCategory(2024);

      expect(mockDb.select).toHaveBeenCalled();
      expect(result).toHaveLength(2);
    });

    it("should filter movements by year grouped by month", async () => {
      const mockResult = [
        { mes: 1, total_valor: 5000 },
        { mes: 2, total_valor: 3000 },
      ];
      mockDb.groupBy.mockResolvedValue(mockResult);

      const result = await movementAdapter.filterMovementGroupByMonth(2024);

      expect(mockDb.select).toHaveBeenCalled();
      expect(result).toHaveLength(2);
    });
  });

  describe("Sad Path", () => {
    it("should propagate errors from database operations", async () => {
      mockDb.leftJoin.mockImplementationOnce(() => {
        throw new Error("Database connection error");
      });

      await expect(movementAdapter.findAllMovements()).rejects.toThrow("Database connection error");
    });

    it("should propagate errors when inserting movements", async () => {
      mockDb.returning.mockImplementationOnce(() => {
        throw new Error("Insert constraint violation");
      });

      const newMovement: Omit<IMovement, "id"> = {
        dia: 6,
        mes: 6,
        ano: 2018,
        tipo: "entrada",
        categoria: 1,
        descricao: "Test",
        valor: 2500,
      };

      await expect(movementAdapter.createMovement(newMovement)).rejects.toThrow();
    });
  });
});
