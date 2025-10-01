export abstract class Media {
    
    constructor(
        public id: string,
        public titre: string,
        public genre: string,
        public year:number,
        public rating: number,
        
    ) {}

    public abstract getSummary(): string;
}