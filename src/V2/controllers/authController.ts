import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/authService";
import { logger } from "../utils/logger";
import { HttpException } from "../utils/http-exception";

// -----------------------------------------------------------
// INSTANCIATION DES SERVICES
// -----------------------------------------------------------
const authService = new AuthService();

// -----------------------------------------------------------
// CONTROLLER: AUTH
// - Gère l'inscription, la connexion et la promotion en admin
// -----------------------------------------------------------
export class AuthController {

  // ---------------------------------------------------------
  // ROUTE: POST /api/v2/auth/register
  // OBJET: créer un nouvel utilisateur
  // HTTP: 201 si créé ; erreurs remontées au middleware
  // ---------------------------------------------------------
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {

      // On récupère les champs du body 
      const { email, name, username, password, role } = req.body;

      // Appel du service: crée l'utilisateur
      const user = await authService.register({
        email,
        name,
        username,
        password,
        role,
      });

      logger.info(`Utilisateur créé : ${email}`);

      res.status(201).json({ success: true, user });
    } catch (err) {
      next(err);
    }
  };

  // ---------------------------------------------------------
  // ROUTE: POST /api/v2/auth/login
  // OBJET: authentifier un utilisateur et renvoyer un JWT
  // HTTP: 200 si OK ; 401 si identifiants invalides
  // ---------------------------------------------------------

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const { email, password } = req.body;

      // Le service vérifie email + password et génère le token
      const { token, user } = await authService.login(email, password);

      logger.info(`Connexion réussie : ${email}`);
      res.status(200).json({ success: true, token, user });

    } catch (err) {
      next(err);
    }
  };

  
  // ---------------------------------------------------------
  // ROUTE: PATCH /api/v2/auth/:id/promote
  // OBJET: promouvoir un utilisateur en admin
  // HTTP: 200 si succès ; 400 si id manquant 
  // ---------------------------------------------------------
 
  promote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    if (!id) {
      throw new HttpException(400, "L'ID de l'utilisateur est requis");
    }

    const user = await authService.promoteToAdmin(id);
    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

}
