// ===========================================================
// RATING ROUTES
// - Création d’un rating, moyennes film/série
// ===========================================================
import { Router } from "express";
import { RatingController } from "../controllers/ratingController";
import { authMiddleware } from "../middlewares/authMiddleWare";

const router = Router();
const ratingController = new RatingController();

// -----------------------------------------------------------
// ROUTES
// -----------------------------------------------------------

// -----------------------------------------------------------
// POST /api/v2/ratings
// - Créer une note (il faut être connecté)
// -----------------------------------------------------------
router.post("/", authMiddleware, ratingController.create);


// -----------------------------------------------------------
// GET /api/v2/ratings/movie/:movieId/average
// -----------------------------------------------------------
router.get("/avg/movie/:movieId", ratingController.getMovieAverage);


// -----------------------------------------------------------
// GET /api/v2/ratings/series/:seriesId/average
// -----------------------------------------------------------
router.get("/avg/series/:seriesId", ratingController.getSeriesAverage);

export default router;
