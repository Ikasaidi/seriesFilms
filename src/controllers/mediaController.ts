import { NextFunction, Request, Response } from "express";
import { 
    listMedias, getMediaById, addMedia, updateMedia, deleteMedia
 } from "../services/mediaService";



//GET api/medias  , GET api/medias?type=serie&genre=drama&year=2020
export function getListMedias(req: Request, res: Response, next: NextFunction) {
    try {
    const { type, genre, year } = req.query;
    const filters: { type?: string; genre?: string; year?: number } = {};

    if (type) filters.type = String(type);
    if (genre) filters.genre = String(genre);
    if (year) filters.year = Number(year);

    const items = listMedias(filters);
    res.json(items); 
    } catch (error) {
        next(error);
    }

}

// GET api/medias/:id
export function getTheMediaById(req: Request, res: Response, next: NextFunction) {
    try {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({ error: "Manque media ID *" });
    }

    const media = getMediaById(id);
    if (!media) {
        return res.status(404).json({ error: "Media pas trouve" });
    }

    res.json(media);
    } catch (error) {
        next(error);
    }
}

// POST api/medias  (require Admin)
export function createMedia(req: Request, res: Response, next: NextFunction) {
    try {
        const newMedia = addMedia(req.body);
        if (!newMedia) {
            return res.status(409).json({ error: "Media deja existe" });
        }
        res.status(201).json(newMedia);
    } catch (error) {
        next(error);
    }

    
     }

// PUT api/medias/:id  (require Admin)
export function putMedia(req: Request, res: Response, next: NextFunction) {
    try {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({ error: "Manque media ID *" });
    }
    const update = updateMedia(id, req.body);
    if (!update) {
        return res.status(404).json({ error: "Media pas trouve" });
    }
    res.json(update);
    } catch (error) {
        next(error);
    }
}

// DELETE api/medias/:id  (require Admin)
export function removeMedia(req: Request, res: Response, next: NextFunction) {
    try {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({ error: "Manque media ID *" });
    }
    const deleted = deleteMedia(id);
    if (!deleted) {
        return res.status(404).json({ error: "Media pas trouve" });
    }
    res.json(deleted);
    } catch (error) {
        next(error);
    }
}