import { Request, Response, NextFunction } from "express";
import { EpisodeService } from "../services/episodeService";
import { logger } from "../utils/logger";

// -----------------------------------------------------------
// INSTANCIATION DES SERVICES
// -----------------------------------------------------------
const episodeService = new EpisodeService();

// -----------------------------------------------------------
// CONTROLLER: EPISODES
// - Gère la création et la lecture des épisodes d'une saison
// -----------------------------------------------------------
export class EpisodeController {


  // ---------------------------------------------------------
  // ROUTE: POST /api/v2/series/:seriesId/seasons/:seasonId/episodes
  // OBJET: créer un épisode dans une saison donnée (admin)
  // HTTP: 201 si créé ; 400 si params manquants 
  // ---------------------------------------------------------
  createEpisode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { seriesId, seasonId } = req.params;

      // Validation minimale des paramètres d'URL
      if (!seriesId) {
        return res.status(400).json({ success: false, message: "ID serie manquant" });
      }

      if (!seasonId) {
        return res.status(400).json({ success: false, message: "ID season manquant" });
      }

      const episode = await episodeService.createEpisode(seriesId, seasonId, req.body);
      logger.info(`Épisode ajouté à la saison ${seasonId}`);
      res.status(201).json({ success: true, episode });
    } catch (err) {
      next(err);
    }
  };

  // ---------------------------------------------------------
  // ROUTE: GET /api/v2/series/:seriesId/seasons/:seasonId/episodes
  // OBJET: lister les épisodes d'une saison (filtrage possible via query)
  // HTTP: 200 si OK ; 400 si param manquant 
  // ---------------------------------------------------------
  getEpisodes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { seasonId } = req.params;

      if (!seasonId) {
        return res.status(400).json({ success: false, message: "ID season manquant" });
      }
      const episodes = await episodeService.getEpisodes(seasonId, req.query);
      
      logger.info(`Affichage des épisodes`);
      res.status(200).json({ success: true, episodes });
    } catch (err) {
      next(err);
    }
  };
}
