import {adminActivities, AdminActivityRecord, InsertAdminActivity} from "@db/schema/admin/activities.ts";
import {db} from "@db/db.ts";
import {PublicUser, publicUserSchema, users} from "@db/schema/users/users.ts";
import {desc, eq} from "drizzle-orm";

export async function create(insertAdminActivity: InsertAdminActivity): Promise<AdminActivityRecord> {
    // @ts-ignore
    const [activity] = await db.insert(adminActivities).values({
        ...insertAdminActivity,
        details: insertAdminActivity.details || {}
    }).returning();

    return activity;
}

export async function get(page: number = 1, pageSize: number = 20): Promise<{
    activities: (AdminActivityRecord & { user: PublicUser })[],
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