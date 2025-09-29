import { Media } from "../models/Media";
import { readBD,writeBD } from "./DataService";
import { logger } from "../utils/logger";

//lister tout les medias
export function listMedias(filters?: { type?: string; genre?: string; year?: number }){
    const bd = readBD();
    let items = (bd.medias || []) as any[];

    if (filters) {
        const { type, genre, year } = filters;
        if (type) {
            items = items.filter(item => item.type.toLowerCase() === type.toLowerCase());
        }
        if (genre) {
            items = items.filter(item => item.genre.toLowerCase() === genre.toLowerCase());
        }
        if (year) {
            items = items.filter(item => Number(item.year) === year);
        }
    }
    logger.info("Liste des médias", { count: items.length, filters });
    return items;
}

//Obtenir un contenu par son ID
export function getMediaById(id: string): Media | null {
    const bd = readBD();
    const media = (bd.medias as Media[]).find(m => m.id === id);
    
    if(!media) {
        logger.warn("media non trouvé", { id });
        return null;
    }else {
        logger.info("media trouvé", { id });
    }
    return media;
    
}

//add a media require Admin
export function addMedia(media: Media): Media | null {
    const bd = readBD();
    const exist = (bd.medias as Media[]).find(m => m.id === media.id) ;
    if (exist) {
        logger.warn("media existe déjà", { id: media.id });
        return null;
    }

    bd.medias.push(media);
    writeBD(bd);
    logger.info("media ajouté", { id: media.id , titre: media.titre});
    return media;
}

//update a media require Admin
export function updateMedia(id: string, updatedMedia: Partial<Media>): Media | null {
    const bd = readBD();
    const media = (bd.medias as Media[]).find(m => m.id === id);

    if (!media) {
        logger.warn("media non trouvé", { id: id });
        return null;
    }

    delete (updatedMedia as any).id; //pour pas enlever l'id

    Object.assign(media, updatedMedia);
    writeBD(bd);

    logger.info("media mis à jour", { id: id, titre: media.titre });
    return media;
}

//delete a media require Admin
export function deleteMedia(id: string): Media | null {
    const bd = readBD();
    const index = (bd.medias as Media[]).findIndex(m => m.id === id);

    if (index === -1) {
        logger.warn("media non trouvé", { id: id });
        return null;
    }

    const deletedMedia = bd.medias.splice(index, 1)[0];
    writeBD(bd);

    logger.info("media supprimé", { id: id, titre: deletedMedia.titre });
    return deletedMedia;
}