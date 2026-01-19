import { ISavingsAdapter } from "../../domain/interfaces/Savings.interface";

export class ClearSavings {
  private SavingsAdapter: ISavingsAdapter;

  constructor(savingsAdapter: ISavingsAdapter) {
    this.SavingsAdapter = savingsAdapter;
  }

  async execute(): Promise<void> {
    await this.SavingsAdapter.clearValue();
  }
}
