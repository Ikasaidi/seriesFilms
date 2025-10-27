import { Request, Response, NextFunction } from "express";
import { HttpException } from "../utils/http-exception";

// ===========================================================
// VALIDATION MIDDLEWARES (REGISTER / LOGIN / USER UPDATE)
// - Valident rapidement la présence de champs requis
// ===========================================================


// -----------------------------------------------------------
// REGISTER: email, username, password requis
// HTTP: 400 (param manquant) 
// -----------------------------------------------------------
export const validateRegister = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const { email, username, password } = req.body;
  if (!email || !username || !password)
    return next(new HttpException(400, "Champs manquants pour l'inscription"));
  next();
};

// -----------------------------------------------------------
// LOGIN: email + password requis
// -----------------------------------------------------------
export const validateLogin = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new HttpException(400, "Email et mot de passe requis"));
  next();
};

// -----------------------------------------------------------
// UPDATE USER: au moins un champ, et favorites doit être un array si présent
// HTTP: 400 ici (champ manquant) ; pour un schéma invalide → 422 côté service
// -----------------------------------------------------------
export const validateUserUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, favorites } = req.body;

  // qu’il y a au moins un champ à modifier
  if (!username && !favorites) {
    throw new HttpException(400, "Aucun champ à mettre à jour");
  }

  // Vérifie favorites doit etre un tab
  if (favorites && !Array.isArray(favorites)) {
    throw new HttpException(400, "Favorites doit être un tableau");
  }

  next();
};
