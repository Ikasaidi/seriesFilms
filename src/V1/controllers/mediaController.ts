import { Request, Response } from "express";
import { MediaService, MediaFilters } from "../services/mediaService";

const mediaService = new MediaService();

export class MediaController {
  //GET api/medias  , GET api/medias?type=serie&genre=drama&year=2020
  public async getListMedias(req: Request, res: Response): Promise<void> {
    const { genre, year } = req.query;
    const filters: MediaFilters = {};

    if (genre) filters.genre = String(genre);
    if (year) filters.year = Number(year);

    const items = await mediaService.listMedias(filters);
    res.json(items);
  }

  // GET api/medias/:id
  public async getTheMediaById(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id);
    const media = await mediaService.getMediaById(id);
    if (!media) {
      res.status(404).json({ error: "Media pas trouve" });
      return;
    }
    res.json(media);
  }

  // POST api/medias  (require Admin)
  public async createMedia(req: Request, res: Response): Promise<void> {
    const newMedia = await mediaService.addMedia(req.body);
    if (!newMedia) {
      res.status(409).json({ error: "Media deja existe" });
      return;
    }
    res.status(201).json(newMedia);
  }

  // PUT api/medias/:id  (require Admin)
  public async putMedia(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id);
    const update = await mediaService.updateMedia(id, req.body);
    if (!update) {
      res.status(404).json({ error: "Media pas trouvé" });
      return;
    }

    res.json(update);
  }

  // DELETE api/medias/:id  (require Admin)
  public async removeMedia(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id);

    const deleted = await mediaService.deleteMedia(id);
    if (!deleted) {
      res.status(404).json({ error: "Media pas trouve" });
      return;
    }
    res.json(deleted);
  }
}
