import { Response, Request, NextFunction } from "express";
import { logger } from "../utils/logger";

export function reqLogger(req : Request, res: Response, next: NextFunction){
  logger.info(`${req.method} ${req.url}`);
  next();
};