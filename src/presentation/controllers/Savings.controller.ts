import type { Context } from "hono";
import { SavingsAdapter } from "../../infrastructure/adapters/Savings.adapter";
import { ClearSavings } from "../../useCases/savings/ClearSavings.usecase";
import { GetSavings } from "../../useCases/savings/GetSavings.usecase";
import { UpdateSavings } from "../../useCases/savings/UpdateSavings.usecase";

export class SavingsController {
  private getSavingsUseCase: GetSavings;
  private clearSavingsUseCase: ClearSavings;
  private updateSavingsUseCase: UpdateSavings;

  constructor() {
    const savingsRepository = new SavingsAdapter();
    this.getSavingsUseCase = new GetSavings(savingsRepository);
    this.clearSavingsUseCase = new ClearSavings(savingsRepository);
    this.updateSavingsUseCase = new UpdateSavings(savingsRepository);
  }

  async getSavings(c: Context) {
    try {
      const savings = await this.getSavingsUseCase.execute();
      return c.json(savings);
    } catch (error) {
      return c.json({ message: (error as Error).message }, 500);
    }
  }

  async clearSavings(c: Context) {
    try {
      await this.clearSavingsUseCase.execute();
      return c.json({ message: "Savings cleared successfully" });
    } catch (error) {
      return c.json({ message: (error as Error).message }, 500);
    }
  }

  async updateSavings(c: Context) {
    try {
      const { value } = await c.req.json();
      if (typeof value !== "number") {
        return c.json({ message: "Invalid value type" }, 400);
      }
      await this.updateSavingsUseCase.execute({ value });
      return c.json({ message: "Savings updated successfully" });
    } catch (error) {
      return c.json({ message: (error as Error).message }, 500);
    }
  }
}
