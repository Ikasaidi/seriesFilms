import { Request, Response } from "express";
import { EpisodeService } from "../services/episodeService";

const episodeService = new EpisodeService();

export class EpisodeController {
  //post /episodes
  public createNewEpisode = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { serieId, seasonNumber } = req.body;
    const newEpisode = await episodeService.addEpisode(
      serieId,
      seasonNumber,
      req.body
    );

    if (!newEpisode) {
      res.status(400).json({
        error: "Épisode non créé (série/saison introuvable ou dupliqué)",
      });
      return;
    }
    res.status(201).json(newEpisode);
  };

  // PATCH /episodes/:id
  public patchWatch = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { watched } = req.body;

    const ep = await episodeService.markWatched(String(id), Boolean(watched));
    if (!ep) {
      res.status(404).json({ error: "Épisode introuvable" });
      return;
    }
    res.json(ep);
  };
}
