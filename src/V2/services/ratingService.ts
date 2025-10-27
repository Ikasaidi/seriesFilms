import { Rating } from "../models/rating";
import { HttpException } from "../utils/http-exception";
import { Types } from "mongoose";

// ===========================================================
// RATING SERVICE
// - Création d’une note + moyennes film/série
// ===========================================================
export class RatingService {
  
  // ---------------------------------------------------------
  // CREATE
  // - 422 si champs requis manquants (target/targetId/score)
  // - 422 si target ∉ {Movie, Episode} 
  // - 422 si review > 2000 / score hors [0..10]
  // ---------------------------------------------------------
  async createRating(userId: string, data: any) {
    const { target, targetId, score, review } = data;

    if (!target || !targetId || score == null) {
      throw new HttpException(
        422,
        "Les champs target, targetId et score sont requis"
      );
    }

    if (!["Movie", "Episode"].includes(target)) {
      throw new HttpException(422, "Target doit être 'Movie' ou 'Episode'");
    }

    if (review && review.length > 2000) {
      throw new HttpException(
        422,
        "Le commentaire ne doit pas dépasser 2000 caractères"
      );
    }
    if (score < 0 || score > 10) {
      throw new HttpException(422, "Le score doit être entre 0 et 10");
    }

    const rating = new Rating({
      userId,
      target,
      targetId,
      score,
      review,
    });

    await rating.save();
    return rating;
  }

  // ---------------------------------------------------------
  // AVG MOVIE
  // - Calcule moyenne et total pour un film donné
  // ---------------------------------------------------------
  async getMovieAverage(movieId: string) {
    const result = await Rating.aggregate([
      { $match: { target: "Movie", targetId: new Types.ObjectId(movieId) } },
      {
        $group: { _id: null, avgScore: { $avg: "$score" }, total: { $sum: 1 } },
      },
    ]);

    return result[0] || { avgScore: 0, total: 0 };
  }

  // ---------------------------------------------------------
  // AVG SERIES
  // - Filtre les ratings des épisodes de la série
  // ---------------------------------------------------------
 async getSeriesAverage(seriesId: string) {
  const result = await Rating.aggregate([
    // Relier les ratings à leurs épisodes
    {
      $lookup: {
        from: "episodes",
        localField: "targetId",
        foreignField: "_id",
        as: "episodeInfo",
      },
    },
    // Ne garder que les ratings d’épisodes appartenant à la série
    { $unwind: "$episodeInfo" },
    {
      $match: {
        "episodeInfo.seriesId": new Types.ObjectId(seriesId),
        target: "Episode" 
      },
    },
    // Calculer la moyenne
    {
      $group: {
        _id: null,
        avgScore: { $avg: "$score" },
        total: { $sum: 1 },
      },
    },
  ]);

  return result[0] || { success: true, avgScore: 0, total: 0 };
}

}
