import { Request, Response } from "express";
import { SerieService } from "../services/serieService";
//GET api/series/:id/episodes

export class SerieController {

    private serieService = new SerieService();

    public getEpisodesFromASerie = async (req: Request, res: Response): Promise<void> => {
   
        const serieId = String(req.params.id);
        const episodes = await this.serieService.getEpisodesBySerieId(serieId);
        if (!episodes) {
            res.status(404).json({ error: "Série introuvable" });
            return;
        }
        res.json(episodes);
        
}

    public createNewSerie = async (req: Request, res: Response): Promise<void> => {
   
        const serieData = req.body;
        const newSerie = await this.serieService.createSerie(serieData);
        if (!newSerie) {
            res.status(400).json({ error: "Série déjà existante " });
            return;
        }
        res.status(201).json(newSerie);
    


}

}