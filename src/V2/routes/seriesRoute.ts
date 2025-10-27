// ===========================================================
// SERIES ROUTES
// - Liste, détail, création de séries
// ===========================================================
import { Router } from "express";
import { SeriesController } from "../controllers/seriesController";
import { authMiddleware } from "../middlewares/authMiddleWare";
import { roleMiddleware } from "../middlewares/roleMiddleware";

const router = Router();
const seriesController = new SeriesController();

// -----------------------------------------------------------
// ROUTES
// -----------------------------------------------------------

// -----------------------------------------------------------
// GET /api/v2/series
// - Lister les séries 
// -----------------------------------------------------------
router.get("/", seriesController.listSeries);

// -----------------------------------------------------------
// GET /api/v2/series/:id
// - Détails d’une série
// -----------------------------------------------------------
router.get("/:id", seriesController.getSeriesById);

// -----------------------------------------------------------
// POST /api/v2/series
// - Créer une série (admin)
// -----------------------------------------------------------
router.post("/", authMiddleware, roleMiddleware("admin"), seriesController.createSeries);

export default router;
