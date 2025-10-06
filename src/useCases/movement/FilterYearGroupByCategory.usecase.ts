import type { IMovementAdapter, TMovement } from "../../domain/interfaces/Movement.interface";

export class FilterYearGroupByCategory {
  private movementAdapter: IMovementAdapter;

  constructor(MovementAdapter: IMovementAdapter) {
    this.movementAdapter = MovementAdapter;
  }

  async execute(query: { year?: number | null }): Promise<Array<{ categoria: number; total_valor: number }>> {
    if (query.year) return await this.movementAdapter.filterMovementGroupByCategory(query.year);
    return [];
  }
}
