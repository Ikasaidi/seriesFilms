import { IMovie } from "./interface/movie.interface";
import { Schema, model } from "mongoose";

const movieSchema = new Schema<IMovie>(
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
    synopsis: {
      type: String,
      required: false,
      maxlength: 2000,
      trim: true,
    },
    releaseDate: {
      type: Date,
      required: false,
    },
    durationMin: {
      type: Number,
      required: true,
      min: 1,
      max: 600,
    },
  },
  {
    timestamps: true,
  }
);

// Index pour les recherches par titre
movieSchema.index({ title: 1 });

export const Movie = model<IMovie>("Movie", movieSchema);
