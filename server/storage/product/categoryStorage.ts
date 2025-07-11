import {desc} from "drizzle-orm";
import {
    productCategories,
    type InsertProductCategory,
    type ProductCategory
} from "@db/schema/products/categories.ts";
import {db} from "@db/db.ts";

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