import { Document } from "mongoose";

export interface ISeries extends Document {
  title: string;
  genres: string[];
  status: "on-going" | "ended";
}
