import { Request, Response, NextFunction } from "express";
import { SeriesService } from "../services/seriesService";
import { logger } from "../utils/logger";

const seriesService = new SeriesService();

// ===========================================================
// SERIES CONTROLLER
// - Gère la lecture et la création des séries
// ===========================================================
export class SeriesController {
  
  // ---------------------------------------------------------
  // ROUTE: GET /api/v2/series
  // OBJET: lister les séries (avec filtres éventuels via req.query)
  // HTTP: 200 si succès
  // ---------------------------------------------------------
  listSeries = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const series = await seriesService.listSeries(req.query);

      logger.info("Liste des séries consultée");
      res.status(200).json({ success: true, series });
    } catch (err) {
      next(err);
    }
  };

  // ---------------------------------------------------------
  // ROUTE: GET /api/v2/series/:id
  // OBJET: récupérer une série par son identifiant
  // HTTP: 400 si ID manquant ; 200 si trouvée 
  // ---------------------------------------------------------
  getSeriesById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ success: false, message: "ID manquant" });
      }

      const series = await seriesService.getSeriesById(id);

      res.status(200).json({ success: true, series });
    } catch (err) {
      next(err);
    }
  };

  // ---------------------------------------------------------
  // ROUTE: POST /api/v2/series (admin)
  // OBJET: créer une nouvelle série
  // HTTP: 201 si créée 
  // ---------------------------------------------------------
  createSeries = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const created = await seriesService.createSeries(req.body);

      logger.info(`Nouvelle série créée : ${created.title}`);
      res.status(201).json({ success: true, series: created });
    } catch (err) {
      next(err);
    }
  };
}
