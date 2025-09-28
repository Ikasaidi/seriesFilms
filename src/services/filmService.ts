import { logger } from "../utils/logger";
import { readBD, writeBD } from "./DataService"

export function createFilm(data: any) {
    const bd = readBD();

    // Si le film existe déjà
    if ((bd.medias || []).some((m: any) => m.id === data.id)) {
        logger.error("Film existe déjà", { id: data.id });
        throw new Error("Film existe déjà", { cause: 409 });
    }

    // Ajouter le film
    const film = {
        id: data.id,
        type: "film",
        titre: data.titre,
        genre: data.genre,
        year: data.year,
        rating: data.rating,
        duration: data.duration,
        // watched est optionnel, par défaut false

        watched: Boolean(data.watched ?? false),
    };

    //pour le premier enregistrement 
    bd.medias = bd.medias || [];

    bd.medias.push(film);
    writeBD(bd);

    logger.info("Film créé", { id: film.id, titre: film.titre });
    return film;

    
}