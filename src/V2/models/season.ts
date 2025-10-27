import { Schema, model } from "mongoose";
import { ISeason } from "./interface/season.interface";

const seasonSchema = new Schema<ISeason>({
    seriesId: {
        type: Schema.Types.ObjectId,
        ref: "Series",
        required: true
    },
    seasonNo: {
        type: Number,
        required: true,
        min: 1
    },
    episodes: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    timestamps: true
});

//Index
seasonSchema.index({ seriesId: 1, seasonNo: 1 }, { unique: true });

export const Season = model<ISeason>("Seasons", seasonSchema);
