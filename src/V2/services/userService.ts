import { User } from "../models/user";
import { HttpException } from "../utils/http-exception";

// ===========================================================
// USER SERVICE
// - Lecture / mise à jour d’un utilisateur
// ===========================================================
export class UserService {

  // ---------------------------------------------------------
  // READ BY ID
  // - 404 si introuvable
  // - select("-password") pour ne jamais renvoyer le hash
  // ---------------------------------------------------------
  async getUserById(id: string) {

    const user = await User.findById(id).select("-password");
    if (!user) throw new HttpException(404, "Utilisateur introuvable");

    return user;
  }

  // ---------------------------------------------------------
  // UPDATE BY ID
  // - Autorise seulement certains champs 
  // - 422 si aucune donnée valide 
  // ---------------------------------------------------------
  async updateUserById(id: string, updates: any) {

    const allowed = ["username", "favorites"];
    const updateData: any = {};

    for (const key of allowed) {
      if (updates[key] !== undefined) updateData[key] = updates[key];
    }

    if (Object.keys(updateData).length === 0) {
      throw new HttpException(422, "Aucune donnée valide à mettre à jour");
    }

    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    }).select("-password");

    if (!user) 
        throw new HttpException(404, "Utilisateur introuvable");

    return user;
  }
}
