import type { IMovementAdapter, IMovement, IMovementSummary } from "../../domain/interfaces/Movement.interface";

export class FilterMovements {
  private movementRepository: IMovementAdapter;

  constructor(movementRepository: IMovementAdapter) {
    this.movementRepository = movementRepository;
  }

  async execute(args: Partial<IMovement>): Promise<IMovementSummary> {
    return await this.movementRepository.findMovementsBy(args);
  }
}
