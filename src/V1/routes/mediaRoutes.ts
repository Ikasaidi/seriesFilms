import { Router } from "express";
import {
  MediaController
} from "../controllers/mediaController";
import { authorizeRole } from "../middlewares/authMiddleWare";
import { validateMediaBody } from "../middlewares/validateMiddleWare";


const router = Router();
const mediaController = new MediaController();

router.get("/", mediaController.getListMedias);
router.get("/:id", mediaController.getTheMediaById);

router.post("/", authorizeRole("admin"), validateMediaBody, mediaController.createMedia);
router.put("/:id", authorizeRole("admin"), mediaController.putMedia);
router.delete("/:id", authorizeRole("admin"), mediaController.removeMedia);

export default router;