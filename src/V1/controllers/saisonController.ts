import { Request, Response } from "express";
import { SaisonService } from "../services/saisonService";

const saisonService = new SaisonService();

export class SaisonController {
  // POST /saisons
  public createNewSeason = async (req: Request, res: Response): Promise<void> => {
    const { serieId, seasonNumber, releaseYear } = req.body;
    const season = await saisonService.addSeason(
      String(serieId),
      Number(seasonNumber),
      Number(releaseYear)
    );

    if (!season) {
      res
        .status(400)
        .json({
          error: "Saison non créée (série introuvable ou saison existante)",
        });
      return;
    }
    res.status(201).json(season);
  }
}
