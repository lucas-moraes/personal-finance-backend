import type { IMovementAdapter, TMovement } from "../../domain/interfaces/Movement.interface";

export class GetAllMovements {
  private MovementAdapter: IMovementAdapter;

  constructor(movementAdapter: IMovementAdapter) {
    this.MovementAdapter = movementAdapter;
  }

  async execute(): Promise<Array<TMovement>> {
    return this.MovementAdapter.findAllMovements();
  }
}
