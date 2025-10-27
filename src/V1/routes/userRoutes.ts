import { Router } from "express";
import { UserController } from "../controllers/userController";


// GET /api/users/:id/medias
const router = Router();
const userController = new UserController();

router.get("/:id/medias", userController.getUserMedias);

export default router;
