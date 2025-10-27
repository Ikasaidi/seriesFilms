import { Types } from "mongoose";
import { Season } from "../models/season";
import { Series } from "../models/series";
import { HttpException } from "../utils/http-exception";

// ===========================================================
// SEASON SERVICE
// - Création et liste des saisons d’une série
// ===========================================================
export class SeasonService {

  // ---------------------------------------------------------
  // CREATE
  // - 404 si série introuvable
  // - 400 si seasonNo manquant
  // ---------------------------------------------------------
  async createSeason(seriesId: string, data: any) {

    const series = await Series.findById(seriesId);
    if (!series) throw new HttpException(404, "Série introuvable");

     // Récupérer les champs requis depuis le body
    const { seasonNo } = data;
    if (seasonNo == null) throw new HttpException(400, "seasonNo est requis");

    const season = await Season.create({
        seriesId,   
      seasonNo,
      episodes: 0           
    });
    
    return season;
  }

  // ---------------------------------------------------------
  // LIST BY SERIES
  // - Retourne toutes les saisons d’une série
  // - 422 si seriesId invalide
  // ---------------------------------------------------------
  async getSeasonsBySeries(seriesId: string) {
    if (!Types.ObjectId.isValid(seriesId)) {
    throw new HttpException(422, "seriesId invalide");
  }
 
  return Season.find({ seriesId });
  }
}
