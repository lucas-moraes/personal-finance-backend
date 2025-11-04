import type { IMovementAdapter, IMovementYears } from "../../domain/interfaces/Movement.interface";

export class GetYearsWithMovements {
  private MovementAdapter: IMovementAdapter;

  constructor(movementAdapter: IMovementAdapter) {
    this.MovementAdapter = movementAdapter;
  }

  async execute(): Promise<Array<IMovementYears>> {
    return this.MovementAdapter.yearsWithMovements();
  }
}
