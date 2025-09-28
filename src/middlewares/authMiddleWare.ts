import { Request, Response, NextFunction } from "express";
import { UserRole } from "../models/User";

//Pour certaine methodes qui veulent admin
export function authorizeRole(role: UserRole) {
    return (req: Request & {user?: any}, res: Response, next: NextFunction) => {
        
        if (!req.user) {
            return res.status(401).json({ error: "Non authentifié" });
        }

        if (req.user.role !== role) {
            return res.status(403).json({ error: "Accès refusé" });
        }
        next();
    };
}