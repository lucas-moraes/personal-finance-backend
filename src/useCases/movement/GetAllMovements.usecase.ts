import type { IMovementAdapter, IMovement, IMovementConsult } from "../../domain/interfaces/Movement.interface";

export class GetAllMovements {
  private MovementAdapter: IMovementAdapter;

  constructor(movementAdapter: IMovementAdapter) {
    this.MovementAdapter = movementAdapter;
  }

  async execute(): Promise<Array<IMovementConsult>> {
    return this.MovementAdapter.findAllMovements();
  }
}
