import { ISavingsAdapter, ISavingsGetAmount } from "../../domain/interfaces/Savings.interface";

export class GetSavings {
  private SavingsAdapter: ISavingsAdapter;

  constructor(savingsAdapter: ISavingsAdapter) {
    this.SavingsAdapter = savingsAdapter;
  }

  async execute(): Promise<ISavingsGetAmount> {
    return await this.SavingsAdapter.getValue();
  }
}
