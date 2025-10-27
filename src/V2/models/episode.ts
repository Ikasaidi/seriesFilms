import { IEpisode } from "./interface/episode.interface";
import { Schema, model } from "mongoose";

const EpisodeSchema = new Schema<IEpisode>(
  {
    seriesId: {
      type: Schema.Types.ObjectId,
      ref: "Series",
      required: true,
    },
    seasonId: {
      type: Schema.Types.ObjectId,
      ref: "Season",
      required: true,
    },
    epNo: {
      type: Number,
      required: true,
      min: 1,
    },
    title: {
      type: String,
      required: true,
      maxlength: 200,
      minlength: 1,
      trim: true,
    },
    durationMin: {
      type: Number,
      required: true,
      min: 1,
      max:300,
    },
  },

  { timestamps: true }
);

//index (pas serie puisque chaque saison est liée à une série)
EpisodeSchema.index({ seasonId: 1, epNo: 1 }, { unique: true });

export const Episode = model<IEpisode>("Episode", EpisodeSchema);
