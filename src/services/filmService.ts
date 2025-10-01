import { Film } from "../models/Film";
import { Media } from "../models/Media";
import { logger } from "../utils/logger";
import { DataService, DBShape } from "./DataService";

export class FilmService {
  private dataService = new DataService();

  public async createFilm(data: any): Promise<Media | null> {
    try {
      const bd = await this.dataService.readBD();

      // Si le film existe déjà
      if ((bd.medias as Media[]).some((m) => m.id === data.id)) {
        logger.error("Film existe déjà", { id: data.id });
        return null;
      }

      // Ajouter le film
      const film = new Film(
        data.id,
        data.titre,
        data.genre,
        Number(data.year),
        Number(data.rating),
        Number(data.duration),
        Boolean(data.watched ?? false)
      );

      bd.medias.push(film);
      await this.dataService.writeBD(bd as DBShape);

      logger.info("Film créé", { id: film.id, titre: film.titre });
      return film;
    } catch (error) {
      logger.error("Erreur lors de la création du film", { error });
      return null;
    }
  }
}
