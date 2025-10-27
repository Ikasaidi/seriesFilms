import { User } from "../models/user";
import { HttpException } from "../utils/http-exception";
import { comparePassword } from "../utils/bcryptHelp";
import { generateToken } from "../utils/jwtHelp";

// ===========================================================
// AUTH SERVICE
// - Inscription, Connexion, Promotion admin
// ===========================================================

export class AuthService {


  // ---------------------------------------------------------
  // REGISTER
  // - Crée un user si l'email n'existe pas encore
  // - 409 si email déjà utilisé
  // - Premier compte → admin sinon user
  // ---------------------------------------------------------
  async register(data: {
    email: string;
    name: string;
    username: string;
    password: string;
    role?: "user" | "admin";
  }) {
    const exists = await User.findOne({ email: data.email });
    if (exists) 
        throw new HttpException(409, "Cet email est déjà enregistré");

    //s’il y a déjà un admin dans la base
    const adminExists = await User.exists({ role: "admin" });

    const created = await User.create({
      email: data.email,
      name: data.name,
      username: data.username,
      password: data.password,
      // Si aucun admin existe, le premier compte devient admin
      role: adminExists ? "user" : "admin",
    });

    // retour sans password
    return {
      id: created._id,
      email: created.email,
      username: created.username,
      role: created.role,
    };
  }

  // ---------------------------------------------------------
  // LOGIN
  // - Vérifie email + mot de passe
  // - 401 si invalide, sinon renvoie un JWT + infos user
  // ---------------------------------------------------------
  async login(email: string, password: string) {

    const user = await User.findOne({ email });
    if (!user) 
        throw new HttpException(401, "Identifiants invalides");

    const ok = await comparePassword(password, user.password);
    if (!ok) 
        throw new HttpException(401, "Identifiants invalides");

    const token = generateToken({
      id: user._id,
      role: user.role,
      email: user.email,
    });

    return {
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    };
  }

  

  // ---------------------------------------------------------
  // PROMOTE → ADMIN
  // - Passe un user en admin
  // - 404 si user introuvable
  // ---------------------------------------------------------
  async promoteToAdmin(userId: string) {
    const user = await User.findById(userId);

    if (!user) 
        throw new HttpException(404, "Utilisateur introuvable");
    user.role = "admin";
    await user.save();

    return user;
  }
}

