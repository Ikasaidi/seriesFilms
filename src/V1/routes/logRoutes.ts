import { Router } from "express";
import { LogController } from "../controllers/logController";

const router = Router();
const logController = new LogController();

// GET /api/logs
router.get("/", logController.getLogs);

export default router;
