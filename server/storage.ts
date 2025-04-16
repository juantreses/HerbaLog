import {desc, eq} from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import {InsertUser, FullUser, users, PublicUser, publicUserSchema,} from "@shared/db/schema/users.ts";
import {db, pool} from "./db.ts";
import {Role} from "@shared/roles.ts";
import {InsertProductCategory, productCategories, ProductCategory} from "@shared/db/schema/product_categories.ts";
import {adminActivities, AdminActivityRecord, InsertAdminActivity} from "@shared/db/schema/admin_activity.ts";

export interface IStorage {
    // User operations
    getUser(id: number): Promise<FullUser | undefined>;

    getUserByEmail(email: string): Promise<FullUser | undefined>;

    createUser(user: InsertUser): Promise<FullUser>;

    //Product operations
    getProductCategories(): Promise<ProductCategory[]>;

    createProductCategory(category: InsertProductCategory): Promise<ProductCategory>

    sessionStore: session.Store;
}


export class DatabaseStorage implements IStorage {
    sessionStore: session.Store;

    constructor() {
        const PostgresSessionStore = connectPg(session);
        this.sessionStore = new PostgresSessionStore({
            pool,
            createTableIfMissing: true
        });
    }

    // User operations
    async getUser(id: number): Promise<FullUser | undefined> {
        const [user] = await db.select().from(users).where(eq(users.id, id));
        return user;
    }

    async getUserByEmail(email: string): Promise<FullUser | undefined> {
        if (!email) {
            return undefined;
        }

        // Using toLowerCase for case-insensitive comparison
        const normalizedEmail = email.toLowerCase();
        const [user] = await db.select().from(users).where(
            eq(users.email, normalizedEmail)
        );

        return user;
    }

    async createUser(insertUser: InsertUser): Promise<FullUser> {
        const normalizedEmail = insertUser.email.toLowerCase(); // Normalize email to lowercase
        const role = insertUser.role || Role.DISTRIBUTOR;

        // @ts-ignore
        const [user] = await db.insert(users).values({
            ...insertUser,
            email: normalizedEmail,
            createdAt: new Date(),
            role: role
        }).returning();

        return user;
    }

    // Product Operations
    async getProductCategories(): Promise<ProductCategory[]> {
        return db
            .select()
            .from(productCategories)
            .orderBy(desc(productCategories.name));
    }

    async createProductCategory(category: InsertProductCategory): Promise<ProductCategory> {
        const [createdCategory] = await db
            .insert(productCategories)
            .values(category)
            .returning();

        return createdCategory;
    }

    // AdminActivity Operations
    async createAdminActivity(insertAdminActivity: InsertAdminActivity): Promise<AdminActivityRecord> {
        // @ts-ignore
        const [activity] = await db.insert(adminActivities).values({
            ...insertAdminActivity,
            details: insertAdminActivity.details || {}
        }).returning();

        return activity;
    }

    async getAdminActivities(page: number = 1,pageSize: number = 20): Promise<{
        activities: (AdminActivityRecord & {user: PublicUser})[],
        totalCount: number
    }> {
        const adminActivityData = await db.select({
            activity: adminActivities,
            user: users
        }).from(adminActivities)
            .innerJoin(users, eq(adminActivities.userId, users.id))
            .orderBy(desc(adminActivities.timestamp))
            .offset((page - 1) * pageSize)
            .limit(pageSize);

        const totalCountResult = await db.$count(adminActivities);

        return {
            activities: adminActivityData.map(({activity, user}) => ({
                ...activity,
                user: publicUserSchema.parse(user)
            })),
            totalCount: totalCountResult
        };
    }
}


export const storage = new DatabaseStorage();