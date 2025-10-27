// ===========================================================
// AUTH ROUTES
// - Inscription, Connexion, Promotion admin
// ===========================================================

import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { authMiddleware } from "../middlewares/authMiddleWare";
import {
  validateRegister,
  validateLogin,
} from "../middlewares/validateMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";

const router = Router();
const authController = new AuthController();

// -----------------------------------------------------------
// ROUTES
// -----------------------------------------------------------


// -----------------------------------------------------------
// POST /api/v2/auth/register
// - Crée un compte utilisateur
// -----------------------------------------------------------
router.post("/register", validateRegister, authController.register);

// -----------------------------------------------------------
// POST /api/v2/auth/login
// - Authentifie l’utilisateur ; renvoie un JWT
// -----------------------------------------------------------
router.post("/login", validateLogin, authController.login);

// -----------------------------------------------------------
// PATCH /api/v2/auth/:id/promote
// - Promotion d’un utilisateur en admin
// - Protégée: il faut être admin
// -----------------------------------------------------------
router.patch(
  "/promote/:id",
  authMiddleware,
  roleMiddleware("admin"),
  authController.promote
);

export default router;
