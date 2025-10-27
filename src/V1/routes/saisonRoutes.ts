import { Router } from "express";
import { SaisonController } from "../controllers/saisonController";
import { validateSaisonBody } from "../middlewares/validateMiddleWare"; // ci-dessous

const router = Router();
const saisonController = new SaisonController();

// POST /saisons
router.post("/", validateSaisonBody, saisonController.createNewSeason);

export default router;
