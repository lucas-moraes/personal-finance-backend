import { ISavingsAdapter, ISavingsGetAmount } from "../../domain/interfaces/Savings.interface";
import { db } from "../database/DataSource";
import { savings } from "../../domain/entities/Savings.entity";
import { eq } from "drizzle-orm";

export class SavingsAdapter implements ISavingsAdapter {
  private savingsRepository: typeof db;

  constructor() {
    this.savingsRepository = db;
  }

  async updateValue({ value }: { value: number }): Promise<void> {
    await this.savingsRepository
      .insert(savings)
      .values({ id: 1, value: String(value) as string })
      .onConflictDoUpdate({
        target: [savings.id],
        set: { value: String(value) as string },
      });
  }

  async clearValue(): Promise<void> {
    await this.savingsRepository.update(savings).set({ value: "0" }).where(eq(savings.id, 1));
  }

  async getValue(): Promise<ISavingsGetAmount> {
    const resp = await this.savingsRepository.select({ value: savings.value }).from(savings);
    const respSanitized = { value: parseFloat(resp[0].value) };
    return respSanitized;
  }
}
