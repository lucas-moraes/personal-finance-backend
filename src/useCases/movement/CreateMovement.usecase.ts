import type { IMovementAdapter, IMovement } from "../../domain/interfaces/Movement.interface";

export class CreateMovement {
  private movementAdapter: IMovementAdapter;

  constructor(movementAdapter: IMovementAdapter) {
    this.movementAdapter = movementAdapter;
  }

  async execute(newMovement: IMovement | Array<IMovement>): Promise<IMovement> {
    return this.movementAdapter.createMovement(newMovement as IMovement);
  }
}
