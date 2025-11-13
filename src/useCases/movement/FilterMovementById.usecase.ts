import type { IMovementAdapter, IMovement } from "../../domain/interfaces/Movement.interface";

export class FilterMovementById {
  private movementRepository: IMovementAdapter;

  constructor(movementRepository: IMovementAdapter) {
    this.movementRepository = movementRepository;
  }

  async execute({ id }: { id: string }): Promise<Array<IMovement> | null> {
    return await this.movementRepository.findMovementById({ id });
  }
}
