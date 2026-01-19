import { pgTable, serial, numeric } from "drizzle-orm/pg-core";

export const savings = pgTable("poupanca", {
  id: serial("id").primaryKey(),
  value: numeric("value").notNull(),
});
