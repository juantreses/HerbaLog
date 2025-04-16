import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "../auth.ts";
import productCategoriesRouter from "./productCategories.ts";
import adminActivitiesRouter from "./adminActivities.ts";


export async function registerRoutes(app: Express): Promise<Server> {
    // set up authentication routes (login, register, logout, user info)
    setupAuth(app);

    app.use('/api/categories', productCategoriesRouter);
    app.use('/api/admin-activities', adminActivitiesRouter);

    return createServer(app);
}
