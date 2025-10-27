import { Document, Types } from "mongoose";

export interface IUser extends Document {
  email: string;
  name: string;
  username: string;
  password: string;
  role: "user" | "admin";
  favorites?: {
    movies?: Types.ObjectId[];
    series?: Types.ObjectId[];
  };
}
