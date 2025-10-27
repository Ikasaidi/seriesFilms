import fs from "fs";
import path from "path";
import { logger } from "../utils/logger";

const BD_PATH = path.join(__dirname, "../data/db.json"); 

export interface DBShape {
  medias: any[];
  users: any[];
}

export class DataService {


 public async readBD():Promise<DBShape>{
    try{
        const file = fs.readFileSync(BD_PATH, "utf-8");
        const bd = JSON.parse(file);
        logger.info("BD lecturée avec succès");
        return {
            medias: bd.medias || [],
            users: bd.users || []
        };
    }catch(err : any){
        logger.error("Erreur lors de la lecture de la BD", {error: err.message});
        return {medias: [], users: []}; //vide si erreur
    }
}

 public async writeBD(data: any):Promise<boolean>{
    try{
        const json = JSON.stringify(data, null, 2);
        fs.writeFileSync(BD_PATH, json, "utf-8");
        logger.info("BD écrite avec succès");
        return true;
    }catch(err){
        logger.error("Erreur lors de l'écriture de la BD", {error: err});
        return false;
    }
}

}

