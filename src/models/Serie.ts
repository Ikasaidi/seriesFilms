import { Media } from './Media';
import {Saison} from './Saison';

export type statusType = "En cours" | "Terminée";

export class Serie extends Media {

    constructor(
        id: string,
        titre: string,
        genre: string,
        year: number,
        rating: number,
        public status: statusType, 
        public saisons: Saison[] = []
    ) {
        super(id, titre, genre, year, rating);
    }

    public override getSummary(): string {
        return ` Série • ${this.titre} Année • (${this.year}) Genre • ${this.genre} • Note ${this.rating}/10 • Status ${this.status} • Saison(s) ${this.saisons.length}`;
    }

    public markEpisodeAsWatched(episodeId: string): void {
        for (const s of this.saisons ){
            const ep = s.episodes.find(
                e => e.id === episodeId
            )

            if(ep){
                ep.watched = true;
                return;
            }
        }
            
    }

}