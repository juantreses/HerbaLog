import pg from 'pg';
import * as schema from "./schema/users/users.ts";
import { drizzle } from 'drizzle-orm/node-postgres';

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
    throw new Error(
        "DATABASE_URL must be set. Did you forget to provision a database?",
    );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema }); 