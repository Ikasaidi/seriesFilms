import { Request, Response } from "express";
import { EpisodeService } from "../services/episodeService";

const episodeService = new EpisodeService();

export class EpisodeController {
  //post /episodes
  public createNewEpisode = async (
    req: Request,
    res: Response
  ): Promise<void> => {

    // On récupère les infos nécessaires depuis le corps de la requête
    const { serieId, seasonNumber } = req.body;

    // On demande au service d'ajouter l'épisode
    const newEpisode = await episodeService.addEpisode(
      serieId,
      seasonNumber,
      req.body
    );
    
    // Si l'épisode n'a pas pu être créé (série/saison introuvable ou doublon)

    if (!newEpisode) {
      res.status(400).json({
        error: "Épisode non créé (série/saison introuvable ou dupliqué)",
      });
      return;
    }
    res.status(201).json(newEpisode);
  };

  // PATCH /episodes/:id
  // Cette méthode permet de modifier le statut "vu" d'un épisode
  public patchWatch = async (req: Request, res: Response): Promise<void> => {
    
    // On récupère l'id de l'épisode depuis les paramètres de la requête
    const { id } = req.params;
    // On récupère le statut "vu" depuis le corps de la requête
    const { watched } = req.body;

    // On demande au service de mettre à jour le statut "vu"
    const ep = await episodeService.markWatched(String(id), Boolean(watched));

    // Si l'épisode n'a pas été trouvé, on retourne une erreur 404
    if (!ep) {
      res.status(404).json({ error: "Épisode introuvable" });
      return;
    }
    res.json(ep);
  };
}
