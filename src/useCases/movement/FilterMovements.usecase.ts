import type { IMovementAdapter, TMovement } from "../../domain/interfaces/Movement.interface";

export class FilterMovements {
  private movementRepository: IMovementAdapter;

  constructor(movementRepository: IMovementAdapter) {
    this.movementRepository = movementRepository;
  }

  async execute(args: Partial<TMovement>): Promise<Array<TMovement>> {
    return this.movementRepository.findMovementsBy(args);
  }
}
