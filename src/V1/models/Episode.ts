export class Episode {
    constructor(
        public id: string,
        public titre: string,
        public duration: number,
        public episodeNumber: number,
        public watched : boolean = false
    ){}
    
}