import {storage} from "../storage.ts";
import {AdminActivity} from "@shared/db/schema/admin_activity.ts";

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
    await storage.createAdminActivity({
        userId,
        action,
        details: JSON.stringify(details),
        timestamp: new Date()
    })
}