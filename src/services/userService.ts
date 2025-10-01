import { Media } from "../models/Media";
import { logger } from "../utils/logger";
import { DataService } from "./DataService";

export class UserService {
  private dataService = new DataService();

  public async getMediaByUserId(userId: string): Promise<Media[] | null> {
    try {
      const bd = await this.dataService.readBD();
      const user = (bd.users as any[]).find((u: any) => u.id === userId);

      if (!user) {
        logger.warn("Utilisateur introuvable", { id: userId });
        return null;
      }

      const favs = user.favorites;
      const medias = ((bd.medias as Media[]) || []).filter((m) =>
        favs.includes(m.id)
      );

      logger.info("Médias listés pour l'utilisateur", {
        id: userId,
        count: medias.length,
      });
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
