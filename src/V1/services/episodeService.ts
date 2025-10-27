import { logger } from "../utils/logger";
import { DataService, DBShape } from "./dataService";

export class EpisodeService {
  private data = new DataService();

  // POST /episodes ajouter un épisode à une saison
  public async addEpisode(serieId: string, seasonNumber: number, info: any) {
    try {
      const bd = await this.data.readBD();

      // On cherche la série correspondante à l'id
      const serie = (bd.medias as any[]).find((m) => m.id === serieId);
      if (!serie) {
        logger.warn("Série introuvable", { serieId });
        return null;
      }

      // On cherche la saison correspondante au numéro
      const saison = (serie.saisons ?? []).find(
        (s: any) => Number(s.seasonNumber) === Number(seasonNumber)
      );
      if (!saison) {
        logger.warn("Saison introuvable", { serieId, seasonNumber });
        return null;
      }

      // On s'assure que la propriété episodes est bien un tableau

      saison.episodes = Array.isArray(saison.episodes) ? saison.episodes : [];

      // On vérifie si l'épisode existe déjà dans la saison

      const exists = saison.episodes.find((e: any) => e.id === String(info.id));
      if (exists) {
        logger.warn("Épisode existe déjà", {
          serieId,
          seasonNumber,
          episodeId: info.id,
        });
        return null;
      }

      const episode = {
        id: String(info.id),
        titre: String(info.titre).trim(),
        episodeNumber: Number(info.episodeNumber),
        watched: Boolean(info.watched ?? false),
        duration: info.duration !== undefined ? Number(info.duration) : 0,
      };

      // Push et sauvegarde
      saison.episodes.push(episode);
      await this.data.writeBD(bd as DBShape);

      logger.info("Épisode ajouté", {
        serieId,
        seasonNumber,
        episodeId: episode.id,
      });
      return episode;
    } catch (error: any) {
      logger.error("Erreur addEpisode", {
        serieId,
        seasonNumber,
        error: error.message,
      });
      return null;
    }
  }

  // PATCH /episodes/:id —mettre à jour watched
  public async markWatched(episodeId: string, watched: boolean) {
    try {
      const bd = await this.data.readBD();
      const items = bd.medias as any[];

      // on parcourt toutes les saisons/épisodes
      for (const media of items) {
        const saisons = media?.saisons ?? [];
        for (const s of saisons) {
          const episodes = s?.episodes ?? [];
          const ep = episodes.find((e: any) => e.id === episodeId);
          if (ep) {
            
            // On met à jour le statut "watched"
            ep.watched = Boolean(watched);
            await this.data.writeBD(bd as DBShape);
            logger.info("Épisode marqué (watched)", { episodeId, watched });
            return ep;
          }
        }
      }

      logger.warn("Épisode introuvable", { episodeId });
      return null;
    } catch (error: any) {
      logger.error("Erreur markWatched", { error: error.message });
      return null;
    }
  }
}
