import { Request, Response, NextFunction } from "express";
import { regexId, regexTitre, regexYear, regexRating } from "../utils/validators";

//version plus simple et ya pas type 

export function validateMediaBody(req: Request, res: Response, next: NextFunction) {
  const { id, titre, year, rating } = req.body;

  
  if (typeof id !== "string" || id.trim() === "" || !regexId.test(id)) {
    return res.status(400).json({ error: "id invalide" });
  }

  if (typeof titre !== "string" || titre.trim() === "") {
    return res.status(400).json({ error: "title est requis" });
  }

  if (!regexTitre.test(titre)) {
    return res.status(400).json({ error: "titre invalide" });
  }

  if (year === undefined || year === null || !regexYear.test(String(year))) {
    return res.status(400).json({ error: "année invalide (format attendu: 4 chiffres)" });
  }
  const currentYear = new Date().getFullYear();
  if (Number(year) > currentYear) {
    return res.status(400).json({ error: `année invalide (doit être ≤ ${currentYear})` });
  }

  
  if (rating === undefined || rating === null || !regexRating.test(String(rating))) {
    return res.status(400).json({ error: "rating invalide (0 à 10)" });
  }

  next();
}

export function validateFilmBody(req: Request, res: Response, next: NextFunction) {

  //prendre la méthode valideMediaBody  mais juste rajouter duration
  validateMediaBody(req, res, (error?: any) => {
    if (error) {
      return next(error); // Si une erreur a été envoyée, on arrête 
    }
  

  const { duration } = req.body;
  const dura = Number(duration);

  if (!Number.isFinite(dura) || dura <= 0) {
    return res.status(400).json({ error: "duration invalide (doit être un nombre positif)" });
  }

  next();
});
}

export function validateSerieBody(req: Request, res: Response, next: NextFunction) {
  validateMediaBody(req, res, (error?: any) => {
    if (error) {
      return next(error); 
    }

    const { saison, episodes } = req.body;

    
    const sai = Number(saison);
    if (!Number.isInteger(sai) || sai < 1) {
      return res.status(400).json({ error: "saison invalide (entier positif requis)" });
    }

   
    const ep = Number(episodes);
    if (!Number.isInteger(ep) || ep < 1) {
      return res.status(400).json({ error: "episodes invalide (entier positif requis)" });
    }


    next();
  });
}

export function validateSaisonBody(req: Request, res: Response, next: NextFunction) {
  const { serieId, seasonNumber, releaseYear } = req.body;

  if (!serieId || typeof serieId !== "string") {
    return res.status(400).json({ error: "serieId invalide" });
  }

  const sNum = Number(seasonNumber);
  if (!Number.isInteger(sNum) || sNum < 1) {
    return res.status(400).json({ error: "seasonNumber invalide (entier positif)" });
  }

  const rYear = Number(releaseYear);
  const current = new Date().getFullYear();
  if (!Number.isInteger(rYear) || String(rYear).length !== 4 || rYear > current) {
    return res.status(400).json({ error: `releaseYear invalide (YYYY ≤ ${current})` });
  }

  next();
}

export function validateEpisodeWatched(req: Request, res: Response, next: NextFunction) {
  const { watched } = req.body;
  if (typeof watched !== "boolean") {
    return res.status(400).json({ error: "watched doit être un booléen" });
  }
  next();
}

export function validateEpisodeBody(req: Request, res: Response, next: NextFunction) {
  const { serieId, seasonNumber, id, titre, episodeNumber, duration } = req.body;

  if (!serieId || typeof serieId !== "string") {
    return res.status(400).json({ error: "serieId invalide" });
  }

  if (!regexId.test(String(id))) {
    return res.status(400).json({ error: "id invalide" });
  }

  if (!regexTitre.test(String(titre))) {
    return res.status(400).json({ error: "titre invalide" });
  }

  const sNum = Number(seasonNumber);
  if (!Number.isInteger(sNum) || sNum < 1) {
    return res.status(400).json({ error: "seasonNumber invalide (entier positif)" });
  }

  const eNum = Number(episodeNumber);
  if (!Number.isInteger(eNum) || eNum < 1) {
    return res.status(400).json({ error: "episodeNumber invalide (entier positif)" });
  }

  if (duration !== undefined) {
    const dura = Number(duration);
    if (!Number.isFinite(dura) || dura < 0) {
      return res.status(400).json({ error: "duration invalide (nombre positif requis)" });
    }
  }

  next();
}

