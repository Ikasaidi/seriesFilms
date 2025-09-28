import fs from "fs";
import path from "path";
import { logger } from "../utils/logger";

const BD_PATH = path.join(process.cwd(), "data", "db.json");

export function readBD():any{
    try{
        const file = fs.readFileSync(BD_PATH, "utf-8");
        const bd = JSON.parse(file);
        logger.info("BD lecturée avec succès");
        return bd;
    }catch(err : any){
        logger.error("Erreur lors de la lecture de la BD", {error: err.message});
        return {medias: [], users: []};
    }
}

export function writeBD(data: any):void{
    try{
        const json = JSON.stringify(data, null, 2);
        fs.writeFileSync(BD_PATH, json, "utf-8");
        logger.info("BD écrite avec succès");
    }catch(err){
        logger.error("Erreur lors de l'écriture de la BD", {error: err});
    }
}