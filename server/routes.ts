import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";


export async function registerRoutes(app: Express): Promise<Server> {
    // set up authentication routes (login, register, logout, user info)
    setupAuth(app);
    return createServer(app);
}
