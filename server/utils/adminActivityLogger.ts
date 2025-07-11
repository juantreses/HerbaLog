import {AdminActivity} from "@db/schema/admin/activities.ts";
import {storage} from "../storage";

type AdminActivityParams = {
    userId: number;
    action: AdminActivity;
    details: any;
}

export async function recordAdminActivity({
                                              userId,
                                              action,
                                              details,
                                          }: AdminActivityParams) {
    await storage.adminActivities.create({
        userId,
        action,
        details: JSON.stringify(details),
    })
}