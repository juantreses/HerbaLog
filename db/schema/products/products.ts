import {boolean, char, integer, pgTable, serial, text, timestamp, varchar} from "drizzle-orm/pg-core";
import {createInsertSchema} from "drizzle-zod";
import {z} from "zod";
import {productCategories} from "@db/schema/products/categories.ts";

export const products = pgTable("products", {
    id: serial("id").primaryKey(),
    name: varchar("name", {length: 100}).notNull(),
    sku: char("sku", {length: 4}).notNull(),
    categoryId: integer("category_id").notNull().references(() => productCategories.id),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    createdById: integer('created_by_id').notNull(),
});

export const insertProductSchema = createInsertSchema(products);

export const insertValidationProductSchema = insertProductSchema.pick({
    name: true,
    sku: true,
    categoryId: true,
});

// Types derived from schemas
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertValidationProduct = z.infer<typeof insertValidationProductSchema>;
export type Product = typeof products.$inferSelect;