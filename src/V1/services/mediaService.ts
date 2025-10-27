import { Media } from "../models/Media";
import { DataService, DBShape } from "./dataService";
import { logger } from "../utils/logger";

// Type pour filtrer les médias par genre ou année
export type MediaFilters = { genre?: string; year?: number };

export class MediaService {
  private data = new DataService();

  //lister tout les medias
  public async listMedias(filters?: MediaFilters): Promise<Media[]> {
    try {
      const bd = await this.data.readBD();
      let items: Media[] = bd.medias as Media[];

      // Si des filtres sont fournis, on filtre les résultats

      if (filters) {
        if (filters.genre) {
          items = items.filter(
            (item) => item.genre.toLowerCase() === filters.genre!.toLowerCase()
          );
        }
        if (filters.year) {
          items = items.filter((item) => Number(item.year) === filters.year);
        }
      }
      logger.info("Liste des médias", { count: items.length, filters });
      return items;
    } catch (error: any) {
      logger.error("Erreur lors de la récupération des médias", {
        error: error.message,
      });
      return [];
    }
  }

  //Obtenir un contenu par son ID
  public async getMediaById(id: string): Promise<Media | null> {
    try {
      const bd = await this.data.readBD();
      // On cherche le média correspondant à l'id

      const media = (bd.medias as Media[]).find((m) => m.id === id) || null;

      if (!media) {
        logger.warn("media non trouvé", { id });
      }
      return media;
    } catch (error: any) {
      logger.error("Erreur lors de la récupération du média", {
        id,
        error: error.message,
      });
      return null;
    }
  }

  //add a media require Admin
  public async addMedia(info: any): Promise<Media | null> {
    try {
      const bd = await this.data.readBD();
      const items = bd.medias as Media[];
      const id = String(info.id).trim();

      // On vérifie que l'id est présent
      if (!id) {
        logger.warn("media.add: id manquant");
        return null;
      }

      // On vérifie qu'il n'existe pas déjà un média avec cet id

      const exist = items.find((m) => m.id === info.id);
      if (exist) {
        logger.warn("media existe déjà", { id: info.id });
        return null;
      }

      // On crée le nouvel objet Media

      const media: Media = {
        id: info.id,
        titre: info.titre,
        genre: info.genre,
        year: Number(info.year),
        rating: Number(info.rating),
        getSummary: () =>
          `Titre: ${info.titre}, Genre: ${info.genre}, Année: ${info.year}, Rating: ${info.rating}`,
      };

      items.push(media);
      bd.medias = items;
      await this.data.writeBD(bd);

      logger.info("media ajouté", { id: media.id, titre: media.titre });
      return media;
    } catch (error: any) {
      logger.error("Erreur lors de l'ajout du média", {
        id: info.id,
        error: error.message,
      });
      return null;
    }
  }

  //update a media require Admin
  public async updateMedia(
    id: string,
    updatedMedia: Partial<Media>
  ): Promise<Media | null> {
    try {
      const bd = await this.data.readBD();
      // On cherche le média à mettre à jour
      const media = (bd.medias as Media[]).find((m) => m.id === id);

      if (!media) {
        logger.warn("media non trouvé", { id: id });
        return null;
      }

      //Faut pas changer le id
      if ("id" in updatedMedia) {
        delete (updatedMedia as any).id;
      }

      // On met à jour les propriétés du média
      Object.assign(media, updatedMedia);
      await this.data.writeBD(bd);

      logger.info("media mis à jour", { id: id, titre: media.titre });
      return media;
    } catch (error: any) {
      logger.error("Erreur lors de la mise à jour du média", {
        id: id,
        error: error.message,
      });
      return null;
    }
  }

  //delete a media require Admin
  public async deleteMedia(id: string): Promise<Media | null> {
    try {
      const bd = await this.data.readBD();
      // On cherche l'index du média à supprimer
      const index = (bd.medias as Media[]).findIndex((m) => m.id === id);

      // Si le média n'existe pas, on log un avertissement
      if (index === -1) {
        logger.warn("media non trouvé", { id: id });
        return null;
      }
      // On retire le média du tableau

      const deletedMedia = bd.medias.splice(index, 1)[0];
      await this.data.writeBD(bd);

      logger.info("media supprimé", { id: id, titre: deletedMedia.titre });
      return deletedMedia;
    } catch (error: any) {
      logger.error("Erreur lors de la suppression du média", {
        id: id,
        error: error.message,
      });
      return null;
    }
  }
}
