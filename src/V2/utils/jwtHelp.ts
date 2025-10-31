// ===========================================================
// JWT HELP
// - Générer et vérifier des tokens JWT
// ===========================================================
import jwt, { SignOptions, Secret } from "jsonwebtoken";
import config from "config";
import { HttpException } from "../utils/http-exception";
import ms from "ms"; //pour typer correctement les durées

// Secret + durée depuis variables d'env (ou config)
const JWT_SECRET: Secret =
  (config.get<string>("security.jwt.secret") || process.env.JWT_SECRET) as string ;

const JWT_EXPIRES_IN =
  (config.get<string>("security.jwt.expiresIn") || process.env.JWT_EXPIRES_IN || "1h") as ms.StringValue;


// -----------------------------------------------------------
// GÉNÉRER un token
// -----------------------------------------------------------
export const generateToken = (payload: object): string => {
  try {
    const options: SignOptions = { expiresIn: JWT_EXPIRES_IN };
    return jwt.sign(payload, JWT_SECRET, options);
  } catch (err) {
    throw new HttpException(500, "Erreur lors de la génération du token JWT");
  }
};

// -----------------------------------------------------------
// VÉRIFIER / décoder un token
// -----------------------------------------------------------
export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new HttpException(401, "Token invalide ou expiré");
  }
};
