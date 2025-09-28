import { logger } from "../utils/logger";
import { readBD } from "./DataService";

export function getMediaByUserId(userId: string) {
    const bd = readBD();
    const user = (bd.users || []).find((u: any) => u.id === userId);

    if (!user) {
        logger.warn("Utilisateur introuvable", { id: userId });
        return null;
    }

    const favs = user.favorites ;
    const medias = favs.map((f: string) => 
        (bd.medias || []).filter((m: any) => m.id === f).filter(Boolean));
    

    logger.info("Médias listés pour l'utilisateur", { id: userId, count: medias.length });
    return medias;

}
