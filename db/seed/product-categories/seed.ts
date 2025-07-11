import { db } from '../../db.ts';
import { productCategories } from '../../schema/products/categories.ts';

const categories = [
    'Ontbijt / Maaltijden',
    'Proefpakketten',
    'Proteïne',
    'Supplementen',
    'Extra Dranken',
    'Herbalife 24',
    'Literatuur',
    'Skin gelaatsverzorging',
    'Herbal Aloë - Verzorging voor lichaam en haar'
];

export async function seedProductCategories() {
    console.log('📦 Seeding product categories...');
    
    for (const categoryName of categories) {
        try {
            const [category] = await db
                .insert(productCategories)
                .values({
                    name: categoryName,
                    createdById: 1 // Assuming admin user with ID 1
                })
                .returning();
            
            console.log(`✅ Created category: ${category.name}`);
        } catch (error: any) {
            if (error.code === '23505') { // Unique constraint violation
                console.log(`⚠️  Category already exists: ${categoryName}`);
            } else {
                console.error(`❌ Error creating category "${categoryName}":`, error.message);
            }
        }
    }
    
    console.log('✅ Product categories seeding completed!');
} 