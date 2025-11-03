import type { IMovementAdapter, IMovement } from "../../domain/interfaces/Movement.interface";

export class UpdateMovementById {
  private movementAdapter: IMovementAdapter;

  constructor(movementAdapter: IMovementAdapter) {
    this.movementAdapter = movementAdapter;
  }

  async execute(id: number, movementUpdated: Partial<IMovement>): Promise<void> {
    return this.movementAdapter.updateMovementById(id, movementUpdated);
  }
}
