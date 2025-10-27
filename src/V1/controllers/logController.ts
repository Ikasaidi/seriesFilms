import { Request, Response } from "express";
import { getLastLog } from "../services/logService";

export class LogController {
    public getLogs(req: Request, res: Response): void {
        const logs = getLastLog();
        res.status(200).json(logs);
    }
}