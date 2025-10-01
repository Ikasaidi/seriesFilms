import { Request, Response, NextFunction } from "express";
import { UserRole } from "../models/User";

//Pour certaine methodes qui veulent admin
export function authorizeRole(role: UserRole) {
    return (req: Request & {user?: any}, res: Response, next: NextFunction) => {
        
        //le mettre sur le header pour postman
        const headerRole = String(req.headers["x-role"] || "").toLowerCase();

        if (headerRole !== role) {
            return res.status(403).json({ error: "Accès refusé" });
        }
        next();
    };
}