import {desc} from "drizzle-orm";
import {
    productCategories,
    type InsertProductCategory,
    type ProductCategory
} from "@shared/db/schema/product_categories";
import {db} from "../../db.ts";

export async function get(): Promise<ProductCategory[]> {
    return db
        .select()
        .from(productCategories)
        .orderBy(desc(productCategories.name));
}

export async function create(category: InsertProductCategory): Promise<ProductCategory> {
    const [createdCategory] = await db
        .insert(productCategories)
        .values(category)
        .returning();

    return createdCategory;
}