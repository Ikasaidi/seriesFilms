import { Schema } from "mongoose";
import { IUser } from "../models/interface/user.interface";
import { hashPassword } from "../utils/bcryptHelp";

// ===========================================================
// USER HASH PASSWORD MIDDLEWARE (Mongoose)
// - Hash le mot de passe avant sauvegarde en base
// - Ne hash QUE si le champ "password" a changé
// ===========================================================
export const hashPasswordMiddleware = (schema: Schema<IUser>) => {
  schema.pre("save", async function (next) {
   
     // On ne re-hash pas si le password n’a pas été modifié
    if (!this.isModified("password")) return next();

    try {
      // Hash du mot de passe en utilisant bcrypt
      this.password = await hashPassword(this.password);
      next();
    } catch (err) {
      next(err as any);
    }
  });
};
