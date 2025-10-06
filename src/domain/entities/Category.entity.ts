import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { movements } from "./Movement.entity";

export const categories = pgTable("categoria", {
  id: serial("id").primaryKey(),
  descricao: varchar("descricao", { length: 255 }).notNull(),
});

export const categoryRelations = relations(categories, ({ many }) => ({
  movements: many(movements),
}));
