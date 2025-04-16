import {Router} from 'express';
import {storage} from "../storage";

const adminActivitiesRouter = Router();

adminActivitiesRouter.get('/', async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
        const page = req.query.page ? parseInt(req.query.page as string) : 1;
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : 20;
        const adminActivities = await storage.adminActivities.get(page, pageSize);
        res.json(adminActivities);
    } catch (error) {
        console.error('Error fetching admin activities:', error);
        res.status(500).json({error: 'Interne fout.'});
    }
});

export default adminActivitiesRouter;
