import type { IMovementAdapter, TMovement } from "../../domain/interfaces/Movement.interface";

export class UpdateMovementById {
  private movementAdapter: IMovementAdapter;

  constructor(movementAdapter: IMovementAdapter) {
    this.movementAdapter = movementAdapter;
  }

  async execute(id: number, movementUpdated: Partial<TMovement>): Promise<void> {
    return this.movementAdapter.updateMovementById(id, movementUpdated);
  }
}
