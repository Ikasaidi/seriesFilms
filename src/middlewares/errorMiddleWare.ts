import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";


export function errorMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
  logger.error(err.stack);
  res.status(500).json({ message: 'Une erreur est survenue', error: err.message });
};