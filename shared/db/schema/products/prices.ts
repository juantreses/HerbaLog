import {integer, numeric, pgTable, serial, timestamp} from "drizzle-orm/pg-core";
import {products} from "@shared/db/schema/products/products.ts";

export const productPrices = pgTable('product_prices', {
    id: serial("id").primaryKey(),
    productId: integer("product_id").notNull().references(() => products.id),
    price: numeric("price", {precision: 5, scale: 0}).notNull(),
    validFrom: timestamp('valid_from', { mode: 'string' }).defaultNow().notNull(),
    validUntil: timestamp('valid_until', { mode: 'string' }),
    createdAt: timestamp('created_at', {mode: 'string'}).defaultNow().notNull(),
    createdById: integer('created_by_id').notNull(),
});