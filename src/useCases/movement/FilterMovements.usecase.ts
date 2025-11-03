import type { IMovementAdapter, IMovement, IMovementSummary } from "../../domain/interfaces/Movement.interface";

export class FilterMovements {
  private movementRepository: IMovementAdapter;

  constructor(movementRepository: IMovementAdapter) {
    this.movementRepository = movementRepository;
  }

  async execute(args: Partial<IMovement>): Promise<Array<IMovementSummary>> {
    const result = await this.movementRepository.findMovementsBy(args);
    return Array.isArray(result) ? result : [result];
  }
}