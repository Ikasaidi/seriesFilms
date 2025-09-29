import { Router } from "express";
import {
  getListMedias,
  getTheMediaById,
  createMedia,
  putMedia,
  removeMedia
} from "../controllers/mediaController";
import { authorizeRole } from "../middlewares/authMiddleWare";
import { validateMediaBody } from "../middlewares/validateMiddleWare";


const router = Router();

router.get("/", getListMedias);
router.get("/:id", getTheMediaById);

router.post("/", authorizeRole("admin"), validateMediaBody, createMedia);
router.put("/:id", authorizeRole("admin"), putMedia);
router.delete("/:id", authorizeRole("admin"), removeMedia);

export default router;