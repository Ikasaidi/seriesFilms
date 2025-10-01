import { DataService, DBShape } from "./DataService";
import { logger } from "../utils/logger";
import { Serie, statusType } from "../models/Serie";

export class SerieService{
  private dataService = new DataService();

  private EnStatus(v: any): statusType {
    return v === "Terminée" || v === "En cours" ? v : "En cours";
  }

 public async getEpisodesBySerieId(serieId: string): Promise<any[] | null> {
    try {
      const bd = await this.dataService.readBD();
      const items = (bd.medias as any[]) || [];

      // on trouve la serie par le tab
      const serie = items.find(m => m.id === serieId && Array.isArray(m.saisons));
      if (!serie) {
        logger.warn("Série introuvable", { id: serieId });
        return null;
      }

      const saisons = Array.isArray(serie.saisons) ? serie.saisons : [];
      const episodes = saisons.flatMap((s: any) => Array.isArray(s.episodes) ? s.episodes : []);

      logger.info("Épisodes listés pour la série", { id: serieId, count: episodes.length });
      return episodes;
    } catch (error: any) {
      logger.error("Erreur getEpisodesBySerieId", { id: serieId, error: error.message });
      return null;
    }
  }

  public async createSerie(serieData: any): Promise<Serie | null> {
    try { 
      const bd = await this.dataService.readBD();
      bd.medias = bd.medias || [];

  // doublon id
  if (bd.medias.some((m: any) => m.id === serieData.id)) {
    logger.error("Série existe déjà", { id: serieData.id });
    throw new Error("Série existe déjà");
  }

   
      const newSerie = new Serie(
        String(serieData.id),
        String(serieData.titre),
        String(serieData.genre),
        Number(serieData.year),
        Number(serieData.rating),
        this.EnStatus(serieData.statusType),
        []  // pas de saisons au début
      );
  
  bd.medias.push(newSerie);
  await this.dataService.writeBD(bd);
  logger.info("Série créée", { id: newSerie.id, titre: newSerie.titre });
  return newSerie;
} catch (error: any) {
      logger.error("Erreur createSerie", { id: serieData?.id, error: error.message });
      return null;
    }

}
}



