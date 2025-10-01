import { Media } from "../models/Media";
import { logger } from "../utils/logger";
import { DataService } from "./dataService";

export class UserService {
  private dataService = new DataService();

  public async getMediaByUserId(userId: string): Promise<Media[] | null> {
    try {

      // On lit la base de données 
      const bd = await this.dataService.readBD();

      // On cherche l'utilisateur correspondant à l'id
      const user = (bd.users as any[]).find((u: any) => u.id === userId);

      // Si l'utilisateur n'existe pas, on log un avertissement et on retourne null
      if (!user) {
        logger.warn("Utilisateur introuvable", { id: userId });
        return null;
      }

      // Sinon on récupère la liste des favoris de l'utilisateur
      const favs = user.favorites;

      // On filtre les médias pour ne garder que ceux qui sont dans les favoris
      const medias = ((bd.medias as Media[]) || []).filter((m) =>
        favs.includes(m.id)
      );

      logger.info("Médias listés pour l'utilisateur", {
        id: userId,
        count: medias.length,
      });

       // On retourne la liste des médias favoris
      return medias;
    } catch (error) {
      logger.error(
        "Erreur lors de la récupération des médias par utilisateur",
        { error }
      );
      return null;
    }
  }
}
