// ===========================================================
// EPISODE ROUTES (imbriquées sous /series/:seriesId/seasons/:seasonId/episodes)
// - Création et liste des épisodes d’une saison
// ===========================================================
import { Router } from "express";
import { EpisodeController } from "../controllers/episodeController";
import { authMiddleware } from "../middlewares/authMiddleWare";
import { roleMiddleware } from "../middlewares/roleMiddleware";

const router = Router();
const episodeController = new EpisodeController();

// -----------------------------------------------------------
// ROUTES
// -----------------------------------------------------------

// -----------------------------------------------------------
// POST /api/v2/series/:seriesId/seasons/:seasonId/episodes
// - Créer un épisode (admin)
// -----------------------------------------------------------
router.post("/:seriesId/seasons/:seasonId/episodes", authMiddleware, roleMiddleware("admin"), episodeController.createEpisode);

// -----------------------------------------------------------
// GET /api/v2/series/:seriesId/seasons/:seasonId/episodes
// - Lister les épisodes de la saison
// -----------------------------------------------------------
router.get("/:seriesId/seasons/:seasonId/episodes", episodeController.getEpisodes);

export default router;
