import { ISavingsAdapter } from "../../domain/interfaces/Savings.interface";

export class UpdateSavings {
  private SavingsAdapter: ISavingsAdapter;

  constructor(savingsAdapter: ISavingsAdapter) {
    this.SavingsAdapter = savingsAdapter;
  }

  async execute({ value }: { value: number }): Promise<void> {
    await this.SavingsAdapter.updateValue({ value });
  }
}
