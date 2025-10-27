import { Document, Types } from "mongoose";

export interface IEpisode extends Document {
  seriesId: Types.ObjectId;
  seasonId: Types.ObjectId;
  epNo: number;
  title: string;
  durationMin: number;
}
