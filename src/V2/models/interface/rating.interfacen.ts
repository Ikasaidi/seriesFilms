import { Document, Types } from "mongoose";

export interface IRating extends Document {
  userId: Types.ObjectId;
  target: "Movie" | "Series";
  targetId: Types.ObjectId;
  score: number;
  review?: string;
}
