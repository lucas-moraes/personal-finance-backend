import { IMovementAdapter, TMovement } from "../../domain/interfaces/Movement.interface";
import { movements } from "../../domain/entities/Movement.entity";
import { db } from "../database/DataSource";
import { eq, sql } from "drizzle-orm";
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

  async findAllMovements(): Promise<Array<TMovement>> {
    return await this.movementAdapter.query.movements.findMany({
      with: {
        category: true,
      },
    });
  }

  async findMovementsBy(args: Record<string, string>): Promise<Array<TMovement>> {
    const [key, value] = Object.entries(args).flat(1) as [string, string];

    const columnMap: Record<string, any> = {
      id: movements.id,
      dia: movements.dia,
      mes: movements.mes,
      ano: movements.ano,
      tipo: movements.tipo,
      categoria: movements.categoria,
      descricao: movements.descricao,
      valor: movements.valor,
    };

    if (!columnMap[key]) {
      throw new Error(`Invalid column key: ${key}`);
    }

    return await this.movementAdapter
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
      .where(eq(columnMap[key], value));
  }

  async createMovement(movement: TMovement): Promise<TMovement> {
    const res = await this.movementAdapter.insert(movements).values(movement).returning();
    return res[0];
  }

  async createMultipleMovements(movement: Array<TMovement>): Promise<Array<TMovement>> {
    return await this.movementAdapter.insert(movements).values(movement).returning();
  }

  async deleteMovementById(id: number): Promise<void> {
    await this.movementAdapter.delete(movements).where(eq(movements.id, id));
  }

  async updateMovementById(id: number, movementUpdated: Partial<TMovement>): Promise<void> {
    await this.movementAdapter.update(movements).set(movementUpdated).where(eq(movements.id, id));
  }
}
