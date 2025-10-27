import { Movie } from "../models/movie";
import { HttpException } from "../utils/http-exception";

// ===========================================================
// MOVIE SERVICE
// - Listing filtré/paginé, CRUD film
// ===========================================================
export class MovieService {


  // ---------------------------------------------------------
  // LIST (avec filtres)
  // - Filtres: title (regex), genre, minYear, maxDur, page, limit
  // - Trie par releaseDate décroissante
  // ---------------------------------------------------------
  async listMovies(queryParams: any) {
    
    const { title, genre, minYear, maxDur, page = 1, limit = 10 } = queryParams;
    const filters: any = {};

    // Si un titre est fourni, on cherche par regex insensible à la casse
    if (title) {
      filters.title = { $regex: title, $options: "i" };
    }
    if (genre) {
      filters.genres = { $in: [genre] };
    }
    if (minYear) {
      filters.releaseDate = { $gte: new Date(`${minYear}-01-01`) };
    }
    if (maxDur) {
      filters.durationMin = { $lte: Number(maxDur) };
    }

    // Limite maximale de 100 
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(Math.max(1, Number(limit)), 100);

    // Compter le total de films correspondant aux filtres
    const total = await Movie.countDocuments(filters);

    // Calculer le nombre total de pages
    const pages = Math.ceil(total / limitNum);

    // Récupérer les films avec tri récent
    const items = await Movie.find(filters)
      .sort({ releaseDate: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    // Retour clair et complet
    return {
      total,
      page: pageNum,
      pages,
      limit: limitNum,
      items,
    };
  }

  // ---------------------------------------------------------
  // CREATE (admin)
  // ---------------------------------------------------------
  async createMovie(data: any) {
    const movie = new Movie(data);
    await movie.save();
    return movie;
  }

  // ---------------------------------------------------------
  // READ BY ID
  // ---------------------------------------------------------
  
  async getMovieById(id: string) {
    const movie = await Movie.findById(id);
    if (!movie) throw new HttpException(404, "Film introuvable");
    return movie;
  }

  // ---------------------------------------------------------
  // UPDATE BY ID (admin)
  // - 404 si introuvable
  // ---------------------------------------------------------
  async updateMovie(id: string, data: any) {
    const movie = await Movie.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!movie) throw new HttpException(404, "Film introuvable");
    return movie;
  }

  // ---------------------------------------------------------
  // DELETE  BY ID (admin)
  // - 404 si introuvable
  // ---------------------------------------------------------
  async deleteMovie(id: string) {
    const movie = await Movie.findByIdAndDelete(id);
    if (!movie) throw new HttpException(404, "Film introuvable");
    return movie;
  }
}
