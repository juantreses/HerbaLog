// server/routes/categories.ts
import {Router} from 'express';
import {db} from '@db/db.ts';
import {
    insertProductCategorySchema,
    insertValidationProductCategorySchema,
    productCategories
} from "@db/schema/products/categories.ts";
import requireAdmin from "../../middleware/requireAdmin.ts";
import {z} from "zod";
import {recordAdminActivity} from "../../utils/adminActivityLogger.ts";
import {AdminActivity} from "@db/schema/admin/activities.ts";
import {sql} from "drizzle-orm";
import {storage} from "../../storage";

const productCategoriesRouter = Router();

// Alle categorieën ophalen
productCategoriesRouter.get('/', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
        const all = await db.select().from(productCategories);
        res.json(all);
    } catch (error) {
        console.error('Error fetching product categories:', error);
        res.status(500).json({error: 'Interne fout.'});
    }
});

// Nieuwe categorie toevoegen
productCategoriesRouter.post('/', requireAdmin, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
        const validatedData = insertValidationProductCategorySchema.parse(req.body);
        if (!validatedData.name || validatedData.name.trim() === '') {
            return res.status(400).json({error: 'Naam is verplicht.'});
        }

        const category = await storage.products.categories.create({
            ...validatedData,
            createdById: req.user.id
        });

        await recordAdminActivity(
            {
                userId: req.user.id,
                action: AdminActivity.CREATED_CATEGORY,
                details: {
                    categoryId: category.id,
                    categoryName: category.name,
                }
            }
        )

        res.status(201).json(category);
    } catch (error) {
        console.error('Error creating product category:', error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({error: error.errors});
        }
        res.status(500).json({error: 'Interne fout.'});
    }
});

// Naam uniekheid checken
productCategoriesRouter.get('/check-name', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    console.debug('checking');
    const normalizedName = req.query.name?.toString().trim().toLowerCase();
    if (!normalizedName) {
        return res.status(400).json({error: 'Naam is verplicht.'});
    }

    try {
        const existing = await db
            .select()
            .from(productCategories)
            .where(sql`lower(${productCategories.name}) = ${normalizedName}`)
            .limit(1);

        res.json({exists: existing.length > 0});
    } catch (error) {
        console.error('Error checking category name uniqueness:', error);
        res.status(500).json({error: 'Interne fout.'});
    }
});


export default productCategoriesRouter;
