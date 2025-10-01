import { DataService, DBShape } from "./dataService";
import { logger } from "../utils/logger";
import { Serie, statusType } from "../models/Serie";

export class SerieService {
  private dataService = new DataService();

  // Méthode privée pour valider le statut d'une série
  private EnStatus(v: any): statusType {
    // Si le statut est "Terminée" ou "En cours", on le garde,
    // sinon on met "En cours" par défaut
    return v === "Terminée" || v === "En cours" ? v : "En cours";
  }

  public async getEpisodesBySerieId(serieId: string): Promise<any[] | null> {
    try {
      const bd = await this.dataService.readBD();
      const items = (bd.medias as any[]) || [];

      // on trouve la serie par le tableau de saisons
      const serie = items.find(
        (m) => m.id === serieId && Array.isArray(m.saisons)
      );
      if (!serie) {
        logger.warn("Série introuvable", { id: serieId });
        return null;
      }

      // On récupère toutes les saisons de la série
      const saisons = Array.isArray(serie.saisons) ? serie.saisons : [];

      // On récupère tous les épisodes de toutes les saisons
      const episodes = saisons.flatMap((s: any) =>
        Array.isArray(s.episodes) ? s.episodes : []
      );

      logger.info("Épisodes listés pour la série", {
        id: serieId,
        count: episodes.length,
      });
      return episodes;
    } catch (error: any) {
      logger.error("Erreur getEpisodesBySerieId", {
        id: serieId,
        error: error.message,
      });
      return null;
    }
  }

  public async createSerie(serieData: any): Promise<Serie | null> {
    try {
      const bd = await this.dataService.readBD();
      bd.medias = bd.medias || [];

      // On vérifie qu'il n'y a pas déjà une série avec le même id (doublon)
      if (bd.medias.some((m: any) => m.id === serieData.id)) {
        logger.error("Série existe déjà", { id: serieData.id });
        throw new Error("Série existe déjà");
      }

      // On crée une nouvelle instance de Serie
      const newSerie = new Serie(
        String(serieData.id),
        String(serieData.titre),
        String(serieData.genre),
        Number(serieData.year),
        Number(serieData.rating),
        this.EnStatus(serieData.statusType),
        [] // pas de saisons au début
      );
      // On ajoute la nouvelle série à la base de données
      bd.medias.push(newSerie);
      await this.dataService.writeBD(bd);

      logger.info("Série créée", { id: newSerie.id, titre: newSerie.titre });
      return newSerie;
      
    } catch (error: any) {
      logger.error("Erreur createSerie", {
        id: serieData?.id,
        error: error.message,
      });
      return null;
    }
  }
}
