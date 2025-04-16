// server/middleware/requireAdmin.ts
import { Request, Response, NextFunction } from 'express';
import {Role} from "@shared/roles.ts";

export default function requireAdmin(req: Request, res: Response, next: NextFunction) {
    const user = req.user;

    if (!user || user.role !== Role.ADMIN) {
        return res.status(403).json({ error: 'Toegang geweigerd. Admin vereist.' });
    }

    next();
}
