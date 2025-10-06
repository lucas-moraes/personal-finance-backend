import type { IMovementAdapter } from "../../domain/interfaces/Movement.interface";

export class FilterYearGroupByMonth {
  private movementAdapter: IMovementAdapter;

  constructor(MovementAdapter: IMovementAdapter) {
    this.movementAdapter = MovementAdapter;
  }

  async execute(query: { year?: number | null }): Promise<Array<{ mes: number; total_valor: number }>> {
    if (query.year) {
      return this.movementAdapter.filterMovementGroupByMonth(query.year);
    }

    return [];
  }
}
