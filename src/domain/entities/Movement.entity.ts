import { pgTable, serial, integer, varchar, numeric } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { categories } from "./Category.entity";

export const movements = pgTable("lc_movimento", {
  id: serial("id").primaryKey(),
  dia: integer("dia").notNull(),
  mes: integer("mes").notNull(),
  ano: integer("ano").notNull(),
  tipo: varchar("tipo", { length: 255 }).notNull(),
  categoria: integer("categoria").notNull(),
  descricao: varchar("descricao", { length: 255 }),
  valor: numeric("valor").notNull(),
});

export const movementRelations = relations(movements, ({ one }) => ({
  category: one(categories, {
    fields: [movements.categoria],
    references: [categories.id],
  }),
}));
