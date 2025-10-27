import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/userService";

const userService = new UserService();
//GET /api/users/:id/medias

export class UserController {
    
public async getUserMedias(req: Request, res: Response): Promise<void> {

    const userId = String(req.params.id);
    const medias = await userService.getMediaByUserId(userId);

    if (!medias) {
      res.status(404).json({ error: "Médias non trouvés" });
      return;
    }

    res.json(medias);
  };
}
