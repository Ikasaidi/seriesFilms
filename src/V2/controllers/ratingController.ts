import { Request, Response, NextFunction } from "express";
import { RatingService } from "../services/ratingService";

const ratingService = new RatingService();

// ===========================================================
// RATING CONTROLLER
// - Gère la création d’un rating et le calcul des moyennes
// ===========================================================
export class RatingController {

  // ---------------------------------------------------------
  // ROUTE: POST /api/v2/ratings
  // OBJET: créer une note (rating) pour un film/épisode
  // HTTP: 401 si non authentifié ; 201 si créé 
  // ---------------------------------------------------------
  async create(req: Request, res: Response, next: NextFunction) {
      try {
    // Récupération de l’ID utilisateur depuis le token
    const userId = (req as any).user?._id || (req as any).user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Utilisateur non authentifié" });
    }

    // Création du rating
    const rating = await ratingService.createRating(userId, req.body);

    res.status(201).json({ success: true, rating });
  } catch (err) {
    next(err);
  }
  }

  /// ---------------------------------------------------------
  // ROUTE: GET /api/v2/ratings/movie/:movieId/average
  // OBJET: moyenne des notes d’un film
  // HTTP: 200 si OK 
  // ---------------------------------------------------------
  async getMovieAverage(req: Request, res: Response, next: NextFunction) {
    try {
        const movieId = req.params.movieId as string
      const result = await ratingService.getMovieAverage(movieId);
      res.status(200).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

 // ---------------------------------------------------------
  // ROUTE: GET /api/v2/ratings/series/:seriesId/average
  // OBJET: moyenne des notes sur tous les épisodes d’une série
  // HTTP: 200 si OK 
  // ---------------------------------------------------------
  async getSeriesAverage(req: Request, res: Response, next: NextFunction) {
    try {
        const seriesId = req.params.seriesId as string ;
        
      const result = await ratingService.getSeriesAverage(seriesId);
      
      res.status(200).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }
}
