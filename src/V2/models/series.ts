import { ISeries } from "./interface/series.interface";
import { Schema, model } from "mongoose";

const seriesSchema = new Schema<ISeries>(
  {
    title: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 200,
      trim: true,
    },
    genres: {
      type: [String],
      required: true,
      validate: {
        validator: (arr: string[]) =>
          arr.every((g) => g.length >= 1 && g.length <= 30),
        message: "Chaque genre doit avoir entre 1 et 30 caractères",
      },
    },
    status: {
      type: String,
      required: true,
      enum: ["on-going", "ended"],
      default: "on-going",
    },
  },
  { timestamps: true }
);

seriesSchema.index({ title: 1 });

export const Series = model<ISeries>("Series", seriesSchema);
