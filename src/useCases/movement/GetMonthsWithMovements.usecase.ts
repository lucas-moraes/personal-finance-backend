import type { IMovementAdapter, IMovementMonths } from "../../domain/interfaces/Movement.interface";

export class GetMonthsWithMovements {
  private MovementAdapter: IMovementAdapter;

  constructor(movementAdapter: IMovementAdapter) {
    this.MovementAdapter = movementAdapter;
  }

  async execute(): Promise<Array<IMovementMonths>> {
    return this.MovementAdapter.monthsWithMovements();
  }
}
