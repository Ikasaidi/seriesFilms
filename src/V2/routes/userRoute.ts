// ===========================================================
// USER ROUTES
// - Profil courant, lecture d’un user, modification du profil
// ===========================================================

import { Router } from "express";
import { UserController } from "../controllers/userController";

import { authMiddleware } from "../middlewares/authMiddleWare";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { validateUserUpdate } from "../middlewares/validateMiddleware";

const router = Router();
const userController = new UserController();

// -----------------------------------------------------------
// ROUTES
// -----------------------------------------------------------

// -----------------------------------------------------------
// GET /api/v2/users/me
// - Récupérer le profil de l’utilisateur connecté
// -----------------------------------------------------------
router.get("/me", authMiddleware, userController.me);



// -----------------------------------------------------------
// PATCH /api/v2/users/me
// - Modifier son propre profil
// -----------------------------------------------------------
router.patch(
  "/me",
  authMiddleware,
  validateUserUpdate,
  userController.updateMe
);

// -----------------------------------------------------------
// GET /api/v2/users/:id
// - Consultation d’un utilisateur par ID 
// -----------------------------------------------------------
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  userController.getUserById
);

export default router;
