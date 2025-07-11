import {pgTable, varchar, timestamp, json} from "drizzle-orm/pg-core";

export const session = pgTable('session', {
    sid: varchar("sid").notNull().primaryKey(),
    sess: json("sess").notNull(),
    expire: timestamp('expire', {precision: 6}).notNull(),
});