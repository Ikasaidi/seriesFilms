import { Request, Response, NextFunction } from "express";
import { MovieService } from "../services/movieService";
import { logger } from "../utils/logger";

const movieService = new MovieService();

// ===========================================================
// MOVIE CONTROLLER
// - Gère la lecture, création, mise à jour et suppression des films
// ===========================================================
export class MovieController {

  // ---------------------------------------------------------
  // ROUTE: GET /api/v2/movies
  // OBJET: lister les films avec filtres/query (pagination, etc.)
  // HTTP: 200 si succès
  // ---------------------------------------------------------
  listMovies = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await movieService.listMovies(req.query);
      logger.info("Liste des films consultée");
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  // ---------------------------------------------------------
  // ROUTE: GET /api/v2/movies/:id
  // OBJET: récupérer un film par son ID
  // HTTP: 400 si ID manquant ; 200 si trouvé
  // ---------------------------------------------------------

  getMovieById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ success: false, message: "ID manquant" });
      }
      const movie = await movieService.getMovieById(id);
      logger.info(`Affichag du film ${id}`);
      res.status(200).json({ success: true, movie });
    } catch (err) {
      next(err);
    }
  };

  // ---------------------------------------------------------
  // ROUTE: POST /api/v2/movies (admin)
  // OBJET: créer un film
  // HTTP: 201 si créé
  // ---------------------------------------------------------
  createMovie = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const movie = await movieService.createMovie(req.body);
      logger.info(`Nouveau film créé : ${movie.title}`);
      res.status(201).json({ success: true, movie });
    } catch (err) {
      next(err);
    }
  };

  // ---------------------------------------------------------
  // ROUTE: PATCH /api/v2/movies/:id (admin)
  // OBJET: modifier un film (partiellement)
  // HTTP: 400 si ID manquant ; 200 si succès 
  // ---------------------------------------------------------
  updateMovie = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ success: false, message: "ID manquant" });
      }
      const updated = await movieService.updateMovie(id, req.body);
      logger.info(`Film modifié : ${updated.title}`);
      res.status(200).json({ success: true, movie: updated });
    } catch (err) {
      next(err);
    }
  };

  // ---------------------------------------------------------
  // ROUTE: DELETE /api/v2/movies/:id (admin)
  // OBJET: supprimer un film
  // HTTP: 400 si ID manquant ; 204 si supprimé (ici) 
  // ---------------------------------------------------------
  deleteMovie = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ success: false, message: "ID manquant" });
      }
      await movieService.deleteMovie(id);
      logger.info(`Film supprimé ID=${req.params.id}`);
      res
        .status(204)
        .json({ success: true, message: "Film supprimé avec succès" });
    } catch (err) {
      next(err);
    }
  };
}
