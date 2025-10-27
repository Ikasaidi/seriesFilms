// ===========================================================
// MOVIE ROUTES
// - Liste, détail, création, update, suppression des films
// ===========================================================
import { Router } from "express";
import { MovieController } from "../controllers/movieController";

import { authMiddleware } from "../middlewares/authMiddleWare";
import { roleMiddleware } from "../middlewares/roleMiddleware";

const router = Router();
const movieController = new MovieController();

// -----------------------------------------------------------
// ROUTES
// -----------------------------------------------------------

// --- Public --- //
// -----------------------------------------------------------
// GET /api/v2/movies
// -----------------------------------------------------------

router.get("/", movieController.listMovies);

// -----------------------------------------------------------
// GET /api/v2/movies/:id
// -----------------------------------------------------------
router.get("/:id", movieController.getMovieById);


// --- Admin --- //

// -----------------------------------------------------------
// POST /api/v2/movies (admin)
// -----------------------------------------------------------
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  movieController.createMovie
);

// -----------------------------------------------------------
// PATCH /api/v2/movies/:id (admin)
// -----------------------------------------------------------
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  movieController.updateMovie
);

// -----------------------------------------------------------
// DELETE /api/v2/movies/:id (admin)
// -----------------------------------------------------------
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  movieController.deleteMovie
);

export default router;
