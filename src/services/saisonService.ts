import { logger } from "../utils/logger";
import { DataService, DBShape } from "./DataService";

export class SaisonService {
  private dataService = new DataService();

  // POST /seasons — ajouter une saison à une série
  public async addSeason(serieId: string, seasonNumber: number, releaseYear: number) {
    try {
      const bd = await this.dataService.readBD();
      const items = bd.medias as any[];

      const serie = items.find(m => m.id === serieId);
      if (!serie) {
        logger.warn("Série introuvable", { serieId });
        return null;
      }

      // s'assure que c'est une série 
      serie.saisons = Array.isArray(serie.saisons) ? serie.saisons : [];

        // vérifier si la saison existe déjà
      const exists = serie.saisons.find((s: any) => Number(s.seasonNumber) === Number(seasonNumber));
      if (exists) {
        logger.warn("La saison existe déjà", { serieId, seasonNumber });
        return null;
      }

      const saison = {
        seasonNumber: Number(seasonNumber),
        releaseDate: new Date(Number(releaseYear), 0, 1).toISOString(),
        episodes: [] as any[],
      };

      serie.saisons.push(saison);
      await this.dataService.writeBD(bd as DBShape);

      logger.info("Saison ajoutée", { serieId, seasonNumber });
      return saison;
    } catch (error: any) {
      logger.error("Erreur addSeason", { serieId, seasonNumber, msg: error?.message });
      return null;
    }
  }
}
