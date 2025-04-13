import {eq, and, desc, isNull, or, sql} from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import {
    User, InsertUser,
    users,
} from "@shared/db/schema/users.ts";
import {db, pool} from "./db.ts";
import {Role} from "@shared/roles.ts";

export interface IStorage {
    // User operations
    getUser(id: number): Promise<User | undefined>;

    getUserByEmail(email: string): Promise<User | undefined>;

    createUser(user: InsertUser): Promise<User>;

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
    async getUser(id: number): Promise<User | undefined> {
        const [user] = await db.select().from(users).where(eq(users.id, id));
        return user;
    }

    async getUserByEmail(email: string): Promise<User | undefined> {
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

    async createUser(insertUser: InsertUser): Promise<User> {
        const normalizedEmail = insertUser.email.toLowerCase(); // Normalize email to lowercase
        const role = insertUser.role || Role.DISTRIBUTOR;

        const [user] = await db.insert(users).values({
            ...insertUser,
            email: normalizedEmail,
            createdAt: new Date(),
            role: role
        }).returning();

        return user;
    }
}


export const storage = new DatabaseStorage();