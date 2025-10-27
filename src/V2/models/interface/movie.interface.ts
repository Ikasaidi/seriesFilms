import { Document } from "mongoose";

export interface IMovie extends Document {
  title: string;
  genres: string[];
  synopsis?: string;
  releaseDate?: Date;
  durationMin: number;
}
