import {Router} from "express";
import { FilmController } from "../controllers/filmController";
import { validateFilmBody } from "../middlewares/validateMiddleWare";

// POST /films 
const router = Router();
const filmController = new FilmController();

router.post("/", validateFilmBody, filmController.createFilm);

export default router;