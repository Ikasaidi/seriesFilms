import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";
import { HttpException } from "../utils/http-exception";

// ===========================================================
// ERROR MIDDLEWARE
// - Uniformise la réponse d'erreur HTTP
// - Log l'erreur côté serveur
// ===========================================================
export function errorMiddleware(
  err: Error | HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) {

  // ---------------------------------------------------------
  // 1) Statut + message par défaut
  // ---------------------------------------------------------
  const status = (err as HttpException).status || 500;
  const message = err.message || "Erreur interne du serveur";

  // ---------------------------------------------------------
  // 2) Logging côté serveur (utile pour le debug et l’audit)
  // ---------------------------------------------------------
  logger.error(`[${req.method}] ${req.path} → ${status} : ${message}`);

  // ---------------------------------------------------------
  // 3) Réponse JSON standardisée
  // ---------------------------------------------------------
  res.status(status).json({
    success: false,
    status,
    message,
  });
}
