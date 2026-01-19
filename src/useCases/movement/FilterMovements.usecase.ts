import { ISavingsAdapter } from "src/domain/interfaces/Savings.interface";
import type { IMovementAdapter, IMovement, IMovementSummary } from "../../domain/interfaces/Movement.interface";

export class FilterMovements {
  private movementRepository: IMovementAdapter;
  private savingsRepository: ISavingsAdapter;

  constructor(movementRepository: IMovementAdapter, savingsRepository: ISavingsAdapter) {
    this.movementRepository = movementRepository;
    this.savingsRepository = savingsRepository;
  }

  async execute(args: Partial<IMovement>): Promise<IMovementSummary> {
    const savings = await this.savingsRepository.getValue();
    const movements = await this.movementRepository.findMovementsBy(args);

    return {
      ...movements,
      savings: savings.value,
    };
  }
}
