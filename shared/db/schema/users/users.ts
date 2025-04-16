import {
    pgTable,
    text,
    serial,
    timestamp,
    varchar,
} from "drizzle-orm/pg-core";
import {createInsertSchema, createSelectSchema} from "drizzle-zod";
import {z} from "zod";
import {Role} from "@shared/roles.ts";

// User model
export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    email: varchar("email", {length: 320}).notNull().unique(),
    password: text("password").notNull(),
    firstName: varchar("firstName", {length: 50}).notNull(),
    lastName: varchar("lastName", {length: 50}).notNull(),
    role: varchar("role", {length: 20}).$type<Role>().notNull().default(Role.DISTRIBUTOR),
    createdAt: timestamp("created_at").defaultNow().notNull()
});

export const insertUserSchema = createInsertSchema(users).pick({
    email: true,
    password: true,
    firstName: true,
    lastName: true,
    role: true
});

export const publicUserSchema = createSelectSchema(users).pick({
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    role: true
});

// Types derived from schemas
export type InsertUser = z.infer<typeof insertUserSchema>;
export type FullUser = typeof users.$inferSelect;
export type PublicUser = z.infer<typeof publicUserSchema>;