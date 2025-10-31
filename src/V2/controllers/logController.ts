import { Request, Response } from "express";
import { getLastLog } from "../services/logService";
import { logger } from "../utils/logger";

export class LogController {
  public getLogs(req: Request, res: Response): void {
    const logs = getLastLog();
    logger.info('Affichage de log')
    res.status(200).json(logs);
  }
}
