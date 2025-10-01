import { Router } from "express";
import { SerieController } from "../controllers/serieController";
import { validateMediaBody } from "../middlewares/validateMiddleWare";

const router = Router();
const serieController = new SerieController();


router.post("/",  validateMediaBody, serieController.createNewSerie);
router.get("/:id/episodes", serieController.getEpisodesFromASerie);

export default router;