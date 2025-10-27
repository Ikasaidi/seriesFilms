import { Request, Response, NextFunction } from "express";
import { SeasonService } from "../services/seasonService";
import { logger } from "../utils/logger";

const seasonService = new SeasonService();

// ===========================================================
// SEASON CONTROLLER
// - Gère la création et la lecture des saisons d’une série
// ===========================================================
export class SeasonController {
  
  // ---------------------------------------------------------
  // ROUTE: POST /api/v2/series/:seriesId/seasons (admin)
  // OBJET: créer une saison pour une série donnée
  // HTTP: 400 si seriesId manquant ; 201 si créé ; 404 si série introuvable 
  // ---------------------------------------------------------
  createSeason = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { seriesId } = req.params;

      if (!seriesId) {
        return res.status(400).json({ success: false, message: "ID serie manquant" });
      }
      
      const season = await seasonService.createSeason(seriesId, req.body);
      logger.info(`Nouvelle saison créée pour la série ${seriesId}`);
      res.status(201).json({ success: true, season });
    } catch (err) {
      next(err);
    }
  };

 // ---------------------------------------------------------
  // ROUTE: GET /api/v2/series/:seriesId/seasons
  // OBJET: lister les saisons d’une série
  // HTTP: 400 si seriesId manquant ; 200 si OK 
  // ---------------------------------------------------------
  getSeasons = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { seriesId } = req.params;

      if (!seriesId) {
        return res.status(400).json({ success: false, message: "ID serie manquant" });
      }

      const seasons = await seasonService.getSeasonsBySeries(seriesId);
      res.status(200).json({ success: true, seasons });
    } catch (err) {
      next(err);
    }
  };
}
