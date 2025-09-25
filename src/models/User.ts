import { Media } from "./Media";

export type UserRole = 'admin' | 'user';

export class User {

    constructor(
        public id: string,
        public email: string,
        public password: string,
        public role: UserRole,
        public favorites: Media[] = []
    ){}

    public addFavorite(media:Media) : void {
        if(!this.favorites.find( 
            af => af.id === media.id)
        ){
            this.favorites.push(media)
        }
    }

    public removeFavorite(mediaaId:string) : void {
        this.favorites = this.favorites.filter(
            rf => rf.id !== mediaaId)
    }
    
    
}