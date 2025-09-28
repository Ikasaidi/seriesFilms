import { readBD, writeBD } from "./DataService";
import { logger } from "../utils/logger";


export function getEpisodesBySerieId(serieId: string) {
  const bd = readBD();
  const serie = (bd.medias || []).find((m: any) => m.id === serieId);

  if (!serie) {
    logger.warn("Série introuvable", { id: serieId });
    return null;
  }

  const saisons = Array.isArray(serie.saisons) ? serie.saisons : [];
  const episodes = saisons.flatMap((s: any) => s.episodes || []);

  logger.info("Épisodes listés pour la série", { id: serieId, count: episodes.length });
  return episodes;
}

export function createSerie(serieData: any) {
  const bd = readBD();
  bd.medias = bd.medias || [];

  // doublon id
  if (bd.medias.some((m: any) => m.id === serieData.id)) {
    logger.error("Série existe déjà", { id: serieData.id });
    throw new Error("Série existe déjà");
  }

  const newSerie = {
    id: serieData.id,
    type: "serie",
    titre: serieData.titre,
    genre: serieData.genre,
    year: serieData.year,
    rating: serieData.rating,
    status: serieData.status,       
    saisons: [] as any[],
  };
  
  bd.medias.push(newSerie);
  writeBD(bd);
  logger.info("Série créée", { id: newSerie.id, titre: newSerie.titre });
  return newSerie;
}

export function addSeasonToSerie(serieId: string, anneeSortie: number, saisonNumber: number) {
  const bd = readBD();
  const serie = (bd.medias || []).find((m: any) => m.id === serieId && m.type === "serie");

  if (!serie) {
    logger.error("Série introuvable", { id: serieId });
    throw new Error("Série introuvable");
  }

  // Vérifier si la saison existe déjà
  const saisonExistante = serie.saisons.find((s: any) => s.seasonNumber === saisonNumber);
  if (saisonExistante) {
    logger.warn("La saison existe déjà", { serieId, saisonNumber });
    return null;
  }

  // Ajouter la nouvelle saison
  const nouvelleSaison = {
    seasonNumber: saisonNumber,
    releaseDate: new Date(anneeSortie, 0, 1).toISOString(),
    episodes: [] as any[],
  };
  serie.saisons.push(nouvelleSaison);

  writeBD(bd);
  logger.info("Saison ajoutée à la série", { serieId, saisonNumber });
  return nouvelleSaison;
}


export function addEpisodeToSeason(serieId: string, saisonNumber: number, episodeData: any) {
  const bd = readBD();
  const serie = (bd.medias || []).find((m: any) => m.id === serieId && m.type === "serie");

  if (!serie) {
    logger.error("Série introuvable", { id: serieId });
    throw new Error("Série introuvable");
  }

  const saison = (serie.saisons || []).find((s: any) => s.seasonNumber === saisonNumber);
  if (!saison) {
    logger.error("Saison introuvable", { serieId, saisonNumber });
    throw new Error("Saison introuvable");
  }

  // Vérifier si l'épisode existe déjà
  const episodeExistante = (saison.episodes || []).find((e: any) => e.id === episodeData.id);
  if (episodeExistante) {
    logger.warn("L'épisode existe déjà", { serieId, saisonNumber, episodeId: episodeData.id });
    return null;
  }

  // Ajouter l'épisode
  const nouvelEpisode = {
    id: String(episodeData.id),
    titre: String(episodeData.titre).trim(),
    episodeNumber: Number(episodeData.episodeNumber),
    watched: Boolean(episodeData.watched ?? false),
    ...(episodeData.duration ? { duration: episodeData.duration } : { duration: 0 }),
  };
  saison.episodes = saison.episodes || [];
  saison.episodes.push(nouvelEpisode);

  writeBD(bd);
  logger.info("Épisode ajouté à la saison", { serieId, saisonNumber, episodeId: nouvelEpisode.id });
  return nouvelEpisode;
}

export function markEpisodeAsWatched(episodeId: string, watched: boolean) {
  const bd = readBD();
  const episode = (bd.medias || [])
      .flatMap((m: any) => m.saisons || [])
      .flatMap((s: any) => s.episodes || [])
      .find((e: any) => e.id === episodeId);

  if (!episode) {
    logger.error("Épisode introuvable", { id: episodeId });
    throw new Error("Épisode introuvable");
  }

  episode.watched = Boolean(watched);
  writeBD(bd);

  logger.info("Épisode marqué comme vu", { id: episodeId, watched });
  return episode;
}
