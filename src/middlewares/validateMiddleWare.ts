import { Request, Response, NextFunction } from "express";
import { reTitre, reDuration, currentYear, reStatut, normalizeStatus } from "../utils/validators";
import { logger } from "../utils/logger";

export function validateMediaBody(req: Request, res: Response, next: NextFunction) {
    const body = req.body ?? {};

    
    if (!body.titre) {
        logger.error("Validation échouée: titre manquant", { body });
        return res.status(400).json({ error: "Le champ title/titre est requis" });
    }

    const titre = String(body.titre).trim();
    if (!reTitre.test(titre)) {
        logger.error("Titre invalide", { titre });
        return res.status(400).json({ error: "Titre invalide. Il doit contenir au moins 1 caractère." });
    }

    const year = Number(body.year);
    if (!Number.isInteger(year)  || year > currentYear()) {
        logger.error("Année invalide", { year });
        return res.status(400).json({ error: "Année invalide. Elle doit être un entier et ne pas dépasser l'année en cours." });
    }

    if (typeof body.genre !== "string" || !body.genre.trim()) {
        logger.error("Genre invalide", { genre: body.genre });
        return res.status(400).json({ error: "Genre invalide. Il doit être une chaîne de caractères non vide." });
    }

    const rating = Number(body.rating);
    if (!Number.isFinite(rating) || rating < 0 || rating > 10) {
        logger.error("Note invalide", { rating });
        return res.status(400).json({ error: "Note invalide. Elle doit être un nombre entre 0 et 10." });
    }

    let type = String(body.type ?? "").toLowerCase();
    //déduire le type si non fourni
    if (!type) {
        if (body.duration !== undefined) type = "film";
        else if (body.status !== undefined) type = "serie";   
    }
    if (type !== "film" && type !== "serie") {
        logger.error("Type invalide", { type });
        return res.status(400).json({ error: "Type invalide. Il doit être 'film' ou 'serie'." });
    }

    if (type === "film") {
        const durationst = String(body.duration ?? "").trim();
        if (!reDuration.test(durationst)) {
            logger.error("Durée invalide", { duration : body.duration });
            return res.status(400).json({ error: "Durée invalide. Elle doit être au format 'HH:MM'." });
        }

        req.body = { ...body, type, titre, year, rating, duration: durationst };
    }

    else  {
        const status = normalizeStatus(body.status);
        if (!reStatut.test(status)) {
            logger.error("Statut invalide", { statusOriginal: body.status, statusNormalise: status });
            return res.status(400).json({ error: "Statut invalide. Il doit être 'en cours' ou 'terminée'." });
        }

        req.body = { ...body, type, titre, year, rating, status };
    }
    
    next();
}