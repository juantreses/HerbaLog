import {integer, jsonb, pgTable, serial, timestamp, varchar} from "drizzle-orm/pg-core";
import {createInsertSchema} from "drizzle-zod";
import {z} from "zod";

export enum AdminActivity {
    CREATED_CATEGORY = 'CREATED_CATEGORY',
}

export const adminActivities = pgTable("admin_activities", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull(),
    action: varchar("action", {length: 50}).$type<AdminActivity>().notNull(),
    details: jsonb("details"),
    timestamp: timestamp("timestamp", {mode: 'string'}).defaultNow().notNull(),
});

export const insertActivitySchema = createInsertSchema(adminActivities)

export type InsertAdminActivity = z.infer<typeof insertActivitySchema>;
export type AdminActivityRecord = typeof adminActivities.$inferSelect;