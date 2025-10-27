import { Schema, model } from "mongoose";
import { IRating } from "./interface/rating.interfacen";

const ratingSchema = new Schema<IRating>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    target: {
      type: String,
      enum: ["Movie", "Series", "Episode"],
      required: true,
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "target",
    },
    score: {
      type: Number,
      min: 0,
      max: 10,
      required: true,
    },
    review: {
      type: String,
      maxlength: 2000,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// pour éviter les doublons
ratingSchema.index({ userId: 1, target: 1, targetId: 1 }, { unique: true });

// Pour les moyennes
ratingSchema.index({ target: 1, targetId: 1 });

export const Rating = model<IRating>("Rating", ratingSchema);
