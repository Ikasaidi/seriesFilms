import { Request, Response } from "express";
import { FilmService } from "../services/filmService";

//POST /films Valide Ajout d’un film avec tous les champs

export class FilmController {

    private filmService = new FilmService();
    

    public createFilm = async(req: Request, res: Response): Promise<void> => {
        const newFilm = await this.filmService.createFilm(req.body);
        if (newFilm) {
            res.status(201).json(newFilm);
        } else {
            res.status(400).json({ error: "Film non créé" });
        }
    }
}