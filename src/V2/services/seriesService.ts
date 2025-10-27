import { Season } from "../models/season";
import { Series } from "../models/series";
import { HttpException } from "../utils/http-exception";

// ===========================================================
// SERIES SERVICE
// - Liste filtrée, création, lecture détaillée (avec saisons)
// ===========================================================
export class SeriesService {

  // ---------------------------------------------------------
  // LIST
  // - Filtres: title (regex), genre (in), status
  // - Tri sur createdAt décroissant
  // ---------------------------------------------------------
  async listSeries(query: any) {
    const { title, genre, status } = query;
    const filters: any = {};

    if (title) filters.title = { $regex: title, $options: "i" };
    if (genre) filters.genres = { $in: [genre] };
    if (status) filters.status = status;

    return await Series.find(filters).sort({ createdAt: -1 });
  }

  // ---------------------------------------------------------
  // CREATE
  // ---------------------------------------------------------
  async createSeries(data: any) {
    const series = new Series(data);
    await series.save();
    return series;
  }

  // ---------------------------------------------------------
  // READ BY ID (+ saisons)
  // - 404 si introuvable
  // - Renvoie l’objet série + un tableau "seasons"
  // ---------------------------------------------------------

  async getSeriesById(id: string) {
    const series = await Series.findById(id);
    if (!series) throw new HttpException(404, "Série introuvable");

    const seasons = await Season.find({seriesId:id}).select("seasonNo episode createdAt updatedAt");
    return {...series.toObject(), seasons};
  }
}
