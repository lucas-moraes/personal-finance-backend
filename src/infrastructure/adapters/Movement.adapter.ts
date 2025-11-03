import {
  IMovementAdapter,
  IMovementConsult,
  IMovementSummary,
  IMovement,
} from "../../domain/interfaces/Movement.interface";
import { movements } from "../../domain/entities/Movement.entity";
import { db } from "../database/DataSource";
import { and, eq, SQL, sql } from "drizzle-orm";
import { categories } from "../../domain/entities/Category.entity";

export class MovementAdapter implements IMovementAdapter {
  private movementAdapter: typeof db;

  constructor() {
    this.movementAdapter = db;
  }

  async filterMovementGroupByCategory(year: number): Promise<Array<{ categoria: number; total_valor: number }>> {
    return await this.movementAdapter
      .select({
        categoria: movements.categoria,
        categoriaDescription: categories.descricao,
        total_valor: sql<number>`SUM(${movements.valor})`,
      })
      .from(movements)
      .leftJoin(categories, eq(movements.categoria, categories.id))
      .where(eq(movements.ano, year))
      .groupBy(movements.categoria, categories.descricao);
  }

  async filterMovementGroupByMonth(year: number): Promise<Array<{ mes: number; total_valor: number }>> {
    return await this.movementAdapter
      .select({
        mes: movements.mes,
        total_valor: sql<number>`SUM(${movements.valor})`,
      })
      .from(movements)
      .where(eq(movements.ano, year))
      .groupBy(movements.mes);
  }

  async findAllMovements(): Promise<Array<IMovementConsult>> {
    const movement = await this.movementAdapter
      .select({
        id: movements.id,
        dia: movements.dia,
        mes: movements.mes,
        ano: movements.ano,
        tipo: movements.tipo,
        categoria: movements.categoria,
        categoriaDescricao: categories.descricao,
        descricao: movements.descricao,
        valor: movements.valor,
      })
      .from(movements)
      .leftJoin(categories, eq(movements.categoria, categories.id));

    const movementSanitized = movement.map((_m) => {
      const { categoria, ...rest } = _m;
      return {
        ...rest,
        categoriaDescricao: rest.categoriaDescricao || "",
        valor: parseFloat(_m.valor),
      };
    });

    return movementSanitized;
  }

  async findMovementsBy(args: Partial<IMovement>): Promise<IMovementSummary> {
    const filters: SQL[] = [];
    if (args.categoria as number) {
      filters.push(eq(movements.categoria, args.categoria as number));
    }
    if (args.ano) {
      filters.push(eq(movements.ano, args.ano));
    }
    if (args.mes) {
      filters.push(eq(movements.mes, args.mes));
    }

    const movementFiltered = await this.movementAdapter
      .select({
        id: movements.id,
        dia: movements.dia,
        mes: movements.mes,
        ano: movements.ano,
        tipo: movements.tipo,
        categoria: movements.categoria,
        categoriaDescription: categories.descricao,
        descricao: movements.descricao,
        valor: movements.valor,
      })
      .from(movements)
      .leftJoin(categories, eq(movements.categoria, categories.id))
      .where(and(...filters));

    const movementSanitized = movementFiltered.map((_m) => {
      const { categoria, categoriaDescription, ...rest } = _m;
      return {
        ...rest,
        categoriaDescricao: categoriaDescription || "",
        valor: parseFloat(_m.valor),
      };
    });

    const movementSummary = movementFiltered.reduce((acc: number, curr) => {
      const summary = parseFloat(curr.valor!);
      return acc + summary;
    }, 0);

    return {
      movements: movementSanitized,
      total: movementSummary,
    };
  }

  async createMovement(movement: Omit<IMovement, "id">): Promise<IMovement> {
    const movementToInsert = {
      ...movement,
      valor: movement.valor.toString()
    };
    const res = await this.movementAdapter.insert(movements).values(movementToInsert).returning();
    return {
      ...res[0],
      valor: parseFloat(res[0].valor)
    };
  }

  async createMultipleMovements(movement: Array<Omit<IMovement, "id">>): Promise<Array<IMovement>> {
    const movementsToInsert = movement.map(m => ({
      ...m,
      valor: m.valor.toString()
    }));
    const res = await this.movementAdapter.insert(movements).values(movementsToInsert).returning();
    return res.map(r => ({
      ...r,
      valor: parseFloat(r.valor)
    }));
  }

  async deleteMovementById(id: number): Promise<void> {
    await this.movementAdapter.delete(movements).where(eq(movements.id, id));
  }

  async updateMovementById(id: number, movementUpdated: Partial<IMovement>): Promise<void> {
    const { valor, ...rest } = movementUpdated;
    const movementToUpdate = {
      ...rest,
      ...(valor !== undefined && { valor: valor.toString() })
    };
    await this.movementAdapter.update(movements).set(movementToUpdate).where(eq(movements.id, id));
  }
}
