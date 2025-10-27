import { Router } from "express";
import { EpisodeController } from "../controllers/episodeController";
import { validateEpisodeBody, validateEpisodeWatched } from "../middlewares/validateMiddleWare";

const router = Router();
const episodeController = new EpisodeController();

router.post("/", validateEpisodeBody, episodeController.createNewEpisode);
router.patch("/:id", validateEpisodeWatched, episodeController.patchWatch);

export default router;
