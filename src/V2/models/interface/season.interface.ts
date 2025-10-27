import { Document, Types } from "mongoose";

export interface ISeason extends Document {
  seriesId: Types.ObjectId; // ref vers la série
  seasonNo: number;
  episodes: number; 
}
