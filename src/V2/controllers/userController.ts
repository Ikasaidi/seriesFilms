import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/userService";
import { logger } from "../utils/logger";

const userService = new UserService();

// ===========================================================
// USER CONTROLLER
// - Gère les opérations liées à l’utilisateur (profil, consultation, mise à jour)
// ===========================================================
export class UserController {
  
  // ---------------------------------------------------------
  // ROUTE: GET /api/v2/users/me
  // OBJET: récupérer le profil de l’utilisateur courant
  // HTTP: 200 si OK 
  // ---------------------------------------------------------
  me = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Le middleware d’auth doit injecter l’utilisateur dans req.user
      const currentUser = (req as any).user;
      const user = await userService.getUserById(currentUser.id);
      res.status(200).json({ success: true, user });
    } catch (err) {
      next(err);
    }
  };

  // ---------------------------------------------------------
  // ROUTE: GET /api/v2/users/:id  (réservé admin)
  // OBJET: consulter un utilisateur par son ID
  // HTTP: 200 si trouvé 
  // ---------------------------------------------------------
  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id  = req.params.id as string;
      const user = await userService.getUserById(id);
      logger.info(`Consultation du profil userId=${id}`);
      res.status(200).json({ success: true, user });
    } catch (err) {
      next(err);
    }
  };

  // ---------------------------------------------------------
  // ROUTE: PATCH /api/v2/users/me
  // OBJET: modifier le profil de l’utilisateur courant
  // HTTP: 200 si succès 
  // --------------------------------------------------------- 

  updateMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const currentUser = (req as any).user;
      const updated = await userService.updateUserById(currentUser.id, req.body);
      logger.info(`Mise à jour du profil userId=${currentUser.id}`);
      res.status(200).json({ success: true, user: updated });
    } catch (err) {
      next(err);
    }
  }
}
