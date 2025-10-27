// ===========================================================
// SEASON ROUTES (imbriquées sous /series/:seriesId/seasons)
// - Création et liste des saisons d’une série
// ===========================================================
import { Router } from "express";
import { SeasonController } from "../controllers/seasonController";
import { authMiddleware } from "../middlewares/authMiddleWare";
import { roleMiddleware } from "../middlewares/roleMiddleware";

const router = Router();
const seasonController = new SeasonController();

// -----------------------------------------------------------
// ROUTES
// -----------------------------------------------------------

// -----------------------------------------------------------
// GET /api/v2/series/:seriesId/seasons
// - Lister les saisons d’une série
// -----------------------------------------------------------
router.get("/:seriesId/seasons", seasonController.getSeasons);

// -----------------------------------------------------------
// POST /api/v2/series/:seriesId/seasons
// - Créer une saison (admin)
// -----------------------------------------------------------
router.post("/:seriesId/seasons", authMiddleware, roleMiddleware("admin"), seasonController.createSeason);

export default router;
