import { Media } from "./Media";

export class Film extends Media {
    
    constructor(
        id: string,
        titre: string,
        genre: string,
        year: number,
        rating: number,
        public duration: number,
        public watched: boolean = false
    ) {
        super(id, titre, genre, year, rating);
    }

    public override getSummary(): string {
        return ` Film • ${this.titre} Année • (${this.year}) Durée• ${this.duration} min • Note ${this.rating}/10`;
    }
}