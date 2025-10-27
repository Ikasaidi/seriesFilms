import { Schema, model } from "mongoose";
import { IUser } from "./interface/user.interface";
import {
  emailRegex,
  usernameRegex,
  nameRegex,
  passwordRegex,
} from "../utils/regex";
import { comparePassword } from "../utils/bcryptHelp";
import { hashPasswordMiddleware } from "../middlewares/user.mw";

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: [emailRegex, "Email invalide"],
      trim: true,
    },
    name: {
      type: String,
      required: true,
      match: [nameRegex, "Le nom ne doit contenir que des lettres et espaces"],
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      match: [
        usernameRegex,
        "Nom d'utilisateur invalide (3 - 30 caractères, alphanum + ._-).",
      ],
      trim: true,
    },
    password: {
      type: String,
      required: true,
      match: [
        passwordRegex,
        "Mot de passe trop faible (8+ caractères, maj, min, chiffre, symbole).",
      ],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    favorites: {
      movies: [{ type: Schema.Types.ObjectId, ref: "Movie" }],
      series: [{ type: Schema.Types.ObjectId, ref: "Series" }],
    },
  },
  { timestamps: true }
);

// ajoute le mw de haach avant chaque save
hashPasswordMiddleware(UserSchema);

// méthode  pour comparer mdp
UserSchema.methods.comparePassword = function (candidatePassword: string) {
  return comparePassword(candidatePassword, this.password);
};

export const User = model<IUser>("User", UserSchema);
