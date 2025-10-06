import type { IMovementAdapter, TMovement } from "../../domain/interfaces/Movement.interface";

export class CreateMovement {
  private movementAdapter: IMovementAdapter;

  constructor(movementAdapter: IMovementAdapter) {
    this.movementAdapter = movementAdapter;
  }

  async execute(newMovement: TMovement | TMovement[]): Promise<TMovement> {
    return this.movementAdapter.createMovement(newMovement!);
  }
}
