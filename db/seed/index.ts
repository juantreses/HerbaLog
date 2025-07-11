import { seedProductCategories } from './product-categories/seed.ts';

async function runAllSeeds() {
    console.log('🌱 Starting database seeding...\n');
    
    try {
        await seedProductCategories();
        console.log('\n✅ All seeds completed successfully!');
    } catch (error) {
        console.error('\n❌ Error during seeding:', error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

// Run all seeds
runAllSeeds(); 