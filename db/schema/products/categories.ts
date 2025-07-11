import {pgTable, serial, varchar, timestamp, integer} from "drizzle-orm/pg-core";
import {createInsertSchema} from "drizzle-zod";
import {z} from "zod";

export const productCategories = pgTable('product_categories', {
    id: serial("id").primaryKey(),
    name: varchar("name", {length: 60}).unique().notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    createdById: integer('created_by_id').notNull(),
});

export const insertProductCategorySchema = createInsertSchema(productCategories);

export const insertValidationProductCategorySchema = insertProductCategorySchema.pick({
    name: true,
});

// Types derived from schemas
export type InsertProductCategory = z.infer<typeof insertProductCategorySchema>;
export type InsertValidationProductCategory = z.infer<typeof insertValidationProductCategorySchema>;
export type ProductCategory = typeof productCategories.$inferSelect;