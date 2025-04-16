import {FullUser, InsertUser, users} from "@shared/db/schema/users.ts";
import {db} from "../../db.ts";
import {eq} from "drizzle-orm";
import {Role} from "@shared/roles.ts";

export async function byId(id: number): Promise<FullUser | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
}

export async function byEmail(email: string): Promise<FullUser | undefined> {
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

export async function create(insertUser: InsertUser): Promise<FullUser> {
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