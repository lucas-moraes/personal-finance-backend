import type { IMovementAdapter } from "../../domain/interfaces/Movement.interface";

export class DeleteMovementById {
  private movementAdapter: IMovementAdapter;

  constructor(movementAdapter: IMovementAdapter) {
    this.movementAdapter = movementAdapter;
  }

  async execute(id: number): Promise<void> {
    await this.movementAdapter.deleteMovementById(id);
  }
}
