import { Episode } from "../models/episode";
import { Season } from "../models/season";
import { HttpException } from "../utils/http-exception";

// ===========================================================
// EPISODE SERVICE
// - Création d’un épisode, listing par saison
// ===========================================================

export class EpisodeService {

  // ---------------------------------------------------------
  // CREATE
  // - 404 si la saison n’existe pas
  // - 422 si champs requis manquants (epNo/title/durationMin)
  // ---------------------------------------------------------
  async createEpisode(seriesId: string, seasonId: string, data: any) {
    const season = await Season.findById(seasonId);
    if (!season) 
        throw new HttpException(404, "Saison introuvable");

    const { epNo, title, durationMin, releaseDate } = data;
    if (epNo == null || !title || durationMin == null) {
      throw new HttpException(422, "epNo, title et durationMin sont requis");
    }

    const episode = await Episode.create({
        seriesId,
       seasonId,
      epNo,
      title,
      durationMin, 
      releaseDate
    })

     //Incrémenter le compteur d’épisodes dans la saison
    season.episodes = (season.episodes || 0) + 1;
    await season.save();

    return episode
  }

  // ---------------------------------------------------------
  // LIST
  // - Récupère tous les épisodes d’une saison
  // - Filtre optionnel par minDuration
  // ---------------------------------------------------------
  async getEpisodes(seasonId: string, query: any) {
    const season = await Season.findById(seasonId);
    if (!season) throw new HttpException(404, "Saison introuvable");

    const { minDuration } = query;
    let episodes = await Episode.find({ seasonId });

    if (minDuration) {
      episodes = episodes.filter((e) => e.durationMin >= Number(minDuration));
    }

    return episodes;
  }
}
